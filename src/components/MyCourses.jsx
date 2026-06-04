import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getAssets, getRelayProjects } from '../utils/storage';
import { BookOpen, Users, FileText, ChevronRight, GraduationCap } from 'lucide-react';

export const MyCourses = () => {
  const { currentUser, theme } = useApp();
  const [activeTab, setActiveTab] = useState('assets');

  // 获取老师的课程列表
  const getTeacherCourses = () => {
    const assets = getAssets();
    const teacherAssets = assets.filter(a => a.teacher === currentUser?.name);
    const courses = [...new Set(teacherAssets.map(a => a.course))];
    return courses.map(course => {
      const courseAssets = teacherAssets.filter(a => a.course === course);
      return {
        name: course,
        count: courseAssets.length,
        cases: courseAssets.filter(a => a.isCase).length,
        avgScore: courseAssets.length > 0 
          ? Math.round(courseAssets.reduce((sum, a) => sum + a.score, 0) / courseAssets.length)
          : 0
      };
    });
  };

  const courses = getTeacherCourses();

  const getProjectCount = () => {
    const projects = getRelayProjects();
    const assets = getAssets();
    return projects.filter(p => {
      const asset = assets.find(a => a.id === p.originalAsset);
      return asset?.teacher === currentUser?.name;
    }).length;
  };

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>我的课程</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>管理您教授的课程和相关资料</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>课程数量</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {courses.length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>资料总数</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {getAssets().filter(a => a.teacher === currentUser?.name).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>教学案例</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {getAssets().filter(a => a.teacher === currentUser?.name && a.isCase).length}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className={`bg-white rounded-xl shadow-sm p-4 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>接力项目</p>
              <p className={`text-2xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {getProjectCount()}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`bg-white rounded-xl shadow-sm p-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'assets'
                ? 'bg-primary-500 text-white'
                : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            课程资料
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-primary-500 text-white'
                : theme === 'dark'
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            接力项目
          </button>
        </div>

        {activeTab === 'assets' && (
          <div className="space-y-3">
            {courses.length > 0 ? (
              courses.map(course => (
                <div key={course.name} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-blue-100'}`}>
                        <BookOpen className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {course.name}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {course.count} 份资料 · {course.cases} 个教学案例 · 平均分 {course.avgScore}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无课程资料</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-3">
            {getProjectCount() > 0 ? (
              getRelayProjects().filter(p => {
                const asset = getAssets().find(a => a.id === p.originalAsset);
                return asset?.teacher === currentUser?.name;
              }).map(project => (
                <div key={project.id} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-purple-100'}`}>
                        <GraduationCap className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {project.title}
                        </h3>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          {project.status === 'recruiting' ? '🔵 待接力' : project.status === 'in_progress' ? '🟡 接力中' : '🟢 已传承'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无接力项目</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};