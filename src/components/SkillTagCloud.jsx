import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export const SkillTagCloud = ({ skills }) => {
  const { theme } = useApp();

  const sortedSkills = useMemo(() => {
    return Object.entries(skills)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [skills]);

  const maxCount = Math.max(...sortedSkills.map(s => s.count), 1);

  const getFontSize = (count) => {
    const ratio = count / maxCount;
    if (ratio >= 0.8) return 'text-xl';
    if (ratio >= 0.6) return 'text-lg';
    if (ratio >= 0.4) return 'text-base';
    if (ratio >= 0.2) return 'text-sm';
    return 'text-xs';
  };

  const getColor = (index) => {
    const colors = theme === 'dark' 
      ? ['bg-blue-500/20 text-blue-400', 'bg-purple-500/20 text-purple-400', 'bg-green-500/20 text-green-400', 'bg-yellow-500/20 text-yellow-400', 'bg-pink-500/20 text-pink-400']
      : ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-pink-100 text-pink-700'];
    return colors[index % colors.length];
  };

  if (sortedSkills.length === 0) {
    return (
      <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          技能标签
        </h3>
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>暂无技能数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
      <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        技能标签云
      </h3>
      <div className="flex flex-wrap gap-2">
        {sortedSkills.map((skill, index) => (
          <span
            key={skill.name}
            className={`px-3 py-1.5 rounded-full font-medium transition-all hover:scale-105 cursor-pointer ${getColor(index)} ${getFontSize(skill.count)}`}
            title={`${skill.name}: ${skill.count} 次贡献`}
          >
            {skill.name}
            <span className={`ml-1 opacity-70 ${theme === 'dark' ? 'text-white/50' : 'text-gray-500'}`}>
              x{skill.count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};