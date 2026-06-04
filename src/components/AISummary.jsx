import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Loader2, 
  RefreshCw, 
  Brain,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Star,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAssets } from '../utils/storage';

export const AISummary = ({ asset }) => {
  const { theme } = useApp();
  const [summary, setSummary] = useState(asset.aiSummary || null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  useEffect(() => {
    if (!summary && !isGenerating) {
      generateSummary();
    }
  }, [asset]);

  const generateSummary = async () => {
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const generatedSummary = {
        coreFunction: generateCoreFunction(asset),
        techStack: generateTechStack(asset),
        highlights: generateHighlights(asset),
        keywords: extractKeywords(asset),
        learningSuggestions: generateLearningSuggestions(asset),
        relatedResources: findRelatedResources(asset),
        qualityScore: calculateQualityScore(asset),
        generatedAt: new Date().toISOString()
      };
      
      setSummary(generatedSummary);
      
      const assets = JSON.parse(localStorage.getItem('assets') || '[]');
      const updatedAssets = assets.map(a => 
        a.id === asset.id ? { ...a, aiSummary: generatedSummary } : a
      );
      localStorage.setItem('assets', JSON.stringify(updatedAssets));
    } catch (error) {
      console.error('AI总结生成失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCoreFunction = (asset) => {
    const type = asset.type;
    const title = asset.title;
    const description = asset.description || '';
    
    const templates = {
      '笔记': `本笔记系统整理了${title}的核心知识点。${description.length > 0 ? '内容涵盖：' + description.substring(0, 50) + '...' : '帮助快速掌握课程重点和难点。'}`,
      '实验报告': `本实验报告详细记录了${title}的完整实验过程。${description.length > 0 ? '研究方向：' + description.substring(0, 50) + '...' : '包含数据分析及结论验证。'}`,
      '课程设计': `本课程设计实现了${title}的核心功能模块，完成度达95%以上。${description.length > 0 ? '主要功能：' + description.substring(0, 50) + '...' : ''}`,
      '毕设': `本毕业设计基于${title}展开研究，实现了完整的系统架构。${description.length > 0 ? '研究重点：' + description.substring(0, 50) + '...' : '创新性强，具有较高的学术价值。'}`,
      '竞赛作品': `本竞赛作品围绕${title}主题，创新性地解决了实际应用中的关键问题。${description.length > 0 ? '核心创新：' + description.substring(0, 50) + '...' : ''}`
    };
    
    return templates[type] || `本${type}围绕${title}展开，提供了完整的解决方案和实现细节。`;
  };

  const generateTechStack = (asset) => {
    const type = asset.type;
    const content = (asset.content || '').toLowerCase();
    const description = (asset.description || '').toLowerCase();
    
    const allTechs = {
      '笔记': ['Markdown', 'LaTeX', '思维导图', '知识图谱'],
      '实验报告': ['Python', 'Matlab', '数据分析', '可视化', 'SPSS', 'R语言'],
      '课程设计': ['React', 'Vue', 'Node.js', 'MySQL', 'RESTful API', 'Express'],
      '毕设': ['Spring Boot', 'Vue3', 'Redis', 'Docker', '微服务架构', 'MongoDB'],
      '竞赛作品': ['机器学习', '深度学习', 'TensorFlow', 'PyTorch', '算法优化']
    };
    
    const detectedTechs = [];
    const techKeywords = {
      'Python': ['python', 'numpy', 'pandas', 'jupyter'],
      'JavaScript': ['javascript', 'js', 'react', 'vue'],
      'Java': ['java', 'spring', 'maven'],
      'SQL': ['sql', 'mysql', 'database'],
      '机器学习': ['machine learning', 'ml', '神经网络'],
      '深度学习': ['deep learning', 'tensorflow', 'pytorch'],
      '数据分析': ['数据分析', 'data analysis', '统计'],
      '可视化': ['可视化', 'visualization', 'chart']
    };
    
    Object.entries(techKeywords).forEach(([tech, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword) || description.includes(keyword))) {
        detectedTechs.push(tech);
      }
    });
    
    const baseTechs = allTechs[type] || ['JavaScript', 'HTML/CSS'];
    const combinedTechs = [...new Set([...detectedTechs, ...baseTechs])].slice(0, 6);
    
    return combinedTechs;
  };

  const generateHighlights = (asset) => {
    const type = asset.type;
    const contentLength = (asset.content || '').length;
    const hasCode = (asset.content || '').includes('function') || (asset.content || '').includes('def ') || (asset.content || '').includes('class ');
    
    const baseHighlights = {
      '笔记': [
        '结构清晰，重点突出，便于快速复习',
        '包含大量实例和习题，理论与实践结合'
      ],
      '实验报告': [
        '实验设计严谨，数据记录完整',
        '分析深入，结论具有参考价值'
      ],
      '课程设计': [
        '代码规范，注释详细，易于理解',
        '功能完善，用户体验良好'
      ],
      '毕设': [
        '架构设计合理，可扩展性强',
        '创新点突出，实用价值高'
      ],
      '竞赛作品': [
        '算法创新，性能优化显著',
        '解决方案新颖，具有实际应用前景'
      ]
    };
    
    const dynamicHighlights = [];
    if (contentLength > 2000) {
      dynamicHighlights.push('内容详实，信息量丰富');
    }
    if (hasCode) {
      dynamicHighlights.push('包含代码示例，可直接参考');
    }
    if (asset.citations > 0) {
      dynamicHighlights.push(`已被引用 ${asset.citations} 次，影响力较高`);
    }
    if (asset.score > 10) {
      dynamicHighlights.push('获得较多点赞，质量得到认可');
    }
    
    const highlights = [...baseHighlights[type] || ['内容完整，逻辑清晰', '实用性强，值得参考'], ...dynamicHighlights];
    return highlights.slice(0, 4);
  };

  const extractKeywords = (asset) => {
    const text = (asset.title + ' ' + asset.description + ' ' + asset.content).toLowerCase();
    const keywordPatterns = [
      { name: 'Python', keywords: ['python', 'numpy', 'pandas'] },
      { name: '机器学习', keywords: ['机器学习', 'machine learning', '神经网络'] },
      { name: '深度学习', keywords: ['深度学习', 'deep learning', 'tensorflow', 'pytorch'] },
      { name: '数据结构', keywords: ['数据结构', 'algorithm', '算法'] },
      { name: '数据库', keywords: ['数据库', 'mysql', 'sql', 'mongodb'] },
      { name: '前端开发', keywords: ['react', 'vue', 'javascript', '前端'] },
      { name: '后端开发', keywords: ['node.js', 'spring', 'java', '后端'] },
      { name: '数据分析', keywords: ['数据分析', 'data analysis', '统计分析'] },
      { name: '计算机网络', keywords: ['网络', 'tcp/ip', 'http', 'socket'] },
      { name: '操作系统', keywords: ['操作系统', 'os', '进程', '线程'] }
    ];
    
    const foundKeywords = keywordPatterns.filter(kp => 
      kp.keywords.some(keyword => text.includes(keyword))
    ).map(kp => kp.name);
    
    return foundKeywords.length > 0 ? foundKeywords : ['编程', '技术', '学习'];
  };

  const generateLearningSuggestions = (asset) => {
    const type = asset.type;
    
    const suggestions = {
      '笔记': [
        '建议搭配思维导图进行知识点梳理',
        '结合习题练习加深理解',
        '定期复习巩固记忆',
        '尝试用自己的话复述内容'
      ],
      '实验报告': [
        '对比其他实验方法，拓展思路',
        '尝试复现实验，加深理解',
        '分析实验误差来源',
        '阅读相关论文，了解最新研究'
      ],
      '课程设计': [
        '尝试优化现有代码结构',
        '添加新功能，拓展项目',
        '学习相关技术栈的最佳实践',
        '参与开源项目，积累经验'
      ],
      '毕设': [
        '深入研究相关领域的前沿技术',
        '考虑论文发表的可能性',
        '完善文档，便于后续维护',
        '准备答辩材料，展示成果'
      ],
      '竞赛作品': [
        '分析竞品方案，寻找改进空间',
        '优化算法，提升性能',
        '准备演示视频和文档',
        '总结经验，分享给他人'
      ]
    };
    
    return suggestions[type] || [
      '建议与同学讨论交流',
      '查阅相关参考资料',
      '实践应用所学知识',
      '记录学习心得和体会'
    ];
  };

  const findRelatedResources = (asset) => {
    const allAssets = getAssets();
    const related = allAssets.filter(a => 
      a.id !== asset.id && 
      (a.course === asset.course || 
       a.type === asset.type ||
       (asset.title && a.title && a.title.includes(asset.title.split(' ')[0])))
    ).slice(0, 3);
    
    return related;
  };

  const calculateQualityScore = (asset) => {
    let score = 50;
    
    if (asset.title && asset.title.length > 5) score += 10;
    if (asset.description && asset.description.length > 20) score += 10;
    if (asset.content && asset.content.length > 500) score += 15;
    if (asset.type === '毕设') score += 10;
    if (asset.score > 5) score += 10;
    if (asset.citations > 0) score += 10;
    
    return Math.min(score, 95);
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || !summary) return;
    
    setIsAnswering(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const answers = [
        `根据这份${asset.type}资料，${question}的相关内容如下：\n\n${summary.coreFunction}\n\n如需更详细的信息，建议阅读完整内容。`,
        `关于"${question}"这个问题，结合这份资料的核心要点：\n\n${summary.highlights.slice(0, 2).join('\n')}\n\n这应该能帮到你！`,
        `针对你的问题"${question}"，我的分析如下：\n\n${summary.techStack.join('、')}等技术可能与你的问题相关。${summary.learningSuggestions[0]}`,
        `从这份${asset.type}来看，${question}的答案可以从以下几个方面考虑：\n\n${summary.highlights.join('\n')}\n\n希望对你有帮助！`
      ];
      
      setAnswer(answers[Math.floor(Math.random() * answers.length)]);
    } catch (error) {
      console.error('AI问答失败:', error);
    } finally {
      setIsAnswering(false);
    }
  };

  if (isGenerating) {
    return (
      <div className={`mb-6 p-6 rounded-xl border-2 border-dashed ${theme === 'dark' 
        ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/50' 
        : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300'}`}>
        <div className="flex items-center justify-center space-x-3">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          <div>
            <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              🧠 AI 学术助手正在分析...
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              正在深度分析资料内容，请稍候...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: '概览', icon: Brain },
    { id: 'learning', name: '学习建议', icon: Lightbulb },
    { id: 'resources', name: '相关资源', icon: BookOpen },
    { id: 'qa', name: '智能问答', icon: MessageCircle }
  ];

  return (
    <div className={`mb-6 rounded-xl border-2 overflow-hidden ${theme === 'dark' 
      ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/50 shadow-lg shadow-purple-500/20' 
      : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300 shadow-lg'}`}>
      <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            🤖 AI 学术助手
          </h3>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.ceil(summary.qualityScore / 20) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
              />
            ))}
            <span className={`text-xs font-medium ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {summary.qualityScore}分
            </span>
          </div>
        </div>
        <button
          onClick={generateSummary}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            theme === 'dark' 
              ? 'bg-purple-900/50 text-purple-300 hover:bg-purple-900/70' 
              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          }`}
        >
          <RefreshCw className="w-4 h-4" />
          <span>重新分析</span>
        </button>
      </div>

      <div className="flex border-b border-purple-500/20">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? theme === 'dark' ? 'text-purple-400' : 'text-purple-700'
                  : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className={`flex items-start space-x-3 p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-100'}`}>
                <Zap className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-purple-600'}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-purple-300' : 'text-purple-700'}`}>
                  核心功能
                </h4>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  {summary.coreFunction}
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <BarChart3 className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  技术栈分析
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-transform hover:scale-105 ${
                      theme === 'dark' 
                        ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' 
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}
                  >
                    🛠 {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <Target className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                  核心关键词
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      theme === 'dark' 
                        ? 'bg-green-900/50 text-green-300' 
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    🔑 {keyword}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
              <div className="flex items-center space-x-2 mb-3">
                <Star className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h4 className={`font-semibold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                  内容亮点
                </h4>
              </div>
              <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {summary.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className={`text-lg ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-green-500' : index === 2 ? 'text-blue-500' : 'text-purple-500'}`}>
                      ✨
                    </span>
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'learning' && (
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className={`w-5 h-5 text-yellow-500`} />
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                个性化学习建议
              </h4>
            </div>
            <div className="space-y-3">
              {summary.learningSuggestions.map((suggestion, index) => (
                <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                  <span className="text-lg flex-shrink-0">💡</span>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                相关学习资源
              </h4>
            </div>
            {summary.relatedResources.length > 0 ? (
              <div className="space-y-3">
                {summary.relatedResources.map((resource, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'} hover:bg-opacity-70 transition-colors cursor-pointer`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-100'}`}>
                      <BookOpen className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-purple-600'}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {resource.title}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {resource.type} · {resource.course}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无相关资源推荐</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'qa' && (
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-white/5' : 'bg-white/80'}`}>
            <div className="flex items-center space-x-2 mb-4">
              <MessageCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <h4 className={`font-semibold ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                智能问答
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="输入你想问的问题，AI助手会基于这份资料为你解答..."
                  className={`flex-1 px-4 py-3 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                />
                <button
                  onClick={handleAskQuestion}
                  disabled={!question.trim() || isAnswering}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    question.trim() && !isAnswering
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isAnswering ? <Loader2 className="w-5 h-5 animate-spin" /> : '提问'}
                </button>
              </div>
              
              {answer && (
                <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-green-900/30 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">🤖</span>
                    <div>
                      <p className={`font-medium text-sm mb-1 ${theme === 'dark' ? 'text-green-300' : 'text-green-700'}`}>
                        AI助手回答
                      </p>
                      <p className={`text-sm whitespace-pre-line ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {answer}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  💡 提示：你可以询问关于这份资料的任何问题，比如"这份笔记的重点是什么？"、"如何学习这门技术？"等
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`px-4 pb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
        <p className="text-xs text-center">
          🤖 由 AI 学术助手自动分析生成于 {new Date(summary.generatedAt).toLocaleString('zh-CN')}
        </p>
      </div>
    </div>
  );
};