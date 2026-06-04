import { useState } from 'react';
import {
  ShoppingCart,
  Ticket,
  Clock,
  Award,
  BookOpen,
  Printer,
  FlaskConical,
  GraduationCap,
  Star,
  X,
  Check
} from 'lucide-react';
import { getShopItems, getExchanges, getCurrentUser, addExchange } from '../utils/storage';
import { useApp } from '../context/AppContext';

const itemTypes = {
  service: { label: '服务', icon: Clock },
  coupon: { label: '优惠券', icon: Ticket },
  credit: { label: '学分', icon: GraduationCap }
};

export const Shop = () => {
  const { currentUser, theme } = useApp();
  const [items, setItems] = useState(getShopItems());
  const [exchanges, setExchanges] = useState(getExchanges());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('shop');

  const handleExchange = () => {
    if (!selectedItem) return;
    if (currentUser.points < selectedItem.points) {
      alert('积分不足！');
      return;
    }
    
    addExchange({
      userId: currentUser.id,
      itemId: selectedItem.id,
      points: selectedItem.points
    });
    
    setExchanges(getExchanges());
    setShowModal(false);
    setSelectedItem(null);
  };

  const getItemIcon = (type) => {
    const icons = {
      '图书馆座位优先权': BookOpen,
      '打印券(10张)': Printer,
      '实验室时长(2小时)': FlaskConical,
      '创新创业学分(1学分)': GraduationCap
    };
    return icons[type] || ShoppingCart;
  };

  const getItemColor = (type) => {
    const colors = {
      '图书馆座位优先权': 'bg-blue-500',
      '打印券(10张)': 'bg-green-500',
      '实验室时长(2小时)': 'bg-purple-500',
      '创新创业学分(1学分)': 'bg-yellow-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>积分商城</h2>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>使用学术积分兑换各种权益和服务</p>
        </div>
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-yellow-600/20' : 'bg-yellow-50'}`}>
          <span className="text-yellow-500">🏆</span>
          <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {currentUser?.points || 0}
          </span>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>可用积分</span>
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex space-x-1 p-1 mb-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'shop'
              ? 'bg-white text-primary-600 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4 inline mr-1" />
          积分商城
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-primary-600 shadow-sm'
              : theme === 'dark'
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          兑换记录
        </button>
      </div>

      {/* Shop Tab */}
      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => {
            const Icon = getItemIcon(item.name);
            const canAfford = currentUser.points >= item.points;
            
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-all ${theme === 'dark' ? 'bg-gray-800' : ''} ${!canAfford ? 'opacity-60' : ''}`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${getItemColor(item.name)}`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {item.name}
                </h3>
                
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.description || '点击兑换'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-500">🏆</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {item.points}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (canAfford) {
                        setSelectedItem(item);
                        setShowModal(true);
                      }
                    }}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      canAfford
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    兑换
                  </button>
                </div>
                
                {item.stock < 10 && (
                  <p className="text-xs text-orange-500 mt-2">
                    仅剩 {item.stock} 件
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="overflow-x-auto">
          <table className={`w-full ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className="text-left py-3 px-4 font-semibold">兑换商品</th>
                <th className="text-left py-3 px-4 font-semibold">消耗积分</th>
                <th className="text-left py-3 px-4 font-semibold">状态</th>
                <th className="text-left py-3 px-4 font-semibold">兑换时间</th>
              </tr>
            </thead>
            <tbody>
              {exchanges.map(exchange => {
                const item = items.find(i => i.id === exchange.itemId);
                return (
                  <tr key={exchange.id} className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'}`}>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{item?.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-yellow-500 font-semibold`}>🏆 {exchange.points}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exchange.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {exchange.status === 'completed' ? '已完成' : '处理中'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{exchange.exchangedAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {exchanges.length === 0 && (
            <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无兑换记录</p>
              <button
                onClick={() => setActiveTab('shop')}
                className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                去兑换
              </button>
            </div>
          )}
        </div>
      )}

      {/* Exchange Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-xl shadow-xl w-full max-w-md ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>确认兑换</h3>
              <button onClick={() => { setShowModal(false); setSelectedItem(null); }} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className={`flex items-center space-x-4 mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getItemColor(selectedItem.name)}`}>
                  {(() => { const Icon = getItemIcon(selectedItem.name); return <Icon className="w-6 h-6 text-white" />; })()}
                </div>
                <div>
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {selectedItem.name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-500">🏆</span>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {selectedItem.points} 积分
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`bg-yellow-50 rounded-lg p-4 mb-6 ${theme === 'dark' ? 'bg-yellow-600/20' : ''}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>当前可用积分</span>
                  <span className={`font-semibold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
                    🏆 {currentUser.points}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => { setShowModal(false); setSelectedItem(null); }}
                  className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  取消
                </button>
                <button
                  onClick={handleExchange}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Check className="w-4 h-4 inline mr-1" />
                  确认兑换
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
