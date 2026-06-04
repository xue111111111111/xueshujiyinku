import { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Archive,
  Download,
  Star,
  BookOpen,
  FileText,
  GraduationCap,
  Trophy,
  Tag,
  X,
  ChevronDown,
  GitBranch,
  Award,
  Crown,
  Eye,
  ExternalLink,
  Clock,
  GitCompare,
  Network,
  MessageSquare
} from 'lucide-react';
import { getAssets, addAsset, deleteAsset, updateAsset, getUsers, forkAsset, addMergeRequest, getAssets as getAssetsUtil, getCitations } from '../utils/storage';
import { courseLibrary, teachers, schools } from '../data/mockData';
import { useApp } from '../context/AppContext';
import VersionHistory from './VersionHistory';
import Discussion from './Discussion';
import { KnowledgeGraph } from './KnowledgeGraph';
import { AISummary } from './AISummary';
import MarkdownEditor from './MarkdownEditor';

const assetTypes = ['笔记', '实验报告', '课程设计', '毕设', '竞赛作品'];
const semesters = ['2023春', '2023秋', '2024春', '2024秋', '2025春'];

const getSchoolById = (schoolId) => {
  return schools.find(s => s.id === schoolId);
};

export const Assets = () => {
  const { currentUser, theme } = useApp();
  
  // 根据角色过滤资产
  const getAllAssets = () => {
    const allAssets = getAssets();
    // 老师只能看到自己课程的资料
    if (currentUser?.role === 'teacher') {
      return allAssets.filter(asset => asset.teacher === currentUser.name);
    }
    // 管理员和学生可以看到全部
    return allAssets;
  };
  
  const [assets, setAssets] = useState(getAllAssets());
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ type: '', course: '', teacher: '', grade: '', school: '' });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSchoolFilter, setShowSchoolFilter] = useState(false);
  const [schoolSearchInput, setSchoolSearchInput] = useState('');
  const [showMarkdownEditor, setShowMarkdownEditor] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: '笔记',
    course: '',
    teacher: '',
    grade: '',
    semester: '',
    description: '',
    tags: [],
    score: 0,
    versionNote: ''
  });
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentDetailAsset, setCurrentDetailAsset] = useState(null);
  const [detailTab, setDetailTab] = useState('info');

  const allCourses = [...courseLibrary.public, ...courseLibrary.professional, ...courseLibrary.general];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || asset.type === filters.type;
    const matchesCourse = !filters.course || asset.course === filters.course;
    const matchesTeacher = !filters.teacher || asset.teacher === filters.teacher;
    const matchesGrade = !filters.grade || asset.grade === filters.grade;
    const matchesSchool = !filters.school || asset.school === filters.school;
    return matchesSearch && matchesType && matchesCourse && matchesTeacher && matchesGrade && matchesSchool;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedAsset) {
      const assets = getAssets();
      const assetIndex = assets.findIndex(a => a.id === selectedAsset.id);
      if (assetIndex !== -1) {
        const existingAsset = assets[assetIndex];
        const currentVersions = existingAsset.versions || [];
        const lastVersion = currentVersions.length > 0 ? currentVersions[currentVersions.length - 1] : null;
        
        let newVersionNumber = 'v1.0';
        if (lastVersion) {
          const match = lastVersion.versionNumber.match(/v(\d+)\.(\d+)/);
          if (match) {
            const major = parseInt(match[1]);
            const minor = parseInt(match[2]) + 1;
            newVersionNumber = `v${major}.${minor}`;
          }
        }
        
        const newVersion = {
          id: `v${Date.now()}`,
          versionNumber: newVersionNumber,
          author: currentUser.id,
          submittedAt: new Date().toLocaleString(),
          description: formData.versionNote,
          content: formData.description
        };
        
        assets[assetIndex] = {
          ...existingAsset,
          ...formData,
          versions: [...currentVersions, newVersion]
        };
        
        localStorage.setItem('assets', JSON.stringify(assets));
        setAssets(getAssets());
      }
    } else {
      const newAsset = { 
        ...formData, 
        uploader: currentUser.id, 
        school: currentUser.school, 
        downloads: 0, 
        citations: 0, 
        likes: 0, 
        isCase: false,
        createdAt: new Date().toISOString().split('T')[0],
        references: formData.references || [],
        versions: [{
          id: `v${Date.now()}`,
          versionNumber: 'v1.0',
          author: currentUser.id,
          submittedAt: new Date().toLocaleString(),
          description: formData.versionNote,
          content: formData.description
        }]
      };
      addAsset(newAsset);
      setAssets(getAssets());
    }
    setShowModal(false);
    setFormData({ title: '', type: '笔记', course: '', teacher: '', grade: '', semester: '', description: '', tags: [], score: 0, versionNote: '', references: [] });
    setIsEditing(false);
    setSelectedAsset(null);
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setIsEditing(true);
    setFormData({
      title: asset.title,
      type: asset.type,
      course: asset.course,
      teacher: asset.teacher,
      grade: asset.grade,
      semester: asset.semester,
      description: asset.description,
      tags: asset.tags || [],
      score: asset.score,
      versionNote: '',
      references: asset.references || []
    });
    setShowModal(true);
  };

  const handleDelete = (assetId) => {
    if (window.confirm('确定要删除这个学习产出吗？')) {
      deleteAsset(assetId);
      setAssets(getAssets());
    }
  };

  const handleTagToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  const availableTags = ['优秀', '创新', '实用', '完整'];

  const getTypeIcon = (type) => {
    switch (type) {
      case '笔记': return <BookOpen className="w-4 h-4" />;
      case '实验报告': return <FileText className="w-4 h-4" />;
      case '课程设计': return <GraduationCap className="w-4 h-4" />;
      case '毕设': return <FileText className="w-4 h-4" />;
      case '竞赛作品': return <Trophy className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case '笔记': return 'bg-blue-100 text-blue-700';
      case '实验报告': return 'bg-green-100 text-green-700';
      case '课程设计': return 'bg-purple-100 text-purple-700';
      case '毕设': return 'bg-red-100 text-red-700';
      case '竞赛作品': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const canEditOrDelete = (asset) => {
    return currentUser?.role === 'admin' || asset.uploader === currentUser?.id;
  };

  const generateCitation = (asset, format) => {
    const author = getUsers().find(u => u.id === asset.uploader);
    const authorName = author?.name || '未知作者';
    const title = asset.title || '无标题';
    const year = asset.createdAt?.split('-')[0] || new Date().getFullYear();

    switch (format) {
      case 'gbt':
        return `${authorName}. ${title}[EB/OL]. [${year}-${asset.createdAt?.split('-')[1] || '01'}-${asset.createdAt?.split('-')[2]?.split(' ')[0] || '01'}]. https://academiclibrary.edu/${asset.id}.`;
      case 'apa':
        return `${authorName.split('').reverse().join('').match(/(\S+)\s*/)?.[1]?.split('').reverse().join('') || authorName.split(' ')[0]}, ${authorName.charAt(0)}. (${year}). ${title}. Retrieved from https://academiclibrary.edu/${asset.id}`;
      case 'mla':
        return `${authorName}. "${title}." Academic Library, ${year}, https://academiclibrary.edu/${asset.id}.`;
      default:
        return `${authorName}. ${title}. ${year}.`;
    }
  };

  const canCreateRelay = (asset) => {
    return currentUser?.role === 'teacher' || asset.uploader === currentUser?.id;
  };

  const handleCreateRelay = (asset) => {
    const relayData = {
      title: asset.title,
      description: asset.description,
      existingAchievements: [asset.id],
      originalAuthor: asset.uploader,
      course: asset.course,
      teacher: asset.teacher
    };
    localStorage.setItem('relayDraft', JSON.stringify(relayData));
    window.location.href = '/#/relay';
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleFork = (asset) => {
    const forked = forkAsset(asset.id, currentUser.id);
    if (forked) {
      setAssets(getAllAssets());
      alert(`已成功复刻 "${asset.title}"，可以在您的学习产出列表中找到。`);
    } else {
      alert('复刻失败，请重试');
    }
  };

  const [showMergeRequestModal, setShowMergeRequestModal] = useState(false);
  const [mergeRequestData, setMergeRequestData] = useState({ title: '', description: '' });
  const [selectedForkedAsset, setSelectedForkedAsset] = useState(null);

  const handleCreateMergeRequest = (asset) => {
    setSelectedForkedAsset(asset);
    setMergeRequestData({ title: '', description: '' });
    setShowMergeRequestModal(true);
  };

  const handleSubmitMergeRequest = (e) => {
    e.preventDefault();
    if (!mergeRequestData.title || !mergeRequestData.description) {
      alert('请填写完整的合并请求信息');
      return;
    }

    addMergeRequest({
      sourceAssetId: selectedForkedAsset.id,
      targetAssetId: selectedForkedAsset.forkedFrom,
      author: currentUser.id,
      title: mergeRequestData.title,
      description: mergeRequestData.description
    });

    setShowMergeRequestModal(false);
    setSelectedForkedAsset(null);
    setMergeRequestData({ title: '', description: '' });
    alert('合并请求已提交，等待原作者审核');
  };

  const handleDownload = (asset) => {
    const downloadData = {
      id: asset.id,
      title: asset.title,
      type: asset.type,
      course: asset.course,
      teacher: asset.teacher,
      grade: asset.grade,
      semester: asset.semester,
      description: asset.description,
      tags: asset.tags,
      score: asset.score,
      downloads: asset.downloads,
      citations: asset.citations,
      likes: asset.likes,
      createdAt: asset.createdAt,
      uploader: asset.uploader
    };
    
    const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.title}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    updateAsset(asset.id, { downloads: asset.downloads + 1 });
    setAssets(getAllAssets());
  };

  const handleViewDetail = (asset) => {
    setCurrentDetailAsset(asset);
    setShowDetailModal(true);
  };

  const getUploaderInfo = (uploaderId) => {
    const users = getUsers();
    return users.find(u => u.id === uploaderId);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>学习产出管理</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>管理您的学术资产，上传笔记、报告、设计等学习产出</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedAsset(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>上传资料</span>
        </button>
        <button
          onClick={() => setShowMarkdownEditor(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>新建文档</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 relative w-full sm:w-auto sm:flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="搜索标题或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className={`appearance-none px-4 py-2.5 pr-8 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部类型</option>
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <div className="relative">
              <select
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className={`appearance-none px-4 py-2.5 pr-8 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部课程</option>
                {allCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
              <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            </div>
            <button
              onClick={() => {
                setFilters({ type: '', course: '', teacher: '', grade: '', school: '' });
                setSchoolSearchInput('');
              }}
              className={`px-4 py-2.5 rounded-lg border ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              重置筛选
            </button>
          </div>
          
          {/* School Filter */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Filter className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>学校：</span>
            </div>
            <div className="relative mt-2">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="搜索学校名称..."
                value={schoolSearchInput}
                onChange={(e) => {
                  const searchValue = e.target.value;
                  setSchoolSearchInput(searchValue);
                  
                  if (!searchValue) {
                    setFilters({ ...filters, school: '' });
                    return;
                  }
                  
                  const matchedSchool = schools.find(
                    s => s.name.toLowerCase().includes(searchValue.toLowerCase()) || 
                         s.shortName.toLowerCase().includes(searchValue.toLowerCase())
                  );
                  if (matchedSchool) {
                    setFilters({ ...filters, school: matchedSchool.id });
                  } else {
                    setFilters({ ...filters, school: '' });
                  }
                }}
                className={`w-full pl-10 pr-32 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              />
              {filters.school && getSchoolById(filters.school) && (
                <div className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${getSchoolById(filters.school).color} text-white`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                  <span>{getSchoolById(filters.school).shortName}</span>
                  <button
                    onClick={() => {
                      setFilters({ ...filters, school: '' });
                      setSchoolSearchInput('');
                    }}
                    className="ml-1 hover:text-white/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Suggestions Dropdown */}
              {showSchoolFilter && (
                <div className={`absolute z-10 w-full mt-1 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg max-h-48 overflow-y-auto`}>
                  {schools.filter(s => !schoolSearchInput || 
                    s.name.toLowerCase().includes(schoolSearchInput.toLowerCase()) ||
                    s.shortName.toLowerCase().includes(schoolSearchInput.toLowerCase())
                  ).map(school => (
                    <button
                      key={school.id}
                      onClick={() => {
                        setFilters({ ...filters, school: school.id });
                        setSchoolSearchInput(school.name);
                        setShowSchoolFilter(false);
                      }}
                      className={`w-full px-4 py-2 flex items-center space-x-2 hover:bg-gray-100 ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${school.color}`}></span>
                      <span className={`flex-1 text-left ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        {school.name}
                      </span>
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {school.shortName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Select Buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => {
                  setFilters({ ...filters, school: '' });
                  setSchoolSearchInput('');
                }}
                className={`px-3 py-1 rounded-full text-xs ${filters.school === '' 
                  ? 'bg-gray-600 text-white' 
                  : theme === 'dark' 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                全部
              </button>
              {schools.slice(0, 5).map(school => (
                <button
                  key={school.id}
                  onClick={() => {
                    setFilters({ ...filters, school: school.id });
                    setSchoolSearchInput(school.name);
                  }}
                  className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${filters.school === school.id 
                    ? `${school.color} text-white` 
                    : theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                  <span>{school.shortName}</span>
                </button>
              ))}
              <button
                onClick={() => setShowSchoolFilter(!showSchoolFilter)}
                className={`px-3 py-1 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {showSchoolFilter ? '收起' : '更多'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => (
          <div 
            key={asset.id} 
            onClick={() => handleViewDetail(asset)}
            className={`bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'hover:bg-gray-50'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                  {getTypeIcon(asset.type)}
                  <span>{asset.type}</span>
                </div>
                {asset.school && getSchoolById(asset.school) && (
                  <div className={`flex items-center space-x-1 px-2 py-1 ${getSchoolById(asset.school).color} text-white rounded-full text-xs font-medium`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/80"></span>
                    <span>{getSchoolById(asset.school).shortName}</span>
                  </div>
                )}
              </div>
              {asset.isCase && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full text-xs font-medium shadow-sm">
                  <Crown className="w-3 h-3" />
                  <span>官方推荐</span>
                </div>
              )}
            </div>
            
            <h3 className={`font-semibold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {asset.title}
            </h3>
            
            <p className={`text-sm text-gray-500 mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
              {asset.description}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {asset.tags.map(tag => (
                <span key={tag} className={`px-2 py-0.5 rounded text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                  {tag}
                </span>
              ))}
            </div>
            
            <div className={`flex items-center justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <div className="flex items-center space-x-3">
                <span>{asset.course}</span>
                <span>{asset.teacher}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{asset.score}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{asset.citations || 0}</span>
                </div>
              </div>
            </div>
            
            <div className={`flex items-center justify-between text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              <span>{asset.grade}级 · {asset.semester}</span>
              <div className="flex items-center space-x-3">
                <span>📥 {asset.downloads}</span>
                <span>🔗 {asset.citations}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4 pt-3 border-t">
              <button onClick={(e) => { e.stopPropagation(); handleDownload(asset); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`} title="下载">
                <Download className="w-4 h-4" />
              </button>
              {!asset.isForked && asset.uploader !== currentUser?.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleFork(asset); }}
                  className="flex items-center space-x-1 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
                  title="Fork复刻"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Fork</span>
                </button>
              )}
              {asset.isForked && asset.uploader === currentUser?.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleCreateMergeRequest(asset); }}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  title="提交合并请求"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>合并请求</span>
                </button>
              )}
              {canCreateRelay(asset) && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCreateRelay(asset); }}
                  className="flex items-center space-x-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  title="一键转为接力项目"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>转为接力</span>
                </button>
              )}
              {canEditOrDelete(asset) && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(asset); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`} title="编辑">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingAsset(asset); setShowMarkdownEditor(true); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-green-400 hover:bg-green-900/20' : 'text-green-500 hover:bg-green-50'}`} title="在线编辑">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(asset.id); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`} title="删除">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>暂无符合条件的学习产出</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            上传第一个资料
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? '编辑学习产出' : '上传学习产出'}
              </h3>
              <button onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedAsset(null);
              }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>标题 *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="输入资料标题"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>类型 *</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    {assetTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>课程 *</label>
                  <select
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">选择课程</option>
                    {allCourses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>老师</label>
                  <select
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">选择老师</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>年级</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">选择年级</option>
                    {['2020', '2021', '2022', '2023', '2024', '2025'].map(grade => (
                      <option key={grade} value={grade}>{grade}级</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>学期</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">选择学期</option>
                  {semesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>描述 *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={3}
                  placeholder="描述这份资料的主要内容..."
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>标签</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        formData.tags.includes(tag)
                          ? 'bg-primary-500 text-white'
                          : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>评分</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: parseInt(e.target.value) || 0 })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="0-100"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>参考文献</label>
                <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="搜索平台内的资料或输入引用..."
                      className={`flex-1 px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-gray-100'} focus:outline-none`}
                      id="reference-input"
                    />
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-600 text-gray-300 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                      添加
                    </button>
                  </div>
                  {formData.references?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.references.map((ref, index) => (
                        <span key={index} className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                          <span>{ref}</span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, references: formData.references.filter((_, i) => i !== index) })}
                            className="hover:text-red-400"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      点击上方按钮添加参考文献，支持搜索平台内资料或手动输入
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>版本说明 *</label>
                <textarea
                  required
                  value={formData.versionNote}
                  onChange={(e) => setFormData({ ...formData, versionNote: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={2}
                  placeholder="请描述本次修改的内容..."
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setSelectedAsset(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {isEditing ? '保存修改' : '上传资料'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Markdown Editor Modal */}
      {showMarkdownEditor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-5xl">
            <MarkdownEditor 
              asset={editingAsset}
              onClose={() => {
                setShowMarkdownEditor(false);
                setEditingAsset(null);
                setAssets(getAssets());
              }}
            />
          </div>
        </div>
      )}

      {/* Merge Request Modal */}
      {showMergeRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                提交合并请求
              </h3>
              <button onClick={() => {
                setShowMergeRequestModal(false);
                setSelectedForkedAsset(null);
              }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitMergeRequest} className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>标题 *</label>
                <input
                  type="text"
                  required
                  value={mergeRequestData.title}
                  onChange={(e) => setMergeRequestData({ ...mergeRequestData, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="简要描述您的修改"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>修改说明 *</label>
                <textarea
                  required
                  value={mergeRequestData.description}
                  onChange={(e) => setMergeRequestData({ ...mergeRequestData, description: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={4}
                  placeholder="详细描述您做了哪些修改..."
                />
              </div>
              
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  目标资料：{selectedForkedAsset?.title || '未知'}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMergeRequestModal(false);
                    setSelectedForkedAsset(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  提交合并请求
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && currentDetailAsset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                资料详情
              </h3>
              <button onClick={() => setShowDetailModal(false)} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
              <button
                onClick={() => setDetailTab('info')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${detailTab === 'info' 
                  ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
                  : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Eye className="w-4 h-4" />
                <span>资料信息</span>
              </button>
              <button
                onClick={() => setDetailTab('versions')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${detailTab === 'versions' 
                  ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
                  : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Clock className="w-4 h-4" />
                <span>版本历史</span>
                {currentDetailAsset.versions?.length > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {currentDetailAsset.versions.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setDetailTab('compare')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${detailTab === 'compare' 
                  ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
                  : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <GitCompare className="w-4 h-4" />
                <span>版本对比</span>
              </button>
              <button
                onClick={() => setDetailTab('discussion')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${detailTab === 'discussion' 
                  ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
                  : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>讨论区</span>
              </button>
              <button
                onClick={() => setDetailTab('knowledge')}
                className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${detailTab === 'knowledge' 
                  ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
                  : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Network className="w-4 h-4" />
                <span>知识谱系</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {detailTab === 'info' && (
                <>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(currentDetailAsset.type)}`}>
                          {getTypeIcon(currentDetailAsset.type)}
                          <span>{currentDetailAsset.type}</span>
                        </span>
                        {currentDetailAsset.isCase && (
                          <span className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full text-xs font-medium">
                            <Crown className="w-3 h-3" />
                            <span>官方推荐</span>
                          </span>
                        )}
                      </div>
                      <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.title}
                      </h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleDownload(currentDetailAsset)} className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                        <Download className="w-4 h-4" />
                        <span className="text-sm">下载</span>
                      </button>
                      {canCreateRelay(currentDetailAsset) && (
                        <button onClick={() => {
                          handleCreateRelay(currentDetailAsset);
                          setShowDetailModal(false);
                        }} className="flex items-center space-x-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                          <GitBranch className="w-4 h-4" />
                          <span>转为接力</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Summary */}
                  <AISummary asset={currentDetailAsset} />

                  {/* Metadata */}
                  <div className={`grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>课程</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.course}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>教师</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.teacher}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>年级</p>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.grade}级 · {currentDetailAsset.semester}
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>评分</p>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {currentDetailAsset.score}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Uploader Info */}
                  <div className={`flex items-center space-x-3 mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      {getUploaderInfo(currentDetailAsset.uploader)?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {getUploaderInfo(currentDetailAsset.uploader)?.name || '未知用户'}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {getUploaderInfo(currentDetailAsset.uploader)?.major || ''} · {currentDetailAsset.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      内容摘要
                    </h4>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentDetailAsset.description || '暂无描述'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      标签
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {currentDetailAsset.tags?.map(tag => (
                        <span key={tag} className={`px-3 py-1 rounded-full text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.downloads}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>下载次数</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.citations}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>被引用次数</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentDetailAsset.likes}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>点赞数</p>
                    </div>
                  </div>

                  {/* References */}
                  {currentDetailAsset.references?.length > 0 && (
                    <div className="mt-6">
                      <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        参考文献
                      </h4>
                      <ul className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentDetailAsset.references.map((ref, index) => (
                          <li key={index} className="text-sm">
                            {index + 1}. {ref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Citation Format Generator */}
                  <div className="mt-6">
                    <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      引用格式生成器
                    </h4>
                    <div className="flex space-x-2 mb-3">
                      {['gbt', 'apa', 'mla'].map(format => (
                        <button
                          key={format}
                          onClick={() => {
                            const formatLabel = format === 'gbt' ? 'GB/T 7714' : format === 'apa' ? 'APA' : 'MLA';
                            const citationText = generateCitation(currentDetailAsset, format);
                            navigator.clipboard.writeText(citationText);
                            alert(`${formatLabel}格式已复制到剪贴板！`);
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            theme === 'dark'
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {format === 'gbt' ? 'GB/T 7714' : format === 'apa' ? 'APA' : 'MLA'}
                        </button>
                      ))}
                    </div>
                    <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-2`}>GB/T 7714 格式示例：</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {generateCitation(currentDetailAsset, 'gbt')}
                      </p>
                    </div>
                  </div>

                  {/* Cited By */}
                  <div className="mt-6">
                    <h4 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      被引用列表
                    </h4>
                    {getCitations().filter(c => c.citedAsset === currentDetailAsset.id).length > 0 ? (
                      <div className="space-y-2">
                        {getCitations().filter(c => c.citedAsset === currentDetailAsset.id).map(citation => {
                          const citer = getUsers().find(u => u.id === citation.citer);
                          const citingAsset = getAssets().find(a => a.id === citation.citingAsset);
                          return (
                            <div key={citation.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                                  {citer?.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {citingAsset?.title || '未知资料'}
                                  </p>
                                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    引用者：{citer?.name || '未知用户'} · {citation.citedAt}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        暂无被引用记录
                      </p>
                    )}
                  </div>
                </>
              )}

              {detailTab === 'versions' && (
                <VersionHistory 
                  asset={currentDetailAsset}
                  users={getUsers()}
                  currentUser={currentUser}
                  onDownload={(version) => {
                    const data = {
                      version: version.versionNumber,
                      content: version.content,
                      submittedAt: version.submittedAt
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${currentDetailAsset.title}_${version.versionNumber}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  onRollback={(version) => {
                    if (window.confirm(`确定要回滚到版本 ${version.versionNumber} 吗？`)) {
                      const assets = getAssets();
                      const updatedAsset = assets.find(a => a.id === currentDetailAsset.id);
                      if (updatedAsset) {
                        updatedAsset.description = version.content;
                        const newVersionNumber = `v${parseFloat(version.versionNumber.slice(1)) + 0.1}`;
                        updatedAsset.versions.push({
                          id: `v${Date.now()}`,
                          versionNumber: newVersionNumber,
                          author: currentUser.id,
                          submittedAt: new Date().toLocaleString(),
                          description: `回滚到 ${version.versionNumber}`,
                          content: version.content
                        });
                        localStorage.setItem('assets', JSON.stringify(assets));
                        setAssets(getAllAssets());
                        setCurrentDetailAsset(updatedAsset);
                      }
                    }
                  }}
                  onDelete={(version) => {
                    if (window.confirm(`确定要删除版本 ${version.versionNumber} 吗？`)) {
                      const assets = getAssets();
                      const updatedAsset = assets.find(a => a.id === currentDetailAsset.id);
                      if (updatedAsset) {
                        updatedAsset.versions = updatedAsset.versions.filter(v => v.id !== version.id);
                        localStorage.setItem('assets', JSON.stringify(assets));
                        setAssets(getAllAssets());
                        setCurrentDetailAsset(updatedAsset);
                      }
                    }
                  }}
                />
              )}

              {detailTab === 'compare' && (
                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    版本对比
                  </h4>
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    在版本历史中选择两个版本进行对比
                  </p>
                  <button
                    onClick={() => setDetailTab('versions')}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    前往版本历史
                  </button>
                </div>
              )}

              {detailTab === 'discussion' && (
                <Discussion assetId={currentDetailAsset.id} />
              )}

              {detailTab === 'knowledge' && (
                <KnowledgeGraph assetId={currentDetailAsset.id} />
              )}
            </div>

            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
              <button
                onClick={() => setShowDetailModal(false)}
                className={`w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
