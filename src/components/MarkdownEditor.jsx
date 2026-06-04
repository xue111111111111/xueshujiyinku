import { useState, useEffect, useCallback } from 'react';
import { 
  Save, 
  Eye, 
  EyeOff, 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Link, 
  Image, 
  Table, 
  Heading1, 
  Heading2, 
  Heading3,
  Undo,
  Redo,
  Maximize2,
  Minimize2,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getAssets, updateAsset, addAsset, generateId } from '../utils/storage';

export default function MarkdownEditor({ asset, onClose }) {
  const { currentUser, theme } = useApp();
  const [content, setContent] = useState(asset?.versions?.[asset.versions.length - 1]?.content || '');
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [versionNote, setVersionNote] = useState('');
  const [isNewAsset, setIsNewAsset] = useState(!asset);
  const [assetTitle, setAssetTitle] = useState(asset?.title || '');

  useEffect(() => {
    if (asset) {
      const lock = localStorage.getItem(`lock_${asset.id}`);
      if (lock && lock !== currentUser.id) {
        setIsLocked(true);
      }
    }
  }, [asset, currentUser.id]);

  const autoSave = useCallback(() => {
    if (content && asset) {
      setIsSaving(true);
      const assets = getAssets();
      const index = assets.findIndex(a => a.id === asset.id);
      if (index !== -1) {
        const updatedAsset = { ...assets[index] };
        updatedAsset.versions[updatedAsset.versions.length - 1].content = content;
        assets[index] = updatedAsset;
        localStorage.setItem('assets', JSON.stringify(assets));
        setLastSaved(new Date());
      }
      setIsSaving(false);
    }
  }, [content, asset]);

  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const handleLock = () => {
    if (asset && !isLocked) {
      localStorage.setItem(`lock_${asset.id}`, currentUser.id);
      setIsLocked(false);
    } else if (asset && isLocked) {
      localStorage.removeItem(`lock_${asset.id}`);
      setIsLocked(false);
    }
  };

  const handleSave = () => {
    if (!versionNote.trim()) {
      alert('请填写版本说明');
      return;
    }

    if (isNewAsset) {
      const newAsset = {
        id: generateId('asset'),
        title: assetTitle || '未命名文档',
        type: '笔记',
        course: '',
        teacher: '',
        grade: currentUser.grade || '',
        semester: '',
        description: content,
        tags: [],
        score: 0,
        uploader: currentUser.id,
        school: currentUser.school,
        downloads: 0,
        citations: 0,
        likes: 0,
        isCase: false,
        createdAt: new Date().toISOString().split('T')[0],
        references: [],
        versions: [{
          id: `v${Date.now()}`,
          versionNumber: 'v1.0',
          author: currentUser.id,
          submittedAt: new Date().toLocaleString(),
          description: versionNote,
          content: content
        }]
      };
      addAsset(newAsset);
      alert('文档创建成功！');
      onClose && onClose();
    } else {
      const assets = getAssets();
      const index = assets.findIndex(a => a.id === asset.id);
      if (index !== -1) {
        const updatedAsset = { ...assets[index] };
        const currentVersion = updatedAsset.versions[updatedAsset.versions.length - 1];
        const versionNum = parseFloat(currentVersion.versionNumber.slice(1));
        const newVersionNum = `v${(versionNum + 0.1).toFixed(1)}`;
        
        updatedAsset.versions.push({
          id: `v${Date.now()}`,
          versionNumber: newVersionNum,
          author: currentUser.id,
          submittedAt: new Date().toLocaleString(),
          description: versionNote,
          content: content
        });
        updatedAsset.description = content;
        assets[index] = updatedAsset;
        localStorage.setItem('assets', JSON.stringify(assets));
        setLastSaved(new Date());
        alert('文档已保存为新版本！');
      }
    }
    setVersionNote('');
  };

  const handleExport = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assetTitle || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.querySelector('.markdown-textarea');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + prefix + selectedText + suffix + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mb-2 mt-4">' + '$1' + '</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mb-3 mt-5">' + '$1' + '</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mb-4 mt-6">' + '$1' + '</h1>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">' + '$1' + '</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em class="italic">' + '$1' + '</em>');
    html = html.replace(/~~(.+?)~~/g, '<s>' + '$1' + '</s>');

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre class="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`;
    });
    html = html.replace(/`(.+?)`/g, '<code class="bg-gray-700 px-2 py-1 rounded text-sm">' + '$1' + '</code>');

    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="list-decimal ml-6 mb-1">' + '$2' + '</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="list-disc ml-6 mb-1">' + '$1' + '</li>');
    html = html.replace(/^(\*|\+) (.+)$/gm, '<li class="list-disc ml-6 mb-1">' + '$2' + '</li>');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="' + '$2' + '" target="_blank" class="text-blue-500 hover:underline">' + '$1' + '</a>');

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="' + '$2' + '" alt="' + '$1' + '" class="max-w-full rounded-lg my-4" />');

    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    html = '<p class="mb-3">' + html + '</p>';

    html = html.replace(/<li>(.+?)<\/li>(?=\s*<li>)/g, (match) => match);
    html = html.replace(/(<li>.+?<\/li>)+/g, '<ul class="mb-4">' + '$&' + '</ul>');

    return html;
  };

  const toolbarButtons = [
    { icon: <Heading1 className="w-4 h-4" />, action: () => insertMarkdown('# '), title: '标题1' },
    { icon: <Heading2 className="w-4 h-4" />, action: () => insertMarkdown('## '), title: '标题2' },
    { icon: <Heading3 className="w-4 h-4" />, action: () => insertMarkdown('### '), title: '标题3' },
    { type: 'divider' },
    { icon: <Bold className="w-4 h-4" />, action: () => insertMarkdown('**', '**'), title: '粗体' },
    { icon: <Italic className="w-4 h-4" />, action: () => insertMarkdown('*', '*'), title: '斜体' },
    { type: 'divider' },
    { icon: <List className="w-4 h-4" />, action: () => insertMarkdown('- '), title: '无序列表' },
    { icon: <ListOrdered className="w-4 h-4" />, action: () => insertMarkdown('1. '), title: '有序列表' },
    { type: 'divider' },
    { icon: <Code className="w-4 h-4" />, action: () => insertMarkdown('```\n', '\n```'), title: '代码块' },
    { icon: <Table className="w-4 h-4" />, action: () => insertMarkdown('| 表头 | 表头 |\n| --- | --- |\n| 内容 | 内容 |\n'), title: '表格' },
    { type: 'divider' },
    { icon: <Link className="w-4 h-4" />, action: () => insertMarkdown('[', '](url)'), title: '链接' },
    { icon: <Image className="w-4 h-4" />, action: () => insertMarkdown('![alt](', ')'), title: '图片' },
    { type: 'divider' },
    { icon: <Undo className="w-4 h-4" />, action: () => document.querySelector('.markdown-textarea')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true })), title: '撤销' },
    { icon: <Redo className="w-4 h-4" />, action: () => document.querySelector('.markdown-textarea')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: true })), title: '重做' },
  ];

  if (isLocked) {
    return (
      <div className={`flex flex-col h-[600px] rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-yellow-500" />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>文档已被锁定</h3>
          </div>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            关闭
          </button>
        </div>
        <div className={`flex-1 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="text-center">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-yellow-500' : 'text-yellow-600'}`} />
            <p className={`text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>该文档正在被其他用户编辑</p>
            <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>请稍后再试，或联系文档所有者</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''} rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((btn, index) => (
            btn.type === 'divider' ? (
              <div key={index} className={`w-px h-6 mx-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`} />
            ) : (
              <button
                key={index}
                onClick={btn.action}
                title={btn.title}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'} transition-colors`}
              >
                {btn.icon}
              </button>
            )
          ))}
        </div>
        
        <div className="flex items-center space-x-3">
          {isNewAsset && (
            <input
              type="text"
              value={assetTitle}
              onChange={(e) => setAssetTitle(e.target.value)}
              placeholder="文档标题..."
              className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white border border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          )}
          
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${showPreview 
              ? 'bg-primary-500 text-white' 
              : theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span>预览</span>
          </button>
          
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleLock}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm ${isLocked 
              ? 'bg-green-500 text-white' 
              : theme === 'dark' 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isLocked ? '已解锁' : '锁定'}</span>
          </button>
          
          <button
            onClick={handleExport}
            className={`px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            导出MD
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isNewAsset ? '创建文档' : '发布新版本'}</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className={`flex-1 flex ${isFullscreen ? 'h-[calc(100vh-56px)]' : 'h-[500px]'}`}>
        {/* Edit Pane */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'} text-sm`}>
            Markdown
          </div>
          <textarea
            className={`flex-1 p-4 resize-none markdown-textarea ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} focus:outline-none font-mono text-sm`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始编写Markdown文档..."
          />
        </div>

        {/* Preview Pane */}
        {showPreview && (
          <div className={`w-1/2 border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex flex-col`}>
            <div className={`px-4 py-2 border-b ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'} text-sm flex items-center justify-between`}>
              <span>预览</span>
              <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {isSaving ? '保存中...' : `上次保存: ${lastSaved.toLocaleTimeString()}`}
              </span>
            </div>
            <div 
              className={`flex-1 p-4 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-800'}`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>

      {/* Version Note */}
      {!isNewAsset && (
        <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center space-x-3">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>版本说明：</span>
            <input
              type="text"
              value={versionNote}
              onChange={(e) => setVersionNote(e.target.value)}
              placeholder="描述本次修改的内容..."
              className={`flex-1 px-3 py-1.5 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white border border-gray-200'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
              maxLength={100}
            />
            <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
              {versionNote.length}/100
            </span>
          </div>
        </div>
      )}
    </div>
  );
}