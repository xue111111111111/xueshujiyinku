import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAssets, updateAsset, deleteAsset, getUsers } from '../utils/storage';
import { FileCheck, AlertCircle, CheckCircle, XCircle, Search, Filter, FileText } from 'lucide-react';

export const ContentAudit = () => {
  const { theme } = useApp();
  const [assets, setAssets] = useState(getAssets());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = getUsers();

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleApprove = (assetId) => {
    updateAsset(assetId, { isApproved: true });
    setAssets(getAssets());
  };

  const handleReject = (assetId) => {
    if (window.confirm('确定要拒绝这份资料吗？')) {
      deleteAsset(assetId);
      setAssets(getAssets());
    }
  };

  const getUploaderName = (uploaderId) => {
    const user = users.find(u => u.id === uploaderId);
    return user?.name || '未知用户';
  };

  const getStatusColor = (isApproved) => {
    if (isApproved === true) return 'bg-green-100 text-green-700';
    if (isApproved === false) return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusLabel = (isApproved) => {
    if (isApproved === true) return '已通过';
    if (isApproved === false) return '已拒绝';
    return '待审核';
  };

  const pendingAssets = filteredAssets.filter(a => a.isApproved !== true);
  const approvedAssets = filteredAssets.filter(a => a.isApproved === true);

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>内容审核</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>审核用户上传的学习资料</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>待审核</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {pendingAssets.length}
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
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>已通过</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {approvedAssets.length}
              </p>
            </div>
          </div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总资料</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {filteredAssets.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="搜索资料标题或描述..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            <option value="all">全部状态</option>
            <option value="pending">待审核</option>
            <option value="approved">已通过</option>
          </select>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <div key={asset.id} className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {asset.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.isApproved)}`}>
                      {getStatusLabel(asset.isApproved)}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {asset.description}
                  </p>
                  <div className={`flex items-center space-x-4 mt-2 text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <span>类型：{asset.type}</span>
                    <span>课程：{asset.course}</span>
                    <span>上传者：{getUploaderName(asset.uploader)}</span>
                    <span>时间：{asset.createdAt}</span>
                  </div>
                </div>
                {asset.isApproved !== true && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleApprove(asset.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>通过</span>
                    </button>
                    <button
                      onClick={() => handleReject(asset.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>拒绝</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={`bg-white rounded-xl shadow-sm p-12 text-center ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <FileCheck className={`w-12 h-12 mx-auto mb-4 opacity-50 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>暂无资料</p>
          </div>
        )}
      </div>
