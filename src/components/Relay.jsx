import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  Check,
  X,
  Users,
  Target,
  Clock,
  Award,
  MessageSquare,
  ArrowRight,
  GitBranch,
  Sparkles
} from 'lucide-react';
import { getRelayProjects, getApplications, getGeneChain, getAssets, getUsers, addRelayProject, addApplication, approveApplication, addGeneChainRecord } from '../utils/storage';
import { useApp } from '../context/AppContext';

const difficulties = ['初级', '中级', '高级', '挑战'];
const statusMap = {
  recruiting: { label: '🔵待接力', color: 'bg-blue-100 text-blue-700' },
  in_progress: { label: '🟡接力中', color: 'bg-yellow-100 text-yellow-700' },
  completed: { label: '🟢已传承', color: 'bg-green-100 text-green-700' },
  closed: { label: '🔴已关闭', color: 'bg-red-100 text-red-700' }
};

const appStatusMap = {
  pending: { label: '待审核', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: '已通过', color: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' }
};

export const Relay = () => {
  const { currentUser, theme } = useApp();
  const [projects, setProjects] = useState(getRelayProjects());
  const [applications, setApplications] = useState(getApplications());
  const [geneChain, setGeneChain] = useState(getGeneChain());
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showGeneChainModal, setShowGeneChainModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    originalAsset: '',
    achievements: '',
    todo: '',
    difficulty: '中级',
    authorMessage: ''
  });

  const [applyData, setApplyData] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: ''
  });

  const assets = getAssets();
  const users = getUsers();

  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchTerm || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !filterDifficulty || p.difficulty === filterDifficulty;
    const matchesStatus = !filterStatus || p.status === filterStatus;
    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const myApplications = applications.filter(a => a.applicant === currentUser.id);
  const myProjects = projects.filter(p => p.teacher === currentUser.id || p.originalAuthor === currentUser.id);

  const handleCreateProject = (e) => {
    e.preventDefault();
    addRelayProject({
      ...formData,
      originalAuthor: currentUser.id,
      teacher: currentUser.id
    });
    setProjects(getRelayProjects());
    setShowProjectModal(false);
    setFormData({ title: '', originalAsset: '', achievements: '', todo: '', difficulty: '中级', authorMessage: '' });
    localStorage.removeItem('relayDraft');
  };

  const handleApply = (e) => {
    e.preventDefault();
    addApplication({
      ...applyData,
      projectId: selectedProject.id,
      applicant: currentUser.id
    });
    setApplications(getApplications());
    setShowApplyModal(false);
    setApplyData({ q1: '', q2: '', q3: '', q4: '' });
    setSelectedProject(null);
  };

  const handleApprove = (appId) => {
    approveApplication(appId);
    setApplications(getApplications());
  };

  const handleCompleteProject = (project) => {
    const projectApps = applications.filter(a => a.projectId === project.id && a.status === 'approved');
    if (projectApps.length > 0) {
      addGeneChainRecord({
        projectId: project.id,
        contributor: projectApps[0].applicant,
        mentor: project.originalAuthor,
        contribution: '完成接力项目'
      });
      setGeneChain(getGeneChain());
      
      const updatedProjects = projects.map(p => 
        p.id === project.id ? { ...p, status: 'completed' } : p
      );
      localStorage.setItem('academic_relay_projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case '初级': return 'bg-green-100 text-green-700';
      case '中级': return 'bg-blue-100 text-blue-700';
      case '高级': return 'bg-orange-100 text-orange-700';
      case '挑战': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getUserById = (userId) => users.find(u => u.id === userId);
  const getAssetById = (assetId) => assets.find(a => a.id === assetId);
  
  const getGeneration = (projectId) => {
    const chain = geneChain.filter(g => g.projectId === projectId);
    return chain.length + 1;
  };

  const calculateMatchScore = (project) => {
    let score = 50;
    const author = getUserById(project.originalAuthor);
    
    if (author?.major === currentUser.major) score += 20;
    if (Math.abs(parseInt(project.grade) - parseInt(currentUser.grade)) <= 1) score += 15;
    
    const userAssets = assets.filter(a => a.uploader === currentUser.id);
    const relatedAssets = userAssets.filter(a => a.course === getAssetById(project.originalAsset)?.course);
    if (relatedAssets.length > 0) score += 15;
    
    return Math.min(score, 100);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  useEffect(() => {
    const draftData = localStorage.getItem('relayDraft');
    if (draftData) {
      const parsed = JSON.parse(draftData);
      setFormData({
        title: parsed.title,
        originalAsset: parsed.existingAchievements?.[0] || '',
        achievements: parsed.description || '',
        todo: '',
        difficulty: '中级',
        authorMessage: ''
      });
      setShowProjectModal(true);
    }
  }, []);

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    setFormData({ title: '', originalAsset: '', achievements: '', todo: '', difficulty: '中级', authorMessage: '' });
    localStorage.removeItem('relayDraft');
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>跨期项目接力 · 让知识有传承</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>继承往届优秀作品，接力完成创新项目，留下你的学术基因</p>
        </div>
        {currentUser.role !== 'student' && (
          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>创建接力项目</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className={`flex space-x-1 p-1 mb-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'projects'
              ? 'bg-white text-primary-600 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          接力市场
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'applications'
              ? 'bg-white text-primary-600 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          我的申请
        </button>
        <button
          onClick={() => setActiveTab('gene')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'gene'
              ? 'bg-white text-primary-600 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          学术基因链
        </button>
      </div>

      {/* Search & Filters */}
      {activeTab === 'projects' && (
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="搜索接力项目..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              <option value="">难度</option>
              {difficulties.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              <option value="">状态</option>
              <option value="recruiting">🔵待接力</option>
              <option value="in_progress">🟡接力中</option>
              <option value="completed">🟢已传承</option>
            </select>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map(project => {
            const author = getUserById(project.originalAuthor);
            const originalAsset = getAssetById(project.originalAsset);
            const generation = getGeneration(project.id);
            const matchScore = calculateMatchScore(project);
            const projectApps = applications.filter(a => a.projectId === project.id && a.status === 'approved');
            const completionPercent = project.status === 'completed' ? 100 : projectApps.length > 0 ? 50 : 0;
            
            return (
              <div key={project.id} className={`bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                {/* Top bar with generation badge and status */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-primary-500 to-purple-500 text-white`}>
                    <span>第{generation}代</span>
                    <span className="text-yellow-200">·</span>
                    <span>可接力</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[project.status].color}`}>
                      {statusMap[project.status].label}
                    </span>
                    <div className={`flex items-center space-x-1 text-xs ${getMatchColor(matchScore)}`}>
                      <Sparkles className="w-3 h-3" />
                      <span>{matchScore}%</span>
                    </div>
                  </div>
                </div>
                
                <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {project.title}
                </h3>
                
                <div className={`flex items-center space-x-2 text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>原作者: {author?.name}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${getDifficultyColor(project.difficulty)}`}>
                    {project.difficulty}
                  </span>
                </div>
                
                {/* Author Message */}
                {project.authorMessage && (
                  <div className={`mb-3 p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      💬 原作者说：{project.authorMessage}
                    </p>
                  </div>
                )}
                
                <div className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p className="text-sm font-medium mb-1">已有成果:</p>
                  <p className="text-xs line-clamp-2">{project.achievements}</p>
                </div>
                
                <div className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  <p className="text-sm font-medium mb-1">待完成:</p>
                  <p className="text-xs line-clamp-2">{project.todo}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>项目进度</span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>{completionPercent}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-green-500 transition-all duration-500"
                      style={{ width: `${completionPercent}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>已完成</span>
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>待接力 {100 - completionPercent}%</span>
                  </div>
                </div>
                
                <div className={`flex items-center justify-between text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span>创建于 {project.createdAt}</span>
                </div>
                
                <div className="flex items-center space-x-2 mt-4 pt-3 border-t">
                  {project.status === 'recruiting' && currentUser.role === 'student' && (
                    <button
                      onClick={() => {
                        setSelectedProject(project);
                        setShowApplyModal(true);
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>申请接力</span>
                    </button>
                  )}
                  {project.status === 'in_progress' && (currentUser.role === 'teacher' || currentUser.id === project.originalAuthor) && (
                    <button
                      onClick={() => handleCompleteProject(project)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>完成项目</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setShowGeneChainModal(true);
                    }}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                  >
                    <GitBranch className="w-4 h-4" />
                    <span className="text-sm">🧬 查看学术族谱</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="overflow-x-auto">
          <table className={`w-full ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left py-3 px-4 font-semibold">项目名称</th>
                <th className="text-left py-3 px-4 font-semibold">申请时间</th>
                <th className="text-left py-3 px-4 font-semibold">状态</th>
                <th className="text-left py-3 px-4 font-semibold">操作</th>
              </tr>
            </thead>
            <tbody>
              {myApplications.map(app => {
                const project = projects.find(p => p.id === app.projectId);
                return (
                  <tr key={app.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{project?.title}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">{app.submittedAt}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${appStatusMap[app.status].color}`}>
                        {appStatusMap[app.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setShowGeneChainModal(true);
                        }}
                        className={`text-sm ${theme === 'dark' ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}
                      >
                        🧬 查看学术族谱
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {myApplications.length === 0 && (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无申请记录</p>
            </div>
          )}
        </div>
      )}

      {/* Gene Chain Tab */}
      {activeTab === 'gene' && (
        <div className="space-y-6">
          {projects.map(project => {
            const projectChain = geneChain.filter(g => g.projectId === project.id);
            if (projectChain.length === 0) return null;
            
            return (
              <div key={project.id} className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <GitBranch className={`w-6 h-6 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-500'}`} />
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    共 {projectChain.length} 届传承
                  </span>
                </div>
                
                <div className="relative">
                  <div className={`absolute left-6 top-0 bottom-0 w-0.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  
                  {projectChain.sort((a, b) => a.generation - b.generation).map((record, index) => {
                    const contributor = getUserById(record.contributor);
                    const mentor = record.mentor ? getUserById(record.mentor) : null;
                    return (
                      <div key={record.id} className="flex items-start space-x-4 pb-6 last:pb-0">
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {record.generation}
                          </span>
                        </div>
                        <div className={`flex-1 bg-gray-50 rounded-lg p-4 ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              第 {record.generation} 届贡献者: {contributor?.name}
                            </span>
                            <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              {record.createdAt}
                            </span>
                          </div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {record.contribution}
                          </p>
                          {mentor && (
                            <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              指导者: {mentor.name}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          {geneChain.length === 0 && (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无学术基因链记录</p>
            </div>
          )}
        </div>
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>创建接力项目</h3>
              <button onClick={handleCloseProjectModal} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>项目名称 *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="输入项目名称"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>关联原始资产</label>
                <select
                  value={formData.originalAsset}
                  onChange={(e) => setFormData({ ...formData, originalAsset: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">选择关联资产</option>
                  {assets.filter(a => a.uploader === currentUser.id).map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>难度等级</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>已有成果 *</label>
                <textarea
                  required
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={3}
                  placeholder="描述已完成的工作..."
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>待完成任务 *</label>
                <textarea
                  required
                  value={formData.todo}
                  onChange={(e) => setFormData({ ...formData, todo: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={3}
                  placeholder="描述需要继续完成的任务..."
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>原作者寄语</label>
                <textarea
                  value={formData.authorMessage}
                  onChange={(e) => setFormData({ ...formData, authorMessage: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={2}
                  placeholder="给接力者说几句话..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseProjectModal}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  创建项目
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal - Structured Template */}
      {showApplyModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>申请接力项目</h3>
              <button onClick={() => { setShowApplyModal(false); setSelectedProject(null); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className={`bg-gray-50 rounded-lg p-4 mb-4 ${theme === 'dark' ? 'bg-gray-700' : ''}`}>
                <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedProject.title}</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedProject.achievements}
                </p>
              </div>
              
              <form onSubmit={handleApply} className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    1️⃣ 您为什么想要接力这个项目？
                  </label>
                  <textarea
                    required
                    value={applyData.q1}
                    onChange={(e) => setApplyData({ ...applyData, q1: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    rows={3}
                    placeholder="请详细说明您对接力此项目的兴趣和动机..."
                  />
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                    2️⃣ 您具备哪些相关背景和能力？
                  </label>
                  <textarea
                    required
                    value={applyData.q2}
                    onChange={(e) => setApplyData({ ...applyData, q2: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    rows={3}
                    placeholder="请介绍您的专业背景、相关经验和技能..."
                  />
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    3️⃣ 您的具体接力计划是什么？
                  </label>
                  <textarea
                    required
                    value={applyData.q3}
                    onChange={(e) => setApplyData({ ...applyData, q3: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    rows={3}
                    placeholder="请描述您的实施方案、时间规划和预期成果..."
                  />
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                    4️⃣ 您希望从原作者那里获得什么指导？
                  </label>
                  <textarea
                    required
                    value={applyData.q4}
                    onChange={(e) => setApplyData({ ...applyData, q4: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    rows={3}
                    placeholder="请说明您需要的指导类型和支持..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => { setShowApplyModal(false); setSelectedProject(null); }}
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    提交申请
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Gene Chain Modal - Horizontal Timeline */}
      {showGeneChainModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>🧬 学术族谱</h3>
              <button onClick={() => { setShowGeneChainModal(false); setSelectedProject(null); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h4 className={`font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{selectedProject.title}</h4>
              
              {/* Horizontal Timeline */}
              <div className="relative">
                <div className={`absolute top-6 left-0 right-0 h-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                
                <div className="flex flex-wrap justify-between relative z-10">
                  {(() => {
                    const chain = geneChain.filter(g => g.projectId === selectedProject.id).sort((a, b) => a.generation - b.generation);
                    const total = chain.length + 1;
                    const originalAuthor = getUserById(selectedProject.originalAuthor);
                    
                    return [
                      { type: 'original', generation: 1, user: originalAuthor, createdAt: selectedProject.createdAt, contribution: '创建项目' },
                      ...chain.map(c => ({ 
                        type: 'relay', 
                        generation: c.generation, 
                        user: getUserById(c.contributor), 
                        createdAt: c.createdAt, 
                        contribution: c.contribution,
                        mentor: c.mentor ? getUserById(c.mentor) : null
                      }))
                    ].map((record, index) => (
                      <div key={index} className="flex flex-col items-center flex-1 min-w-[120px]">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                          record.type === 'original' 
                            ? 'bg-gradient-to-br from-primary-500 to-purple-500 text-white' 
                            : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {record.generation}
                        </div>
                        <div className={`mt-3 text-center px-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 w-full`}>
                          <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {record.user?.name}
                          </p>
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {record.createdAt}
                          </p>
                          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {record.contribution}
                          </p>
                          {record.mentor && (
                            <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                              导师: {record.mentor.name}
                            </p>
                          )}
                        </div>
                        {index < total - 1 && (
                          <div className={`absolute top-6 w-6 h-6 rounded-full ${theme === 'dark' ? 'bg-green-600' : 'bg-green-500'} -right-3 flex items-center justify-center`}>
                            <ArrowRight className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              {geneChain.filter(g => g.projectId === selectedProject.id).length === 0 && (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>该项目尚无传承记录</p>
                  <p className="text-sm mt-2">成为第一位接力者，开启学术传承之旅！</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
