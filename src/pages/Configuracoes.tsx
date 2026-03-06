import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Save, Trash2, Plus, Settings, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { HorarioFixo, TipoHorarioFixo } from '../types';

export function Configuracoes() {
  const { userProfile, setUserProfile, horariosFixos, adicionarHorarioFixo, removerHorarioFixo, config, atualizarConfig } = useApp();
  const [profile, setProfile] = useState(userProfile || {
    nome: '',
    dataNascimento: '',
    expectativaVida: 75,
    objetivos: '',
    rotina: '',
    habitosAtuais: '',
    horariosDisponiveis: '',
    haraHachiBu: '',
    shokunin: '',
  });

  const [newHorario, setNewHorario] = useState<Partial<HorarioFixo>>({
    tipo: 'outro',
    horaInicio: '',
    descricao: '',
  });

  const [pomodoroConfig, setPomodoroConfig] = useState({
    duracaoPomodoro: config.duracaoPomodoro,
    duracaoPausaCurta: config.duracaoPausaCurta,
    duracaoPausaLonga: config.duracaoPausaLonga,
    pomodorosAntesPause: config.pomodorosAntesPause,
  });

  const handleSaveProfile = () => {
    setUserProfile(profile);
    atualizarConfig(pomodoroConfig);
    alert('Configurações salvas com sucesso!');
  };

  const handleAddHorario = () => {
    if (newHorario.horaInicio && newHorario.descricao) {
      adicionarHorarioFixo({
        id: uuidv4(),
        tipo: newHorario.tipo as TipoHorarioFixo,
        horaInicio: newHorario.horaInicio,
        horaFim: newHorario.horaFim,
        descricao: newHorario.descricao,
      });
      setNewHorario({ tipo: 'outro', horaInicio: '', descricao: '' });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-text-sec/10 rounded-xl">
          <Settings size={28} className="text-text-main" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Perfil */}
        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-8 border-b border-border-subtle pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Meu Perfil</h2>
            <button 
              onClick={handleSaveProfile}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Nome</label>
              <input 
                value={profile.nome} 
                onChange={(e) => setProfile({ ...profile, nome: e.target.value })} 
                className="input-modern"
                placeholder="Seu nome"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-sec">Data de Nascimento</label>
                <input 
                  type="date"
                  value={profile.dataNascimento || ''} 
                  onChange={(e) => setProfile({ ...profile, dataNascimento: e.target.value })} 
                  className="input-modern"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-sec">Expectativa de Vida</label>
                <input 
                  type="number"
                  value={profile.expectativaVida || 75} 
                  onChange={(e) => setProfile({ ...profile, expectativaVida: Number(e.target.value) })} 
                  className="input-modern"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Objetivos Principais</label>
              <textarea 
                value={profile.objetivos} 
                onChange={(e) => setProfile({ ...profile, objetivos: e.target.value })} 
                className="input-modern min-h-[100px] resize-y"
                placeholder="Quais são seus maiores objetivos?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-text-sec">Rotina Atual</label>
              <textarea 
                value={profile.rotina} 
                onChange={(e) => setProfile({ ...profile, rotina: e.target.value })} 
                className="input-modern min-h-[100px] resize-y"
                placeholder="Descreva sua rotina atual..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Pomodoro Settings */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8 border-b border-border-subtle pb-4 flex items-center gap-2">
              <Clock size={24} className="text-accent-purple" />
              Pomodoro
            </h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-text-sec">Foco (min)</label>
                <input 
                  type="number"
                  value={pomodoroConfig.duracaoPomodoro} 
                  onChange={(e) => setPomodoroConfig({ ...pomodoroConfig, duracaoPomodoro: Number(e.target.value) })} 
                  className="input-modern"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-sec">Pausa Curta (min)</label>
                <input 
                  type="number"
                  value={pomodoroConfig.duracaoPausaCurta} 
                  onChange={(e) => setPomodoroConfig({ ...pomodoroConfig, duracaoPausaCurta: Number(e.target.value) })} 
                  className="input-modern"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-sec">Pausa Longa (min)</label>
                <input 
                  type="number"
                  value={pomodoroConfig.duracaoPausaLonga} 
                  onChange={(e) => setPomodoroConfig({ ...pomodoroConfig, duracaoPausaLonga: Number(e.target.value) })} 
                  className="input-modern"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-text-sec">Ciclos até Pausa Longa</label>
                <input 
                  type="number"
                  value={pomodoroConfig.pomodorosAntesPause} 
                  onChange={(e) => setPomodoroConfig({ ...pomodoroConfig, pomodorosAntesPause: Number(e.target.value) })} 
                  className="input-modern"
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Horários Fixos */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold tracking-tight mb-8 border-b border-border-subtle pb-4">Horários Fixos</h2>

            <div className="space-y-3 mb-8">
              {horariosFixos.map(horario => (
                <div key={horario.id} className="flex items-center justify-between bg-bg-sec border border-border-subtle p-4 rounded-xl group hover:border-accent-blue/50 transition-colors">
                  <div>
                    <span className="font-bold text-lg text-white">{horario.horaInicio} {horario.horaFim ? `- ${horario.horaFim}` : ''}</span>
                    <p className="text-sm text-text-sec mt-1">{horario.descricao}</p>
                  </div>
                  <button 
                    onClick={() => removerHorarioFixo(horario.id)}
                    className="text-text-sec hover:text-error p-2 bg-bg-main rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {horariosFixos.length === 0 && (
                <p className="text-text-sec text-center py-4">Nenhum horário fixo cadastrado.</p>
              )}
            </div>

            <div className="bg-bg-sec border border-border-subtle p-5 rounded-xl">
              <h3 className="text-lg font-medium text-white mb-4">Adicionar Novo Horário</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-text-sec">Início</label>
                  <input 
                    type="time"
                    value={newHorario.horaInicio} 
                    onChange={(e) => setNewHorario({ ...newHorario, horaInicio: e.target.value })} 
                    className="input-modern"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-text-sec">Fim (opcional)</label>
                  <input 
                    type="time"
                    value={newHorario.horaFim || ''} 
                    onChange={(e) => setNewHorario({ ...newHorario, horaFim: e.target.value })} 
                    className="input-modern"
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-xs font-medium mb-1 text-text-sec">Descrição</label>
                <input 
                  value={newHorario.descricao} 
                  onChange={(e) => setNewHorario({ ...newHorario, descricao: e.target.value })} 
                  className="input-modern"
                  placeholder="Ex: Academia, Almoço, Reunião Diária"
                />
              </div>
              <button 
                onClick={handleAddHorario}
                className="w-full bg-bg-main border border-border-subtle hover:bg-border-subtle hover:text-white text-text-main px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium"
              >
                <Plus size={18} />
                Adicionar Horário
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

