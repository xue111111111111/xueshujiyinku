import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAssets, getUsers } from '../utils/storage';
import { FileText, CheckCircle, Clock, AlertCircle, ChevronRight, Search } from 'lucide-react';

export const Homework = () => {
  const { currentUser, theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getTeacherAssets = () => {
    return getAssets().filter(a => a.teacher === currentUser?.name);
  };

  const assets = getTeacherAssets();
  const users = getUsers();

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getUploaderName = (uploaderId) => {
    const user = users.find(u => u.id === uploaderId);
    return user?.name || '未知用户';
  };

  const getStatus = (asset) => {
    if (asset.score >= 90) return { label: '优秀', color: 'text-green-600 bg-green-100' };
    if (asset.score >= 80) return { label: '良好', color: 'text-blue-600 bg-blue-100' };
    if (asset.score >= 60) return { label: '及格', color: 'text-yellow-600 bg-yellow-100' };
    return { label: '待批改', color: 'text-gray-600 bg-gray-100' };
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>作业管理</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>查看和批改学生提交的作业</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="搜索作业标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          </div>
          <div className="flex space-x-2">
            {['all', 'pending', 'graded'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-primary-500 text-white'
                    : theme === 'dark'
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? '全部' : status === 'pending' ? '待批改' : '已批改'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总作业数</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {assets.length}
              </p>
            </div>
          </div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>待批改</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {assets.filter(a => a.score === 0).length}
              </p>
            </div>
          </div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>已批改</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {assets.filter(a => a.score > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Homework List */}
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className={`border-b p-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>作业列表</h3>
        </div>
        <div className="divide-y">
          {filteredAssets.length > 0 ? (
            filteredAssets.map(asset => {
              const status = getStatus(asset);
              return (
                <div key={asset.id} className={`p-4 hover:bg-gray-50 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {asset.title}
                      </h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {asset.course} · {getUploaderName(asset.uploader)} · {asset.createdAt}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {asset.score > 0 ? (
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary-600">{asset.score}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          待批改
                        </span>
                      )}
                      <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无作业</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};