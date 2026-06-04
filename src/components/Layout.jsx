import { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Award,
  Search,
  ShoppingCart,
  BarChart3,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  GitBranch,
  Users,
  User,
  FileCheck,
  Coins,
  Shield,
  LogOut,
  RefreshCw,
  FileEdit,
  ClipboardCheck,
  ClipboardList,
  UserCheck,
  BookMarked
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// 学生端导航
const studentNav = [
  { id: 'assets', label: '学习产出', icon: BookOpen },
  { id: 'relay', label: '跨期接力', icon: GitBranch },
  { id: 'shop', label: '积分商城', icon: ShoppingCart },
  { id: 'mergerequests', label: '我的申请', icon: ClipboardList },
  { id: 'profile', label: '个人主页', icon: User },
  { id: 'search', label: '资料检索', icon: Search },
  { id: 'stats', label: '统计看板', icon: BarChart3 }
];

// 老师端导航
const teacherNav = [
  { id: 'mycourses', label: '我的课程', icon: BookMarked },
  { id: 'homework', label: '作业管理', icon: FileEdit },
  { id: 'cases', label: '教学案例', icon: Award },
  { id: 'approval', label: '接力审批', icon: ClipboardCheck },
  { id: 'stats', label: '统计看板', icon: BarChart3 }
];

// 管理员端导航
const adminNav = [
  { id: 'usermanage', label: '用户管理', icon: Users },
  { id: 'contentaudit', label: '内容审核', icon: FileCheck },
  { id: 'pointconfig', label: '积分配置', icon: Coins },
  { id: 'system', label: '系统设置', icon: Shield },
  { id: 'stats', label: '全局统计看板', icon: BarChart3 }
];

export const Layout = ({ children, activeTab, onTabChange }) => {
  const { currentUser, theme, onToggleTheme, onRoleSwitch, onLogout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // 根据角色获取导航菜单
  const getNavItems = () => {
    switch (currentUser?.role) {
      case 'teacher':
        return teacherNav;
      case 'admin':
        return adminNav;
      default:
        return studentNav;
    }
  };

  const navItems = getNavItems();

  const handleRoleSwitch = (role) => {
    onRoleSwitch(role);
    setRoleModalOpen(false);
    setUserMenuOpen(false);
    onTabChange('assets');
  };

  const handleLogout = () => {
    onLogout();
    setUserMenuOpen(false);
    onTabChange('assets');
  };

  const roleOptions = [
    { role: 'student', label: '学生端', description: '学习产出、跨期接力、积分商城' },
    { role: 'teacher', label: '老师端', description: '课程管理、作业审批、教学案例' },
    { role: 'admin', label: '管理员端', description: '用户管理、内容审核、系统设置' }
  ];

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return '学生';
      case 'teacher': return '老师';
      case 'admin': return '管理员';
      default: return '未知';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm transition-all duration-300 ${theme === 'dark' ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-2 shrink-0">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform hover:scale-105 ${theme === 'dark' ? 'bg-primary-600' : 'bg-primary-500'}`}>
                <Award className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>学术基因库</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `${theme === 'dark' ? 'bg-primary-600 text-white shadow-md' : 'bg-primary-500 text-white shadow-md'}`
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Points - 只对学生显示 */}
              {currentUser?.role === 'student' && (
                <div className={`hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-50'}`}>
                  <span className="text-yellow-500">🏆</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {currentUser?.points || 0}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>积分</span>
                </div>
              )}

              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
                title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {currentUser?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {currentUser?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>

                {userMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg py-2 z-50 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                      <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{currentUser?.name}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        当前角色：{getRoleLabel(currentUser?.role)}
                      </p>
                    </div>
                    <button 
                      onClick={() => { 
                        onTabChange('relay');
                        setUserMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <GitBranch className="w-4 h-4 inline mr-2" />
                      🧬 我的学术基因链
                    </button>
                    <button className={`w-full px-4 py-2.5 text-left text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      <Settings className="w-4 h-4 inline mr-2" />
                      👤 个人设置
                    </button>
                    <button 
                      onClick={() => {
                        setRoleModalOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <RefreshCw className="w-4 h-4 inline mr-2" />
                      🔄 切换角色
                    </button>
                    <div className={`border-t mt-2 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`} />
                    <button 
                      onClick={handleLogout}
                      className={`w-full px-4 py-2.5 text-left text-sm ${theme === 'dark' ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-50'}`}
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      🚪 退出登录
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            {currentUser?.role === 'student' && (
              <div className="px-4 py-2">
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-yellow-600/20' : 'bg-yellow-50'}`}>
                  <span className="text-yellow-500">🏆</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    {currentUser?.points || 0}
                  </span>
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>积分</span>
                </div>
              </div>
            )}
            <nav className="px-2 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? `${theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-primary-500 text-white'}`
                        : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Role Switch Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-xl shadow-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                🔄 切换角色
              </h3>
              <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                选择您要切换到的角色
              </p>
            </div>
            <div className="p-6 space-y-3">
              {roleOptions.map((option) => (
                <button
                  key={option.role}
                  onClick={() => handleRoleSwitch(option.role)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    currentUser?.role === option.role
                      ? theme === 'dark'
                        ? 'border-primary-500 bg-primary-500/20'
                        : 'border-primary-500 bg-primary-50'
                      : theme === 'dark'
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {option.label}
                        {currentUser?.role === option.role && (
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-primary-500' : 'bg-primary-100 text-primary-700'}`}>
                            当前
                          </span>
                        )}
                      </p>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {option.description}
                      </p>
                    </div>
                    {currentUser?.role === option.role && (
                      <UserCheck className={`w-5 h-5 ${theme === 'dark' ? 'text-primary-400' : 'text-primary-500'}`} />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setRoleModalOpen(false)}
                className={`w-full py-2.5 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className={`mt-auto py-6 border-t ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2024 校园学术基因库 - 传承智慧，接力未来
          </p>
        </div>
      </footer>
    </div>
  );
};