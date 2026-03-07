import { useState, useEffect } from 'react';
import { GamificationState, BadgeInfo } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';
import { getDataStringBrasil } from '../utils/dataUtils';
import { differenceInDays } from 'date-fns';

export const BADGES_INFO: Record<string, BadgeInfo> = {
  'iniciante': { id: 'iniciante', nome: 'Iniciante', descricao: 'Primeira task concluída', icone: 'Star', cor: 'text-yellow-500' },
  '7_dias': { id: '7_dias', nome: '7 Dias Seguidos', descricao: 'Manteve 7 dias de sequência', icone: 'Flame', cor: 'text-orange-500' },
  '30_dias': { id: '30_dias', nome: '30 Dias Seguidos', descricao: 'Manteve 30 dias de sequência', icone: 'Zap', cor: 'text-accent-purple' },
  'meta_breaker': { id: 'meta_breaker', nome: 'Meta Breaker', descricao: 'Primeira meta concluída', icone: 'Target', cor: 'text-success' },
  'maratonista': { id: 'maratonista', nome: 'Maratonista', descricao: '10 tasks concluídas em um dia', icone: 'Activity', cor: 'text-accent-blue' },
  'habitado': { id: 'habitado', nome: 'Hábitado', descricao: 'Todos os hábitos do dia cumpridos', icone: 'CheckCircle', cor: 'text-emerald-400' },
};

export function useGamification() {
  const [gamification, setGamification] = useState<GamificationState>({
    totalXP: 0,
    badges: [],
    streakDias: 0,
    ultimoAcesso: getDataStringBrasil()
  });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const salvos = getStorageItem<GamificationState>('gamification', {
      totalXP: 0,
      badges: [],
      streakDias: 0,
      ultimoAcesso: getDataStringBrasil()
    });
    
    // Atualizar streak
    const hoje = getDataStringBrasil();
    if (salvos.ultimoAcesso !== hoje) {
      const diff = differenceInDays(new Date(hoje), new Date(salvos.ultimoAcesso));
      if (diff === 1) {
        // Dia consecutivo
        salvos.streakDias += 1;
      } else if (diff > 1) {
        // Quebrou o streak
        salvos.streakDias = 1;
      }
      salvos.ultimoAcesso = hoje;
    }

    setGamification(salvos);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      setStorageItem('gamification', gamification);
    }
  }, [gamification, carregando]);

  const addXP = (amount: number) => {
    setGamification(prev => ({
      ...prev,
      totalXP: prev.totalXP + amount
    }));
  };

  const unlockBadge = (badgeId: string) => {
    setGamification(prev => {
      if (!prev.badges.includes(badgeId)) {
        // You could trigger a toast notification here
        return {
          ...prev,
          badges: [...prev.badges, badgeId]
        };
      }
      return prev;
    });
  };

  // Helper to calculate level based on total XP
  // Formula: xpParaProximoNivel = nivel * 100
  // Level 1: 0-99 XP
  // Level 2: 100-299 XP (needs 200)
  // Level 3: 300-599 XP (needs 300)
  const getLevelInfo = (xp: number) => {
    let nivel = 1;
    let xpRestante = xp;
    let xpParaProximo = 100;

    while (xpRestante >= xpParaProximo) {
      xpRestante -= xpParaProximo;
      nivel++;
      xpParaProximo = nivel * 100;
    }

    return {
      nivel,
      xpAtualNoNivel: xpRestante,
      xpParaProximoNivel: xpParaProximo,
      progressoPercentual: Math.round((xpRestante / xpParaProximo) * 100)
    };
  };

  return { 
    gamification, 
    addXP, 
    unlockBadge, 
    getLevelInfo,
    carregando 
  };
}
