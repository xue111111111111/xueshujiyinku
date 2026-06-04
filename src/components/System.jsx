import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Database, Palette, Bell, RefreshCw, Info } from 'lucide-react';

export const System = () => {
  const { theme, onToggleTheme } = useApp();
  
  const [activeTab, setActiveTab] = useState('general');

  const systemInfo = {
    version: '1.0.0',
    buildDate: '2024-01-15',
    lastUpdate: '2024-01-20',
    storageUsed: '12.5 MB',
    totalUsers: 4,
    totalAssets: 5,
    totalProjects: 2
  };

  const handleClearCache = () => {
    if (window.confirm('确定要清除缓存吗？这将重置所有数据！')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>系统设置</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>管理系统配置和维护</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`bg-white rounded-xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-primary-500 text-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300 border-transparent'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            <Palette className="w-4 h-4 inline mr-2" />
            通用设置
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'data'
                ? 'border-primary-500 text-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300 border-transparent'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            数据管理
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'info'
                ? 'border-primary-500 text-primary-600'
                : theme === 'dark'
                ? 'text-gray-400 hover:text-gray-300 border-transparent'
                : 'text-gray-500 hover:text-gray-700 border-transparent'
            }`}
          >
            <Info className="w-4 h-4 inline mr-2" />
            系统信息
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>主题设置</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>界面主题</p>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      选择深色或浅色主题
                    </p>
                  </div>
                  <button
                    onClick={onToggleTheme}
                    className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                  >
                    切换到{theme === 'dark' ? '浅色' : '深色'}模式
                  </button>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>通知设置</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>新消息通知</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>接收系统新消息提醒</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${theme === 'dark' ? 'bg-primary-600' : 'bg-primary-500'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform translate-x-6`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>邮件通知</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>接收重要邮件通知</p>
                    </div>
                    <div className={`w-12 h-6 rounded-full ${theme === 'dark' ? 'bg-primary-600' : 'bg-primary-500'}`}>
                      <div className={`w-5 h-5 rounded-full bg-white transform translate-x-6`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>数据存储</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>已使用空间</span>
                    <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{systemInfo.storageUsed}</span>
                  </div>
                  <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div className="h-full w-1/4 bg-primary-500 rounded-full" />
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/30' : 'bg-red-50'}`}>
                <div className="flex items-start space-x-3">
                  <RefreshCw className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`} />
                  <div>
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>清除缓存</h4>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      清除所有本地缓存数据，系统将恢复到初始状态。此操作不可撤销！
                    </p>
                    <button
                      onClick={handleClearCache}
                      className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      清除所有数据
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>系统版本</h4>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>版本号：{systemInfo.version}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>构建日期：{systemInfo.buildDate}</p>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>最后更新：{systemInfo.lastUpdate}</p>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>数据统计</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {systemInfo.totalUsers}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>用户总数</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {systemInfo.totalAssets}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>资料总数</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {systemInfo.totalProjects}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>接力项目</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};