import { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { useApp } from '../context/AppContext';
import { getAssets, getUsers, getMergeRequests } from '../utils/storage';

export const KnowledgeGraph = ({ assetId }) => {
  const { theme } = useApp();
  const chartRef = useRef(null);

  const buildTreeData = () => {
    const assets = getAssets();
    const users = getUsers();
    const mergeRequests = getMergeRequests();
    
    const rootAsset = assets.find(a => a.id === assetId);
    if (!rootAsset) return null;

    const rootUser = users.find(u => u.id === rootAsset.uploader);
    
    const buildNode = (asset) => {
      const user = users.find(u => u.id === asset.uploader);
      const acceptedMRs = mergeRequests.filter(mr => 
        mr.targetAssetId === asset.id && mr.status === 'accepted'
      );

      const children = acceptedMRs.map(mr => {
        const sourceAsset = assets.find(a => a.id === mr.sourceAssetId);
        if (sourceAsset) {
          return buildNode(sourceAsset);
        }
        return null;
      }).filter(Boolean);

      return {
        name: asset.title,
        value: asset.id,
        symbol: 'circle',
        symbolSize: 60,
        itemStyle: {
          color: theme === 'dark' ? '#3B82F6' : '#60A5FA',
          borderColor: theme === 'dark' ? '#1E40AF' : '#2563EB',
          borderWidth: 3,
          shadowColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(96, 165, 250, 0.5)',
          shadowBlur: 10
        },
        label: {
          show: true,
          position: 'bottom',
          fontSize: 14,
          fontWeight: 'bold',
          color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
          formatter: (params) => {
            return params.name.length > 15 ? params.name.substring(0, 15) + '...' : params.name;
          }
        },
        children: children.length > 0 ? children : undefined,
        data: {
          uploader: user?.name || '未知用户',
          avatar: user?.avatar || '',
          description: asset.description || '暂无描述',
          createdAt: asset.createdAt,
          version: asset.versions?.length || 1
        }
      };
    };

    return buildNode(rootAsset);
  };

  const getOption = () => {
    const treeData = buildTreeData();
    
    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: (params) => {
          const data = params.data;
          return `
            <div style="padding: 10px; min-width: 200px;">
              <div style="font-weight: bold; margin-bottom: 5px; color: ${theme === 'dark' ? '#fff' : '#000'};">
                ${data.name}
              </div>
              <div style="color: ${theme === 'dark' ? '#ccc' : '#666'}; font-size: 12px;">
                <div>👤 作者: ${data.data.uploader}</div>
                <div>📅 时间: ${data.data.createdAt}</div>
                <div>📊 版本: v${data.data.version}.0</div>
                <div style="margin-top: 5px; color: ${theme === 'dark' ? '#aaa' : '#888'};">
                  ${data.data.description.length > 50 ? data.data.description.substring(0, 50) + '...' : data.data.description}
                </div>
              </div>
            </div>
          `;
        },
        backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
        borderColor: theme === 'dark' ? '#374151' : '#E5E7EB',
        borderWidth: 1,
        textStyle: {
          color: theme === 'dark' ? '#FFFFFF' : '#1F2937'
        }
      },
      series: [
        {
          type: 'tree',
          data: treeData ? [treeData] : [],
          top: '5%',
          left: '10%',
          bottom: '5%',
          right: '20%',
          symbolSize: 60,
          symbol: 'circle',
          edgeShape: 'curve',
          edgeForkPosition: '63%',
          initialTreeDepth: 3,
          lineStyle: {
            color: theme === 'dark' ? '#4B5563' : '#9CA3AF',
            width: 2,
            curveness: 0.5
          },
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 14
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          emphasis: {
            focus: 'descendant'
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750
        }
      ]
    };
  };

  const onChartReady = (echartsInstance) => {
    chartRef.current = echartsInstance;
    
    echartsInstance.on('click', (params) => {
      if (params.dataType === 'node' && params.data.value) {
        const assetId = params.data.value;
        console.log('点击节点，跳转到项目详情:', assetId);
      }
    });
  };

  const onEvents = {
    click: (params) => {
      if (params.dataType === 'node' && params.data.value) {
        const assetId = params.data.value;
        console.log('点击节点，跳转到项目详情:', assetId);
      }
    }
  };

  if (!buildTreeData()) {
    return (
      <div className={`flex items-center justify-center h-96 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        <div className="text-center">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p>暂无知识谱系数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            知识谱系图
          </h3>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            可视化展示项目的演化过程和传承关系
          </p>
        </div>
        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          💡 提示：可拖拽平移、滚轮缩放、点击节点查看详情
        </div>
      </div>
      <div className={`rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <ReactECharts
          option={getOption()}
          style={{ height: '550px', width: '100%' }}
          onChartReady={onChartReady}
          onEvents={onEvents}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
};