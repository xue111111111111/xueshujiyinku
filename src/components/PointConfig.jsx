import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Coins, Gift, Star, Award, Save } from 'lucide-react';

export const PointConfig = () => {
  const { theme } = useApp();
  
  const [config, setConfig] = useState({
    uploadPoints: 10,
    citationPoints: 5,
    relayCompletePoints: 30,
    mentorPoints: 15,
    downloadPoints: 2,
    likePoints: 1
  });

  const handleSave = () => {
    localStorage.setItem('pointConfig', JSON.stringify(config));
    alert('积分配置已保存');
  };

  const handleChange = (key, value) => {
    setConfig({ ...config, [key]: parseInt(value) || 0 });
  };

  const configItems = [
    { key: 'uploadPoints', label: '上传资料', icon: Gift, description: '用户上传学习资料获得的积分' },
    { key: 'citationPoints', label: '被引用', icon: Star, description: '资料被其他用户引用获得的积分' },
    { key: 'relayCompletePoints', label: '完成接力', icon: Award, description: '完成接力项目获得的积分' },
    { key: 'mentorPoints', label: '指导接力', icon: Coins, description: '指导学生完成接力获得的积分' },
    { key: 'downloadPoints', label: '下载奖励', icon: Gift, description: '资料被下载获得的积分' },
    { key: 'likePoints', label: '点赞奖励', icon: Star, description: '资料获得点赞获得的积分' }
  ];

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>积分配置</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>配置系统积分规则</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>保存配置</span>
        </button>
      </div>

      {/* Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {configItems.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} className={`bg-white rounded-xl shadow-sm p-5 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-yellow-600/20' : 'bg-yellow-100'}`}>
                  <Icon className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {item.label}
                  </h3>
                  <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>奖励积分：</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config[item.key]}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className={`w-20 px-3 py-1.5 rounded-lg border text-center font-semibold ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-yellow-400' : 'bg-gray-50 border-gray-200 text-yellow-600'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>分</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <h3 className={`font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <Coins className="w-5 h-5 inline mr-2" />
          积分规则说明
        </h3>
        <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500">•</span>
            <span><strong>上传资料：</strong>学生上传学习资料后，系统自动发放奖励积分</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500">•</span>
            <span><strong>被引用：</strong>当其他用户引用您的资料时，您将获得引用奖励</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500">•</span>
            <span><strong>接力完成：</strong>完成接力项目后，贡献者和导师都将获得奖励</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-yellow-500">•</span>
            <span><strong>下载/点赞：</strong>资料被下载或点赞时，作者获得相应奖励</span>
          </li>
        </ul>
      </div>
    </div>
  );
};