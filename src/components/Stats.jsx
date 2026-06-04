import { useState, useEffect } from 'react';
import {
  TrendingUp,
  BookOpen,
  Calendar,
  BarChart2,
  Award,
  Users,
  GraduationCap,
  FileText,
  Coins,
  Target,
  Activity,
  ShoppingCart,
  CheckCircle,
  PieChart
} from 'lucide-react';
import { getAssets, getUsers, getRelayProjects, getExchanges, getApplications, getCitations } from '../utils/storage';
import { useApp } from '../context/AppContext';
import { departments } from '../data/mockData';

export const Stats = () => {
  const { theme, currentUser } = useApp();
  const [assets] = useState(getAssets());
  const [users] = useState(getUsers());
  const [projects] = useState(getRelayProjects());
  const [exchanges] = useState(getExchanges());
  const [applications] = useState(getApplications());
  
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayAssets = assets.filter(a => a.createdAt === today);
    const todayApplications = applications.filter(a => a.submittedAt === today);
    
    // 近7天数据
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count: assets.filter(a => a.createdAt === dateStr).length
      });
    }
    
    // 各类型统计
    const typeStats = {};
    ['笔记', '实验报告', '课程设计', '毕设', '竞赛作品'].forEach(type => {
      typeStats[type] = assets.filter(a => a.type === type).length;
    });

    // 各院系统计
    const deptStats = {};
    departments.forEach(dept => {
      deptStats[dept.name] = assets.filter(a => {
        const user = users.find(u => u.id === a.uploader);
        return user?.department === dept.name;
      }).length;
    });

    // 总积分发放量
    const totalPointsIssued = exchanges.reduce((sum, e) => sum + e.points, 0);
    
    // 教学案例总数
    const teachingCases = assets.filter(a => a.isCase).length;

    // 用户活跃度统计（近30天有活动的用户）
    const activeUsers30Days = users.filter(user => {
      const userAssets = assets.filter(a => a.uploader === user.id);
      if (userAssets.length === 0) return false;
      const latestAssetDate = userAssets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0].createdAt;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(latestAssetDate) >= thirtyDaysAgo;
    }).length;

    // 积分兑换成功率
    const successfulExchanges = exchanges.filter(e => e.status === 'completed').length;
    const exchangeSuccessRate = exchanges.length > 0 ? Math.round((successfulExchanges / exchanges.length) * 100) : 0;

    // 干预成功率（接力项目完成率）
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const interventionSuccessRate = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0;

    setChartData({
      totalAssets: assets.length,
      totalProjects: projects.length,
      totalPointsIssued,
      todayUploads: todayAssets.length,
      todayApplications: todayApplications.length,
      teachingCases,
      last7Days,
      typeStats,
      deptStats,
      activeUsers30Days,
      totalUsers: users.length,
      exchangeSuccessRate,
      interventionSuccessRate,
      totalExchanges: exchanges.length
    });
  }, [assets, users, projects, exchanges, applications]);

  // 即使没有数据也渲染，显示默认值
  const stats = chartData || {
    totalAssets: 0,
    totalProjects: 0,
    totalPointsIssued: 0,
    todayUploads: 0,
    todayApplications: 0,
    teachingCases: 0,
    last7Days: Array(7).fill({ date: '', count: 0 }),
    typeStats: {},
    deptStats: {},
    activeUsers30Days: 0,
    totalUsers: 0,
    exchangeSuccessRate: 0,
    interventionSuccessRate: 0,
    totalExchanges: 0
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>统计看板</h2>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>实时数据统计与分析</p>
      </div>

      {/* Stats Cards - 6个核心统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总学习产出</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalAssets}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总接力项目</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.totalProjects}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>总积分发放</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {stats.totalPointsIssued}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Coins className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>今日上传</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.todayUploads}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>今日申请接力</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.todayApplications}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>教学案例</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.teachingCases}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Award className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 辅助统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>用户活跃度(30天)</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stats.activeUsers30Days}/{stats.totalUsers}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>积分兑换成功率</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                {stats.exchangeSuccessRate}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>干预成功率</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                {stats.interventionSuccessRate}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 - 使用简单的进度条代替图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <TrendingUp className="w-5 h-5 inline mr-2" />
            近7天上传趋势
          </h3>
          <div className="space-y-2">
            {stats.last7Days.map((day, index) => (
              <div key={index} className="flex items-center">
                <span className={`text-xs w-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {day.date}
                </span>
                <div className={`flex-1 h-2 mx-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${Math.min((day.count / 10) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-xs w-8 text-right ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  {day.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <PieChart className="w-5 h-5 inline mr-2" />
            资料类型分布
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.typeStats).map(([type, count], index) => {
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{type}</span>
                    <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{count}</span>
                  </div>
                  <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-300`}
                      style={{ width: `${stats.totalAssets > 0 ? (count / stats.totalAssets) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <BarChart2 className="w-5 h-5 inline mr-2" />
            各院系贡献量
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.deptStats).map(([dept, count]) => (
              <div key={dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{dept}</span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{count}</span>
                </div>
                <div className={`h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${stats.totalAssets > 0 ? (count / stats.totalAssets) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 热门课程和贡献者 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>热门课程TOP5</h3>
          {(() => {
            const topCourses = assets.reduce((acc, asset) => {
              acc[asset.course] = (acc[asset.course] || 0) + 1;
              return acc;
            }, {});
            const sortedCourses = Object.entries(topCourses).sort((a, b) => b[1] - a[1]).slice(0, 5);
            
            return sortedCourses.length > 0 ? (
              <div className="space-y-3">
                {sortedCourses.map(([course, count], index) => (
                  <div key={course} className="flex items-center">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-300 text-orange-800' :
                      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    <span className={`flex-1 ml-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {course}
                    </span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`py-8 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                <p>暂无数据</p>
              </div>
            );
          })()}
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <h3 className={`font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>活跃贡献者TOP5</h3>
          {(() => {
            const topContributors = assets.reduce((acc, asset) => {
              acc[asset.uploader] = (acc[asset.uploader] || 0) + 1;
              return acc;
            }, {});
            const sortedContributors = Object.entries(topContributors).sort((a, b) => b[1] - a[1]).slice(0, 5);
            
            return sortedContributors.length > 0 ? (
              <div className="space-y-3">
                {sortedContributors.map(([userId, count], index) => {
                  const user = users.find(u => u.id === userId);
                  return (
                    <div key={userId} className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-300 text-orange-800' :
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {index + 1}
                      </span>
                      <span className={`flex-1 ml-3 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user?.name || '未知用户'}
                      </span>
                      <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {count} 篇
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`py-8 text-center ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                <p>暂无数据</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};