import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAssets, updateAsset, getUsers } from '../utils/storage';
import { Award, Star, Download, BookOpen, X, CheckCircle } from 'lucide-react';

export const Cases = () => {
  const { currentUser, theme } = useApp();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getTeacherCases = () => {
    return getAssets().filter(a => a.teacher === currentUser?.name && a.isCase);
  };

  const getTeacherAssets = () => {
    return getAssets().filter(a => a.teacher === currentUser?.name && !a.isCase);
  };

  const cases = getTeacherCases();
  const eligibleAssets = getTeacherAssets();
  const users = getUsers();

  const getUploaderName = (uploaderId) => {
    const user = users.find(u => u.id === uploaderId);
    return user?.name || '未知用户';
  };

  const addToCase = (assetId) => {
    updateAsset(assetId, { isCase: true });
    setShowModal(false);
    setSelectedAsset(null);
  };

  const removeFromCase = (assetId) => {
    if (window.confirm('确定要从教学案例中移除吗？')) {
      updateAsset(assetId, { isCase: false });
    }
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>教学案例</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>管理优秀的教学案例资料</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Award className="w-5 h-5" />
          <span>添加案例</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>教学案例数</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {cases.length}
              </p>
            </div>
          </div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>平均评分</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {cases.length > 0 ? Math.round(cases.reduce((sum, a) => sum + a.score, 0) / cases.length) : 0}
              </p>
            </div>
          </div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总下载量</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {cases.reduce((sum, a) => sum + a.downloads, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases.length > 0 ? (
          cases.map(asset => (
            <div key={asset.id} className={`bg-white rounded-xl shadow-sm p-5 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  🎯 教学案例
                </span>
                <button
                  onClick={() => removeFromCase(asset.id)}
                  className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}
                >
                  移除
                </button>
              </div>
              
              <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {asset.title}
              </h3>
              
              <p className={`text-sm text-gray-500 mb-3 ${theme === 'dark' ? 'text-gray-400' : ''}`}>
                {asset.description}
              </p>
              
              <div className={`flex items-center justify-between text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>{asset.score}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span>📥 {asset.downloads}</span>
                  <span>🔗 {asset.citations}</span>
                </div>
              </div>
              
              <div className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {asset.course} · {getUploaderName(asset.uploader)} · {asset.createdAt}
              </div>
            </div>
          ))
        ) : (
          <div className={`col-span-full text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无教学案例</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              添加案例
            </button>
          </div>
        )}
      </div>

      {/* Add Case Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                添加教学案例
              </h3>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {eligibleAssets.length > 0 ? (
                <div className="space-y-2">
                  {eligibleAssets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => addToCase(asset.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {asset.title}
                          </h4>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {asset.course} · {asset.score}分 · {getUploaderName(asset.uploader)}
                          </p>
                        </div>
                        <CheckCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>没有可添加为案例的资料</p>
                </div>
              )}
            </div>
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setShowModal(false)}
                className={`w-full py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
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