import { useState, useEffect } from 'react';
import { Habito } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';
import { getDataStringBrasil, isDataFutura } from '../utils/dataUtils';

export function useHabitos() {
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvos = getStorageItem<Habito[]>('habitos', []);
    setHabitos(salvos);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      setStorageItem('habitos', habitos);
    }
  }, [habitos, carregando]);

  const adicionarHabito = (novoHabito: Habito) => {
    setHabitos(prev => [...prev, novoHabito]);
  };

  const atualizarHabito = (id: string, updates: Partial<Habito>) => {
    setHabitos(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const removerHabito = (id: string) => {
    setHabitos(prev => prev.filter(h => h.id !== id));
  };

  const toggleConclusao = (id: string, data: string) => {
    if (isDataFutura(data)) {
      alert('Data inválida: não é possível concluir itens de datas futuras');
      return;
    }

    setHabitos(prev => prev.map(h => {
      if (h.id === id) {
        const conclusoes = [...h.conclusoes];
        const index = conclusoes.findIndex(c => c.data === data);
        if (index >= 0) {
          conclusoes[index].concluido = !conclusoes[index].concluido;
        } else {
          conclusoes.push({ data, concluido: true });
        }
        return { ...h, conclusoes };
      }
      return h;
    }));
  };

  const calcularProgressoHabitos = (data: string): number => {
    const habitosDoDia = habitos.filter(h => {
      const diaSemana = new Date(data).getDay();
      return h.diasSemana.includes(diaSemana);
    });
    
    if (habitosDoDia.length === 0) return 0;
    
    const concluidos = habitosDoDia.filter(h => {
      const conclusao = h.conclusoes.find(c => c.data === data);
      return conclusao?.concluido;
    });
    
    return (concluidos.length / habitosDoDia.length) * 100;
  };

  return { habitos, setHabitos, carregando, adicionarHabito, atualizarHabito, removerHabito, toggleConclusao, calcularProgressoHabitos };
}
