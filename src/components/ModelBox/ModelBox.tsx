'use client';
import { getModels } from '@/apis';
import { useEffect, useState } from 'react';
export const ModelBox = () => {
  const [list, setList] = useState<Array<string>>([]);
  const fetchModels = async (): Promise<void> => {
    try {
      const res = await getModels();
      const ids = res.map((item) => item.id);
      setList(ids);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };
  useEffect(() => {
    fetchModels();
  }, []);
  return (
    <div>
      {list.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
};
