import { useState } from 'react';
import {
  Search,
  Download,
  Link2,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
  Filter
} from 'lucide-react';
import { getAssets, getUsers, addCitation } from '../utils/storage';
import { courseLibrary, teachers, departments } from '../data/mockData';
import { useApp } from '../context/AppContext';

const assetTypes = ['笔记', '实验报告', '课程设计', '毕设', '竞赛作品'];
const semesters = ['2023春', '2023秋', '2024春', '2024秋', '2025春'];

export const SearchPage = () => {
  const { currentUser, theme } = useApp();
  const [assets] = useState(getAssets());
  const [users] = useState(getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  
  const [filters, setFilters] = useState({
    type: '',
    course: '',
    teacher: '',
    grade: '',
    semester: '',
    department: ''
  });

  const allCourses = [...courseLibrary.public, ...courseLibrary.professional, ...courseLibrary.general];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = !searchTerm || 
      asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.type || asset.type === filters.type;
    const matchesCourse = !filters.course || asset.course === filters.course;
    const matchesTeacher = !filters.teacher || asset.teacher === filters.teacher;
    const matchesGrade = !filters.grade || asset.grade === filters.grade;
    const matchesSemester = !filters.semester || asset.semester === filters.semester;
    
    return matchesSearch && matchesType && matchesCourse && matchesTeacher && matchesGrade && matchesSemester;
  });

  const generateCitation = (asset) => {
    const uploader = users.find(u => u.id === asset.uploader);
    return `[${asset.id.toUpperCase()}] ${uploader?.name || '未知作者'}. ${asset.title}[${asset.type}]. ${asset.course}, ${asset.teacher}, ${asset.grade}级, ${asset.createdAt}.`;
  };

  const handleCite = (asset) => {
    addCitation({
      citer: currentUser.id,
      citedAsset: asset.id,
      format: generateCitation(asset)
    });
    alert(`引用成功！原作者获得5积分奖励。\n\n引用格式:\n${generateCitation(asset)}`);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>资料检索</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>按课程、老师、年级、学期四维精准搜索学习资料</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="搜索标题、描述、课程名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg`}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
              showFilters
                ? 'bg-primary-500 text-white border-primary-500'
                : theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>筛选</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>类型</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部类型</option>
                {assetTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>课程</label>
              <select
                value={filters.course}
                onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部课程</option>
                {allCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>老师</label>
              <select
                value={filters.teacher}
                onChange={(e) => setFilters({ ...filters, teacher: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部老师</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.name}>{teacher.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>年级</label>
              <select
                value={filters.grade}
                onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部年级</option>
                {['2020', '2021', '2022', '2023', '2024', '2025'].map(grade => (
                  <option key={grade} value={grade}>{grade}级</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>学期</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <option value="">全部学期</option>
                {semesters.map(semester => (
                  <option key={semester} value={semester}>{semester}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ type: '', course: '', teacher: '', grade: '', semester: '' })}
                className={`w-full px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                重置
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className={`flex items-center justify-between mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <span>找到 {filteredAssets.length} 条结果</span>
        <span>共 {assets.length} 条资料</span>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {filteredAssets.map(asset => {
          const uploader = users.find(u => u.id === asset.uploader);
          return (
            <div key={asset.id} className={`bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <BookOpen className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(asset.type)}`}>
                      {asset.type}
                    </span>
                    {asset.isCase && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">教学案例</span>
                    )}
                  </div>
                  
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {asset.title}
                  </h3>
                  
                  <p className={`text-sm mb-2 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {asset.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      📚 {asset.course}
                    </span>
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      👨‍🏫 {asset.teacher}
                    </span>
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      🎓 {asset.grade}级
                    </span>
                    <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      📅 {asset.semester}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        📥 下载 {asset.downloads}
                      </span>
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        🔗 引用 {asset.citations}
                      </span>
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        ⭐ {asset.score}分
                      </span>
                      <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        上传者: {uploader?.name}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <button className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`} title="下载">
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCopy(generateCitation(asset), asset.id)}
                        className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        title="复制引用格式"
                      >
                        {copiedId === asset.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleCite(asset)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                      >
                        <Link2 className="w-4 h-4" />
                        <span>引用</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAssets.length === 0 && (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>没有找到符合条件的资料</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ type: '', course: '', teacher: '', grade: '', semester: '' });
            }}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            清除筛选条件
          </button>
        </div>
      )}
    </div>
  );
};
