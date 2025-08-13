'use client';
import { getModels } from '@/apis';
import { useEffect, useState } from 'react';

export const ModelBox = () => {
  const [list, setList] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async (): Promise<void> => {
    try {
      setLoading(true);
      const res = await getModels();
      const ids = res.map((item) => item.id);
      setList(ids);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className='p-6 bg-white rounded-lg shadow-sm border border-gray-200'>
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
          <span className='ml-3 text-gray-600'>加载模型列表...</span>
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-sm border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>可用模型</h3>
      {list.length > 0 ? (
        <div className='grid gap-3'>
          {list.map((item) => (
            <div
              key={item}
              className='p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer'
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-800'>{item}</span>
                <span className='px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full'>可用</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center py-8 text-gray-500'>
          <div className='text-4xl mb-2'>📋</div>
          <p>暂无可用模型</p>
        </div>
      )}
    </div>
  );
};
