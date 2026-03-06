import { useState, useEffect } from 'react';
import { KPI } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

export function useKPIs() {
  const [kpis, setKPIs] = useState<KPI[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvos = getStorageItem<KPI[]>('kpis', []);
    setKPIs(salvos);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      setStorageItem('kpis', kpis);
    }
  }, [kpis, carregando]);

  const adicionarKPI = (novoKPI: KPI) => {
    setKPIs(prev => [...prev, novoKPI]);
  };

  const atualizarKPI = (id: string, novoValor: number) => {
    setKPIs(prev => prev.map(k => k.id === id ? { ...k, valorAtual: novoValor } : k));
  };

  const removerKPI = (id: string) => {
    setKPIs(prev => prev.filter(k => k.id !== id));
  };

  return { kpis, setKPIs, carregando, adicionarKPI, atualizarKPI, removerKPI };
}
