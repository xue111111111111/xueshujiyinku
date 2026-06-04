import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Assets } from './components/Assets';
import { Relay } from './components/Relay';
import { Shop } from './components/Shop';
import { SearchPage } from './components/Search';
import { Stats } from './components/Stats';
import { MyCourses } from './components/MyCourses';
import { Cases } from './components/Cases';
import { Approval } from './components/Approval';
import { UserManage } from './components/UserManage';
import { PointConfig } from './components/PointConfig';
import { System } from './components/System';
import { AIAssistant } from './components/AIAssistant';
import MergeRequests from './components/MergeRequests';
import Profile from './components/Profile';

const AppContent = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState('assets');
  
  useEffect(() => {
    const relayDraft = localStorage.getItem('relayDraft');
    if (relayDraft) {
      setActiveTab('relay');
    }
  }, []);
  
  const renderContent = () => {
    switch (activeTab) {
      case 'assets':
        return <Assets />;
      case 'relay':
        return <Relay />;
      case 'shop':
        return <Shop />;
      case 'search':
        return <SearchPage />;
      case 'stats':
        return <Stats />;
      case 'mergerequests':
        return <MergeRequests />;
      case 'profile':
        return <Profile />;
      case 'mycourses':
        return <MyCourses />;
      case 'homework':
        return <div className="text-center py-12">作业管理功能开发中...</div>;
      case 'cases':
        return <Cases />;
      case 'approval':
        return <Approval />;
      case 'usermanage':
        return <UserManage />;
      case 'contentaudit':
        return <div className="text-center py-12">内容审核功能开发中...</div>;
      case 'pointconfig':
        return <PointConfig />;
      case 'system':
        return <System />;
      default:
        return <Assets />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
      <AIAssistant />
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;