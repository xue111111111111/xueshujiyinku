import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getUsers, setUsers, generateId } from '../utils/storage';
import { Users, UserPlus, Search, Edit2, Trash2, X, UserCheck, User } from 'lucide-react';

export const UserManage = () => {
  const { theme } = useApp();
  const [users, setUsersState] = useState(getUsers());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleFilter, setRoleFilter] = useState('all');

  const [formData, setFormData] = useState({
    name: '',
    role: 'student',
    department: '',
    major: '',
    grade: '',
    email: ''
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing && selectedUser) {
      const updatedUsers = users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u);
      setUsers(updatedUsers);
      setUsersState(updatedUsers);
    } else {
      const newUser = {
        ...formData,
        id: generateId('u'),
        points: 0
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setUsersState(updatedUsers);
    }
    setShowModal(false);
    setFormData({ name: '', role: 'student', department: '', major: '', grade: '', email: '' });
    setIsEditing(false);
    setSelectedUser(null);
  };

  const handleDelete = (userId) => {
    if (window.confirm('确定要删除这个用户吗？')) {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);
      setUsersState(updatedUsers);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setFormData({
      name: user.name,
      role: user.role,
      department: user.department,
      major: user.major,
      grade: user.grade,
      email: user.email
    });
    setShowModal(true);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'student': return '学生';
      case 'teacher': return '老师';
      case 'admin': return '管理员';
      default: return '未知';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'bg-green-100 text-green-700';
      case 'teacher': return 'bg-blue-100 text-blue-700';
      case 'admin': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const departments = ['计算机学院', '电子工程学院', '数学学院', '商学院'];
  const majors = ['计算机科学', '软件工程', '人工智能', '电子信息', '通信工程', '数学', '工商管理'];

  return (
    <div className="fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>用户管理</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>管理系统用户和权限</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedUser(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>添加用户</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="搜索用户名或邮箱..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={`px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
          >
            <option value="all">全部角色</option>
            <option value="student">学生</option>
            <option value="teacher">老师</option>
            <option value="admin">管理员</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
        <table className="w-full">
          <thead>
            <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <th className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>用户信息</th>
              <th className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>角色</th>
              <th className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>院系/专业</th>
              <th className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>积分</th>
              <th className={`text-center py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className={`border-t ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'}`}>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                      <User className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user.department} · {user.major}
                  </p>
                  {user.grade && (
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      {user.grade}级
                    </p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    🏆 {user.points || 0}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'}`}
                      title="编辑"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className={`p-2 rounded-lg ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}
                      title="删除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>暂无用户</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {isEditing ? '编辑用户' : '添加用户'}
              </h3>
              <button onClick={() => {
                setShowModal(false);
                setIsEditing(false);
                setSelectedUser(null);
              }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>姓名 *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="输入姓名"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>角色 *</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="student">学生</option>
                  <option value="teacher">老师</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>院系</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">选择院系</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>专业</label>
                  <select
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  >
                    <option value="">选择专业</option>
                    {majors.map(major => (
                      <option key={major} value={major}>{major}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>年级</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                >
                  <option value="">选择年级</option>
                  {['2020', '2021', '2022', '2023', '2024', '2025'].map(grade => (
                    <option key={grade} value={grade}>{grade}级</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>邮箱 *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
                  placeholder="输入邮箱"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setSelectedUser(null);
                  }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  {isEditing ? '保存修改' : '添加用户'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};