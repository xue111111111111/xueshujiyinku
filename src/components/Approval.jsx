import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getApplications, getRelayProjects, getAssets, getUsers, approveApplication } from '../utils/storage';
import { ClipboardCheck, CheckCircle, XCircle, Clock, MessageSquare, ChevronRight } from 'lucide-react';

export const Approval = () => {
  const { currentUser, theme } = useApp();
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const users = getUsers();
  const projects = getRelayProjects();
  const assets = getAssets();

  // 获取老师相关的申请
  const getTeacherApplications = () => {
    return getApplications().filter(app => {
      const project = projects.find(p => p.id === app.projectId);
      const asset = assets.find(a => a.id === project?.originalAsset);
      return asset?.teacher === currentUser?.name;
    });
  };

  const applications = getTeacherApplications();
  const pendingApps = applications.filter(a => a.status === 'pending');
  const approvedApps = applications.filter(a => a.status === 'approved');

  const getProjectTitle = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || '未知项目';
  };

  const getApplicantName = (applicantId) => {
    const user = users.find(u => u.id === applicantId);
    return user?.name || '未知用户';
  };

  const handleApprove = (appId) => {
    approveApplication(appId);
    setShowModal(false);
    setSelectedApp(null);
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>接力审批</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>审批学生的接力申请</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>待审批</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {pendingApps.length}
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
                {approvedApps.length}
              </p>
            </div>
          </div>
        </div>
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总申请</p>
              <p className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {applications.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      <div className={`bg-white rounded-xl shadow-sm p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <Clock className="w-5 h-5 inline mr-2" />
          待审批申请
        </h3>
        
        {pendingApps.length > 0 ? (
          <div className="space-y-3">
            {pendingApps.map(app => (
              <div key={app.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {getProjectTitle(app.projectId)}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      申请人：{getApplicantName(app.applicant)} · 提交时间：{app.submittedAt}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600"
                  >
                    <span>查看详情</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无待审批申请</p>
          </div>
        )}
      </div>

      {/* Approved Applications */}
      <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          <CheckCircle className="w-5 h-5 inline mr-2" />
          已通过申请
        </h3>
        
        {approvedApps.length > 0 ? (
          <div className="space-y-3">
            {approvedApps.map(app => (
              <div key={app.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {getProjectTitle(app.projectId)}
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      申请人：{getApplicantName(app.applicant)} · 提交时间：{app.submittedAt}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">已通过</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无已通过的申请</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-lg ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                申请详情
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>申请项目</p>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {getProjectTitle(selectedApp.projectId)}
                </p>
              </div>
              
              <div>
                <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>申请人</p>
                <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {getApplicantName(selectedApp.applicant)}
                </p>
              </div>
              
              <div>
                <div className="flex items-start space-x-2">
                  <MessageSquare className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>个人简介</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedApp.resume}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start space-x-2">
                  <ClipboardCheck className={`w-5 h-5 mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>接力计划</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {selectedApp.plan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex space-x-3 p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApp(null);
                }}
                className={`flex-1 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                驳回
              </button>
              <button
                onClick={() => handleApprove(selectedApp.id)}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                通过申请
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};