import { useState, useEffect } from 'react';
import { Meta } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

export function useMetas() {
  const [metas, setMetas] = useState<Meta[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvos = getStorageItem<Meta[]>('metas', []);
    setMetas(salvos);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      setStorageItem('metas', metas);
    }
  }, [metas, carregando]);

  const adicionarMeta = (novaMeta: Meta) => {
    setMetas(prev => [...prev, novaMeta]);
  };

  const atualizarMeta = (id: string, updates: Partial<Meta>) => {
    setMetas(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const removerMeta = (id: string) => {
    setMetas(prev => prev.filter(m => m.id !== id));
  };

  return { metas, setMetas, carregando, adicionarMeta, atualizarMeta, removerMeta };
}
