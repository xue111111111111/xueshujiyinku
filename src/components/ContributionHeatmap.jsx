import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const ContributionHeatmap = ({ contributions }) => {
  const { theme } = useApp();

  const generateHeatmapData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      let count = 0;
      if (contributions[dateStr]) {
        count = contributions[dateStr].total || 0;
      }
      
      data.push({
        date: dateStr,
        count,
        dayOfWeek: date.getDay(),
        weekOfYear: Math.ceil(i / 7)
      });
    }
    
    return data;
  }, [contributions]);

  const getColor = (count) => {
    if (count === 0) return theme === 'dark' ? '#1f2937' : '#ebedf0';
    if (count <= 2) return theme === 'dark' ? '#0e4429' : '#9be9a8';
    if (count <= 4) return theme === 'dark' ? '#006d32' : '#40c463';
    if (count <= 6) return theme === 'dark' ? '#26a641' : '#30a14e';
    return theme === 'dark' ? '#39d353' : '#216e39';
  };

  const totalContributions = Object.values(contributions).reduce((sum, day) => sum + (day.total || 0), 0);
  const activeDays = Object.keys(contributions).length;

  const weeks = [];
  for (let i = 0; i < 52; i++) {
    weeks.push(generateHeatmapData.filter(d => d.weekOfYear === i + 1));
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const monthLabels = [];
  let lastMonth = -1;
  
  weeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ month: months[month], weekIndex });
        lastMonth = month;
      }
    }
  });

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          贡献热力图
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
            过去一年
          </span>
          <div className="flex items-center space-x-1">
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>少</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: getColor(level * 2) }}
              />
            ))}
            <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>多</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex mb-1 ml-8">
            {monthLabels.map((label, index) => (
              <div
                key={index}
                className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                style={{ 
                  position: 'absolute', 
                  left: `${label.weekIndex * 14 + 32}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                {label.month}
              </div>
            ))}
          </div>

          <div className="flex">
            <div className="flex flex-col justify-between mr-2 text-xs" style={{ height: '180px' }}>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>周一</span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>周三</span>
              <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>周五</span>
            </div>

            <div className="flex space-x-0.5">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col space-y-0.5">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className="w-3 h-3 rounded-sm transition-colors hover:ring-2 hover:ring-primary-400 cursor-pointer"
                      style={{ backgroundColor: getColor(day.count) }}
                      title={`${day.date}: ${day.count} 次贡献`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
            {totalContributions}
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>总贡献</p>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
            {activeDays}
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>活跃天数</p>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            {Math.round(totalContributions / 365 * 10) / 10}
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>日均贡献</p>
        </div>
      </div>
    </div>
  );
};