import { useState, useEffect } from 'react';
import { 
  User, 
  BookOpen, 
  GraduationCap, 
  GitBranch, 
  Award, 
  Share2, 
  Edit3, 
  ChevronRight,
  Star,
  Download,
  Calendar,
  Coins,
  BadgeCheck,
  ExternalLink,
  Copy,
  Check,
  Code,
  FileText,
  ThumbsUp,
  GitPullRequest,
  X,
  Save
} from 'lucide-react';
import { 
  getUsers, 
  setUsers,
  getAssets, 
  getRelayProjects, 
  getMergeRequests,
  getCitations,
  getExchanges,
  getComments
} from '../utils/storage';
import { useApp } from '../context/AppContext';

export default function Profile({ userId }) {
  const { theme } = useApp();
  const [activeTab, setActiveTab] = useState('assets');
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState(null);
  const [assets, setAssets] = useState([]);
  const [relayProjects, setRelayProjects] = useState([]);
  const [mergeRequests, setMergeRequests] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    department: '',
    major: '',
    year: ''
  });

  useEffect(() => {
    const users = getUsers();
    const targetUser = userId ? users.find(u => u.id === userId) : users[0];
    setUser(targetUser);

    if (targetUser) {
      setAssets(getAssets().filter(a => a.uploader === targetUser.id));
      setRelayProjects(getRelayProjects().filter(p => 
        p.originalAuthor === targetUser.id || 
        (p.participants && p.participants.includes(targetUser.id))
      ));
      setMergeRequests(getMergeRequests().filter(mr => mr.author === targetUser.id));
    }
  }, [userId]);

  if (!user) {
    return (
      <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>用户不存在</p>
      </div>
    );
  }

  const totalCitationsReceived = getCitations().filter(c => {
    const asset = getAssets().find(a => a.id === c.citedAsset);
    return asset && asset.uploader === user.id;
  }).length;

  const userAssets = getAssets().filter(a => a.uploader === user.id);
  const userMRs = getMergeRequests().filter(mr => mr.author === user.id);
  
  const totalLines = userAssets.reduce((sum, asset) => {
    const content = asset.content || '';
    const lines = content.split('\n').length;
    return sum + Math.floor(lines * (asset.type === '课程设计' || asset.type === '毕设' ? 50 : asset.type === '实验报告' ? 30 : 10));
  }, 0);

  const totalWords = userAssets.reduce((sum, asset) => {
    const content = asset.content || '';
    const description = asset.description || '';
    return sum + content.length + description.length * 10;
  }, 0);

  const approvedMRs = userMRs.filter(mr => mr.status === 'accepted').length;
  const totalLikes = userAssets.reduce((sum, asset) => sum + (asset.score || 0), 0);

  const contributionsData = {};
  const userComments = getComments().filter(c => c.author === user.id);
  
  userAssets.forEach(asset => {
    const date = asset.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
    if (!contributionsData[date]) contributionsData[date] = { upload: 0, fork: 0, mr: 0, comment: 0, total: 0 };
    contributionsData[date].upload++;
    contributionsData[date].total++;
  });

  userMRs.forEach(mr => {
    const date = mr.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
    if (!contributionsData[date]) contributionsData[date] = { upload: 0, fork: 0, mr: 0, comment: 0, total: 0 };
    contributionsData[date].mr++;
    contributionsData[date].total++;
  });

  userComments.forEach(comment => {
    const date = comment.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0];
    if (!contributionsData[date]) contributionsData[date] = { upload: 0, fork: 0, mr: 0, comment: 0, total: 0 };
    contributionsData[date].comment++;
    contributionsData[date].total++;
  });

  const skillsData = {};
  const techKeywords = {
    'Python': ['python', '机器学习', '数据分析', 'numpy', 'pandas', 'tensorflow', 'pytorch'],
    'Java': ['java', 'spring', 'springboot', 'jdk', 'maven'],
    'JavaScript': ['javascript', 'js', 'react', 'vue', 'node', 'nodejs'],
    'C++': ['c++', 'cpp', 'opencv', 'qt'],
    '数据结构': ['数据结构', 'algorithm', '算法', 'sort', 'tree', 'graph'],
    '数据库': ['database', 'mysql', 'sql', 'mongodb', 'redis'],
    '前端开发': ['frontend', 'html', 'css', 'react', 'vue', 'angular'],
    '后端开发': ['backend', 'server', 'api', 'restful'],
    '深度学习': ['深度学习', 'deep learning', 'cnn', 'rnn', 'transformer'],
    '计算机网络': ['network', 'tcp', 'udp', 'http', 'socket'],
    '操作系统': ['os', 'linux', 'unix', '进程', '线程'],
    '软件工程': ['software', 'git', 'github', '敏捷', '测试']
  };

  userAssets.forEach(asset => {
    const text = (asset.title + ' ' + asset.description + ' ' + asset.course + ' ' + asset.type).toLowerCase();
    
    Object.entries(techKeywords).forEach(([skill, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
        skillsData[skill] = (skillsData[skill] || 0) + 1;
      }
    });
  });

  if (Object.keys(skillsData).length === 0) {
    const defaultSkills = ['Python', 'JavaScript', '数据结构', '数据库'];
    defaultSkills.forEach(skill => {
      skillsData[skill] = Math.floor(Math.random() * 5) + 1;
    });
  }

  const topCitedAssets = getAssets()
    .filter(a => a.uploader === user.id)
    .sort((a, b) => (b.citations || 0) - (a.citations || 0))
    .slice(0, 3);

  const achievements = [
    { id: 'first_upload', name: '初露锋芒', description: '上传第一个学习产出', icon: '📤' },
    { id: 'relay_participant', name: '接力选手', description: '参与第一个跨期接力项目', icon: '🏃' },
    { id: 'merge_approved', name: '协作达人', description: '首次合并请求被接受', icon: '🤝' },
    { id: 'citation_received', name: '学术新星', description: '首次收到引用', icon: '⭐' },
    { id: 'top_contributor', name: '顶尖贡献者', description: '获得5次合并请求通过', icon: '🏆' },
  ];

  const handleShare = () => {
    const url = `${window.location.origin}/profile/${user.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      department: user.department || '',
      major: user.major || '',
      year: user.year || ''
    });
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = () => {
    const users = getUsers();
    const updatedUsers = users.map(u => 
      u.id === user.id ? { ...u, ...editForm } : u
    );
    setUsers(updatedUsers);
    setUser({ ...user, ...editForm });
    setShowEditModal(false);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return '学生';
      case 'teacher': return '教师';
      case 'admin': return '管理员';
      default: return '未知';
    }
  };

  const sortedSkills = Object.entries(skillsData)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...sortedSkills.map(s => s.count), 1);

  const getFontSize = (count) => {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 'text-xl';
    if (ratio >= 0.6) return 'text-lg';
    if (ratio >= 0.4) return 'text-base';
    if (ratio >= 0.2) return 'text-sm';
    return 'text-xs';
  };

  const getSkillColor = (index) => {
    const colors = theme === 'dark' 
      ? ['bg-blue-500/20 text-blue-400', 'bg-purple-500/20 text-purple-400', 'bg-green-500/20 text-green-400', 'bg-yellow-500/20 text-yellow-400', 'bg-pink-500/20 text-pink-400']
      : ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-pink-100 text-pink-700'];
    return colors[index % colors.length];
  };

  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let count = 0;
      if (contributionsData[dateStr]) {
        count = contributionsData[dateStr].total || 0;
      }
      
      data.push({
        date: dateStr,
        count,
        dayOfWeek: date.getDay(),
        weekOfYear: Math.ceil(i / 7)
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();
  const totalContributions = Object.values(contributionsData).reduce((sum, day) => sum + (day.total || 0), 0);
  const activeDays = Object.keys(contributionsData).length;

  const getHeatmapColor = (count) => {
    if (count === 0) return theme === 'dark' ? '#1f2937' : '#ebedf0';
    if (count <= 2) return theme === 'dark' ? '#0e4429' : '#9be9a8';
    if (count <= 4) return theme === 'dark' ? '#006d32' : '#40c463';
    if (count <= 6) return theme === 'dark' ? '#26a641' : '#30a14e';
    return theme === 'dark' ? '#39d353' : '#216e39';
  };

  const weeks = [];
  for (let i = 0; i < 52; i++) {
    weeks.push(heatmapData.filter(d => d.weekOfYear === i + 1));
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className={`rounded-xl p-6 mb-6 ${theme === 'dark' ? 'bg-gradient-to-br from-primary-900/50 to-gray-800' : 'bg-gradient-to-br from-primary-50 to-blue-50'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-white shadow-lg'}`}>
              <span className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {user.name?.charAt(0) || '?'}
              </span>
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                  {getRoleLabel(user.role)}
                </span>
                {user.major && (
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.major}
                  </span>
                )}
              </div>
              {user.bio && (
                <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.bio}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100'} shadow-sm`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '已复制' : '分享主页'}</span>
            </button>
            <button 
              onClick={handleOpenEdit}
              className={`flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors`}
            >
              <Edit3 className="w-4 h-4" />
              <span>编辑资料</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {user.points || 0}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总积分</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <BookOpen className="w-5 h-5 text-primary-500" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {assets.length}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>学习产出</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Code className="w-5 h-5 text-purple-500" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalLines.toLocaleString()}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>代码行数</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalWords.toLocaleString()}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>文档字数</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <GitPullRequest className="w-5 h-5 text-green-500" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {approvedMRs}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>采纳PR数</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <ThumbsUp className="w-5 h-5 text-pink-500" />
              <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {totalLikes}
              </span>
            </div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>获得点赞</p>
          </div>
        </div>
      </div>

      {/* Contribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Heatmap */}
        <div className="lg:col-span-2">
          <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                贡献热力图
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  过去一年
                </span>
                <div className="flex items-center space-x-1">
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>少</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: getHeatmapColor(level * 2) }}
                    />
                  ))}
                  <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>多</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-block">
                <div className="flex">
                  <div className="flex flex-col justify-between mr-2 text-xs" style={{ height: '180px' }}>
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>周一</span>
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>周三</span>
                    <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>周五</span>
                  </div>

                  <div className="flex space-x-0.5">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col space-y-0.5">
                        {week.map((day) => (
                          <div
                            key={day.date}
                            className="w-3 h-3 rounded-sm transition-colors hover:ring-2 hover:ring-primary-400 cursor-pointer"
                            style={{ backgroundColor: getHeatmapColor(day.count) }}
                            title={`${day.date}: ${day.count} 次贡献`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                  {totalContributions}
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>总贡献</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                  {activeDays}
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>活跃天数</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                  {Math.round(totalContributions / 365 * 10) / 10}
                </div>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>日均贡献</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Skill Tag Cloud */}
        <div>
          <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              技能标签云
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortedSkills.map((skill, index) => (
                <span
                  key={skill.name}
                  className={`px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 cursor-pointer ${getSkillColor(index)} ${getFontSize(skill.count)}`}
                  title={`${skill.name}: ${skill.count} 次贡献`}
                >
                  {skill.name}
                  <span className={`ml-1 opacity-70 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
                    x{skill.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
        <button
          onClick={() => setActiveTab('assets')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'assets' 
            ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
            : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>我的学习产出</span>
          {assets.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              {assets.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('relay')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'relay' 
            ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
            : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>我的接力项目</span>
          {relayProjects.length > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              {relayProjects.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('contributions')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'contributions' 
            ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
            : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <GitBranch className="w-4 h-4" />
          <span>我的贡献</span>
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === 'achievements' 
            ? theme === 'dark' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-primary-600 border-b-2 border-primary-500'
            : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <Award className="w-4 h-4" />
          <span>我的成就</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'assets' && (
        <div>
          {assets.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无学习产出</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(asset => (
                <div key={asset.id} className={`bg-white rounded-xl shadow-sm p-5 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                      {asset.type}
                    </span>
                  </div>
                  <h3 className={`font-semibold mb-2 line-clamp-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {asset.title}
                  </h3>
                  <p className={`text-sm mb-3 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {asset.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {asset.course}
                    </span>
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{asset.downloads}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{asset.score}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'relay' && (
        <div>
          {relayProjects.length === 0 ? (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无参与的接力项目</p>
            </div>
          ) : (
            <div className="space-y-4">
              {relayProjects.map(project => (
                <div key={project.id} className={`bg-white rounded-xl shadow-sm p-5 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <GraduationCap className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h3>
                      </div>
                      <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {project.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          课程：{project.course}
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          教师：{project.teacher}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${project.status === 'recruiting' ? 'bg-yellow-100 text-yellow-700' : project.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {project.status === 'recruiting' ? '招募中' : project.status === 'in_progress' ? '进行中' : '已完成'}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'contributions' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <GitBranch className="w-5 h-5 text-green-500" />
                <span>合并请求</span>
              </h3>
              {mergeRequests.length === 0 ? (
                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  暂无合并请求
                </p>
              ) : (
                <div className="space-y-3">
                  {mergeRequests.map(mr => (
                    <div key={mr.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {mr.title}
                          </h4>
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {mr.description}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${mr.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : mr.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {mr.status === 'pending' ? '待审核' : mr.status === 'accepted' ? '已接受' : '已拒绝'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className={`font-semibold mb-4 flex items-center space-x-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                <Star className="w-5 h-5 text-orange-500" />
                <span>高被引作品 TOP3</span>
              </h3>
              {topCitedAssets.length === 0 ? (
                <p className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  暂无被引用作品
                </p>
              ) : (
                <div className="space-y-3">
                  {topCitedAssets.map((asset, index) => (
                    <div key={asset.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : 'bg-orange-400 text-white'}`}>
                            {index + 1}
                          </span>
                          <div>
                            <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {asset.title}
                            </h4>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                              被引用 {asset.citations || 0} 次
                            </p>
                          </div>
                        </div>
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement, index) => (
              <div key={achievement.id} className={`p-4 rounded-xl text-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseEdit}
          />
          <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden`}>
            <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                编辑个人资料
              </h3>
              <button 
                onClick={handleCloseEdit}
                className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              >
                <X className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  用户名
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="请输入用户名"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  邮箱
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="请输入邮箱"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  院系
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="请输入院系"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  专业
                </label>
                <input
                  type="text"
                  value={editForm.major}
                  onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="请输入专业"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  年级
                </label>
                <input
                  type="text"
                  value={editForm.year}
                  onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="请输入年级"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  个人简介
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  rows={3}
                  placeholder="请输入个人简介"
                />
              </div>
            </div>
            
            <div className={`flex items-center justify-end space-x-3 p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button 
                onClick={handleCloseEdit}
                className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
              >
                取消
              </button>
              <button 
                onClick={handleSaveEdit}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>保存</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}