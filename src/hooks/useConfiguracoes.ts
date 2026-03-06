import { useState, useEffect } from 'react';
import { Configuracao, HorarioFixo, UserProfile } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storageUtils';

const DEFAULT_CONFIG: Configuracao = {
  timezone: 'America/Sao_Paulo',
  duracaoPomodoro: 25,
  pomodorosAntesPause: 4,
  duracaoPause: 15,
  limiteKanban: 3,
  onboardingCompleted: false,
};

export function useConfiguracoes() {
  const [config, setConfig] = useState<Configuracao>(DEFAULT_CONFIG);
  const [horariosFixos, setHorariosFixos] = useState<HorarioFixo[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const savedConfig = getStorageItem<Configuracao>('configuracoes', DEFAULT_CONFIG);
    const savedHorarios = getStorageItem<HorarioFixo[]>('horariosFixos', []);
    const savedProfile = getStorageItem<UserProfile | null>('userProfile', null);
    
    setConfig(savedConfig);
    setHorariosFixos(savedHorarios);
    setUserProfile(savedProfile);
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      setStorageItem('configuracoes', config);
      setStorageItem('horariosFixos', horariosFixos);
      setStorageItem('userProfile', userProfile);
    }
  }, [config, horariosFixos, userProfile, carregando]);

  const atualizarConfig = (updates: Partial<Configuracao>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const adicionarHorarioFixo = (horario: HorarioFixo) => {
    setHorariosFixos(prev => [...prev, horario]);
  };

  const removerHorarioFixo = (id: string) => {
    setHorariosFixos(prev => prev.filter(h => h.id !== id));
  };

  return { config, atualizarConfig, horariosFixos, adicionarHorarioFixo, removerHorarioFixo, userProfile, setUserProfile, carregando };
}
