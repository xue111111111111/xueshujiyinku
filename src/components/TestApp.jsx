import { useState } from 'react';

export default function TestApp() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">测试页面</h1>
        <p className="text-gray-600 mb-4">如果能看到这个页面，说明 React 应用正常运行</p>
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          点击次数: {count}
        </button>
      </div>
    </div>
  );
}