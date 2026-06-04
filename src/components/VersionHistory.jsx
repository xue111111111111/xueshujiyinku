import { useState } from 'react';
import { Download, RotateCcw, GitCompare, Trash2, Check } from 'lucide-react';

export default function VersionHistory({ asset, users, onDownload, onRollback, onDelete, currentUser }) {
  const [selectedVersions, setSelectedVersions] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleVersionSelect = (versionId) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const compareVersions = () => {
    if (selectedVersions.length === 2) {
      setShowCompare(true);
    }
  };

  const getVersionContent = (versionId) => {
    const version = asset.versions.find(v => v.id === versionId);
    return version?.content || '';
  };

  const highlightDiff = (oldContent, newContent) => {
    const oldLines = oldContent.split('\n');
    const newLines = newContent.split('\n');
    const maxLength = Math.max(oldLines.length, newLines.length);
    
    return {
      old: oldLines.map((line, index) => {
        const newLine = newLines[index];
        if (!newLine) return { content: line, type: 'deleted' };
        if (line !== newLine) return { content: line, type: 'modified-old' };
        return { content: line, type: 'same' };
      }),
      new: newLines.map((line, index) => {
        const oldLine = oldLines[index];
        if (!oldLine) return { content: line, type: 'added' };
        if (line !== oldLine) return { content: line, type: 'modified-new' };
        return { content: line, type: 'same' };
      })
    };
  };

  const selectedVersionContents = selectedVersions.map(id => getVersionContent(id));

  return (
    <div className="space-y-4">
      {showCompare && selectedVersionContents.length === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">版本对比</h3>
            <button
              onClick={() => {
                setShowCompare(false);
                setSelectedVersions([]);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              关闭
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  {asset.versions.find(v => v.id === selectedVersions[0])?.versionNumber}
                </span>
              </div>
              <div className="p-4 max-h-96 overflow-auto font-mono text-sm">
                {highlightDiff(selectedVersionContents[0], selectedVersionContents[1]).old.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.type === 'deleted' ? 'bg-red-100 text-red-700' :
                      line.type === 'modified-old' ? 'bg-yellow-100' :
                      'text-gray-800'
                    } px-2 py-0.5`}
                  >
                    {line.type === 'deleted' && <span className="text-red-500 mr-2">-</span>}
                    {line.type === 'modified-old' && <span className="text-yellow-500 mr-2">~</span>}
                    {line.type === 'same' && <span className="text-gray-400 mr-2"> </span>}
                    {line.content}
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-600">
                  {asset.versions.find(v => v.id === selectedVersions[1])?.versionNumber}
                </span>
              </div>
              <div className="p-4 max-h-96 overflow-auto font-mono text-sm">
                {highlightDiff(selectedVersionContents[0], selectedVersionContents[1]).new.map((line, index) => (
                  <div
                    key={index}
                    className={`${
                      line.type === 'added' ? 'bg-green-100 text-green-700' :
                      line.type === 'modified-new' ? 'bg-yellow-100' :
                      'text-gray-800'
                    } px-2 py-0.5`}
                  >
                    {line.type === 'added' && <span className="text-green-500 mr-2">+</span>}
                    {line.type === 'modified-new' && <span className="text-yellow-500 mr-2">~</span>}
                    {line.type === 'same' && <span className="text-gray-400 mr-2"> </span>}
                    {line.content}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showCompare && (
        <>
          {selectedVersions.length === 2 && (
            <button
              onClick={compareVersions}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mb-4"
            >
              <GitCompare className="w-4 h-4" />
              对比差异
            </button>
          )}

          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-4">
              {asset.versions?.slice().reverse().map((version, index) => {
                const isOriginalAuthor = currentUser?.id === asset.uploader;
                const isVersionAuthor = currentUser?.id === version.author;
                const canDelete = isOriginalAuthor || isVersionAuthor;
                const isLatest = index === 0;
                
                return (
                  <div
                    key={version.id}
                    className={`relative flex items-start gap-4 p-4 rounded-lg ${
                      selectedVersions.includes(version.id) 
                        ? 'bg-primary-50 border border-primary-200' 
                        : 'bg-white border border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`absolute left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isLatest 
                        ? 'bg-green-500 border-green-500' 
                        : selectedVersions.includes(version.id)
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-white border-gray-300'
                    }`}>
                      {isLatest && <Check className="w-3 h-3 text-white" />}
                      {selectedVersions.includes(version.id) && !isLatest && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>

                    <div className="flex-1 ml-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800">{version.versionNumber}</span>
                        {isLatest && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">最新</span>
                        )}
                        <span className="text-sm text-gray-400">
                          {users.find(u => u.id === version.author)?.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                      <p className="text-xs text-gray-400">{version.submittedAt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleVersionSelect(version.id)}
                        disabled={selectedVersions.length >= 2 && !selectedVersions.includes(version.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedVersions.includes(version.id)
                            ? 'bg-primary-100 text-primary-600'
                            : 'hover:bg-gray-100 text-gray-500'
                        } ${selectedVersions.length >= 2 && !selectedVersions.includes(version.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="选择用于对比"
                      >
                        <GitCompare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownload && onDownload(version)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                        title="下载此版本"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {!isLatest && (
                        <button
                          onClick={() => onRollback && onRollback(version)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                          title="回滚到此版本"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      )}
                      {canDelete && !isLatest && (
                        <button
                          onClick={() => onDelete && onDelete(version)}
                          className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors"
                          title="删除此版本"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}