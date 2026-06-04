import { useState } from 'react';
import { GitBranch, Check, X, MessageSquare, Eye, Send } from 'lucide-react';
import { getMergeRequests, approveMergeRequest, rejectMergeRequest, addCommentToMergeRequest, getAssets, getUsers } from '../utils/storage';
import { useApp } from '../context/AppContext';

export default function MergeRequests() {
  const { currentUser, theme } = useApp();
  const [requests, setRequests] = useState(getMergeRequests());
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const users = getUsers();
  const assets = getAssets();

  const getReceivedRequests = () => {
    return requests.filter(r => {
      const targetAsset = assets.find(a => a.id === r.targetAssetId);
      return targetAsset && targetAsset.uploader === currentUser?.id;
    });
  };

  const getSubmittedRequests = () => {
    return requests.filter(r => r.author === currentUser?.id);
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const handleApprove = (requestId) => {
    approveMergeRequest(requestId);
    setRequests(getMergeRequests());
    setShowDetail(false);
    setSelectedRequest(null);
  };

  const handleReject = (requestId) => {
    rejectMergeRequest(requestId, rejectionReason);
    setRequests(getMergeRequests());
    setShowDetail(false);
    setSelectedRequest(null);
    setRejectionReason('');
    setShowRejectModal(false);
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedRequest) {
      addCommentToMergeRequest(selectedRequest.id, currentUser.id, newComment);
      setRequests(getMergeRequests());
      setSelectedRequest(getMergeRequests().find(r => r.id === selectedRequest.id));
      setNewComment('');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">待审核</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">已接受</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">已拒绝</span>;
      default:
        return null;
    }
  };

  const getUserInfo = (userId) => users.find(u => u.id === userId);
  const getAssetInfo = (assetId) => assets.find(a => a.id === assetId);

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>合并请求</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>管理和查看合并请求</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-primary-500 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          全部 ({requests.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'pending'
              ? 'bg-primary-500 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          待审核 ({requests.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'approved'
              ? 'bg-primary-500 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          已接受 ({requests.filter(r => r.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('rejected')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === 'rejected'
              ? 'bg-primary-500 text-white'
              : theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          已拒绝 ({requests.filter(r => r.status === 'rejected').length})
        </button>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <GitBranch className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无合并请求</p>
          </div>
        ) : (
          filteredRequests.map(request => {
            const targetAsset = getAssetInfo(request.targetAssetId);
            const author = getUserInfo(request.author);
            const isOwner = targetAsset && targetAsset.uploader === currentUser?.id;
            
            return (
              <div
                key={request.id}
                onClick={() => {
                  setSelectedRequest(request);
                  setShowDetail(true);
                }}
                className={`bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer ${theme === 'dark' ? 'bg-gray-800' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <GitBranch className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {request.title}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {request.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        目标：{targetAsset?.title || '未知资料'}
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        提交者：{author?.name || '未知用户'}
                      </span>
                      <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                        {request.createdAt}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(request);
                        setShowDetail(true);
                      }}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {isOwner && request.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApprove(request.id);
                          }}
                          className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRequest(request);
                            setShowRejectModal(true);
                          }}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <GitBranch className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  合并请求详情
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedRequest(null);
                }}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className={`mb-6 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedRequest.title}
                  </h4>
                  {getStatusBadge(selectedRequest.status)}
                </div>
                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {selectedRequest.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>目标资料</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {getAssetInfo(selectedRequest.targetAssetId)?.title || '未知'}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>提交者</p>
                  <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {getUserInfo(selectedRequest.author)?.name || '未知用户'}
                  </p>
                </div>
              </div>

              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div className={`mb-6 p-4 rounded-lg bg-red-50 ${theme === 'dark' ? 'bg-red-900/30' : ''}`}>
                  <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>拒绝理由</p>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}

              {/* Comments */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <MessageSquare className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    评论 ({selectedRequest.comments?.length || 0})
                  </h4>
                </div>

                {selectedRequest.comments?.length === 0 ? (
                  <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    暂无评论
                  </p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {selectedRequest.comments.map(comment => (
                      <div key={comment.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {getUserInfo(comment.author)?.name || '未知用户'}
                          </span>
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                            {comment.createdAt}
                          </span>
                        </div>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="添加评论..."
                    className={`flex-1 px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowDetail(false);
                    setSelectedRequest(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  关闭
                </button>
                {getAssetInfo(selectedRequest.targetAssetId)?.uploader === currentUser?.id && selectedRequest.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      接受合并
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectModal(true);
                        setShowDetail(false);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      拒绝
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                拒绝合并请求
              </h3>
              <button
                onClick={() => setShowRejectModal(false)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                请输入拒绝理由：
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border mb-4 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                rows={3}
                placeholder="请说明拒绝的原因..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  取消
                </button>
                <button
                  onClick={() => handleReject(selectedRequest.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  确认拒绝
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}