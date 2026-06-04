import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Send, Bot, User, X, Search, FileText, BookOpen, HelpCircle } from 'lucide-react';

// 模拟AI回复数据
const aiResponses = {
  greeting: [
    '你好！我是学术助手，有什么可以帮你的吗？',
    '您好！很高兴为您服务。请问有什么学术问题需要帮助？',
    '嗨！我可以帮您搜索资料、解答问题，请问需要什么帮助？'
  ],
  paper_search: [
    '好的，我来帮您搜索相关论文...',
    '正在为您查找相关学术资料...',
    '已为您找到以下相关论文：'
  ],
  question: [
    '让我分析一下您的问题...',
    '这个问题很有意思，让我来解答...',
    '根据我的知识库，以下是相关信息：'
  ],
  default: [
    '感谢您的提问！以下是相关信息...',
    '根据我的分析，您的问题可以这样解答：',
    '好的，我来为您详细解答。'
  ]
};

const samplePapers = [
  { title: '基于深度学习的学术论文推荐系统研究', authors: '张三, 李四', journal: '计算机学报', year: '2024' },
  { title: '校园学术基因库的构建与应用', authors: '王五, 赵六', journal: '教育技术研究', year: '2023' },
  { title: '跨期接力学习模式的效果评估', authors: '孙七', journal: '高等教育研究', year: '2024' }
];

const knowledgeBase = {
  '论文写作': '论文写作需要注意：1）明确研究问题；2）文献综述要全面；3）方法论要严谨；4）数据分析要准确；5）结论要有针对性。建议使用EndNote或Zotero管理参考文献。',
  '如何接力': '接力项目流程：1）浏览接力项目列表；2）选择感兴趣的项目；3）提交接力申请；4）等待老师审批；5）开始接力研究；6）提交成果。',
  '积分规则': '上传资料+10分，被引用+5分，完成接力+30分，指导接力+15分，资料被下载+2分，获得点赞+1分。',
  '学习产出': '学习产出包括：课程笔记、实验报告、课程设计、毕业设计、竞赛作品等类型。',
  '学术诚信': '请遵守学术诚信原则，严禁抄袭。引用他人成果请注明出处，参考文献格式要规范。'
};

export const AIAssistant = () => {
  const { theme } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getRandomResponse = (type) => {
    const responses = aiResponses[type] || aiResponses.default;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getKnowledgeAnswer = (question) => {
    for (const [key, answer] of Object.entries(knowledgeBase)) {
      if (question.includes(key)) {
        return answer;
      }
    }
    return null;
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiContent = getRandomResponse('default');
    
    const knowledgeAnswer = getKnowledgeAnswer(inputValue);
    if (knowledgeAnswer) {
      aiContent = knowledgeAnswer;
    } else if (inputValue.includes('论文') || inputValue.includes('文献') || inputValue.includes('搜索')) {
      aiContent = `${getRandomResponse('paper_search')}\n\n**相关论文推荐：**\n`;
      samplePapers.forEach(paper => {
        aiContent += `\n📄 ${paper.title}\n   作者：${paper.authors}\n   期刊：${paper.journal} · ${paper.year}`;
      });
    } else if (inputValue.includes('你好') || inputValue.includes('嗨') || inputValue.includes('您好')) {
      aiContent = getRandomResponse('greeting');
    }

    const aiMessage = {
      id: Date.now() + 1,
      type: 'ai',
      content: aiContent
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all hover:scale-110 flex items-center justify-center z-40"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col ${theme === 'dark' ? 'bg-gray-800' : ''}`}>
            {/* Header */}
            <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>学术小助手</h3>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>智能问答 · 论文搜索</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Welcome Message */}
              {messages.length === 0 && (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-4">您好！我是学术小助手</p>
                  <p className="text-sm mb-4">可以帮您搜索论文、解答学术问题</p>
                  
                  {/* Quick Questions */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium mb-2">快速提问：</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['论文写作', '如何接力', '积分规则', '学术诚信'].map(q => (
                        <button
                          key={q}
                          onClick={() => handleQuickQuestion(q)}
                          className={`px-3 py-1.5 rounded-full text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[80%]`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : theme === 'dark' 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 rounded-bl-md'
                          : 'bg-gray-100 text-gray-700 rounded-bl-md'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`flex items-start space-x-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Bot className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-bl-md`}>
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入问题或搜索论文..."
                  className={`flex-1 px-4 py-2.5 rounded-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-100 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className={`p-2.5 rounded-full transition-colors ${
                    inputValue.trim() && !isTyping
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-500'
                        : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className={`flex items-center justify-around py-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <button className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                <Search className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>论文搜索</span>
              </button>
              <button className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                <FileText className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>资料查找</span>
              </button>
              <button className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                <BookOpen className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>写作指导</span>
              </button>
              <button className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : ''}`}>
                <HelpCircle className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>帮助中心</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};