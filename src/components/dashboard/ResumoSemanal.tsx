import React, { useState, useEffect, useMemo } from 'react';
import { useResumoSemanal } from '../../hooks/useResumoSemanal';
import { format, subWeeks, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, Star, Target, CheckCircle, Calendar, ChevronLeft, ChevronRight, Save, Award, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export function ResumoSemanal() {
  const { summaries, generateSummary, saveReflection, addSummary } = useResumoSemanal();
  const [weekOffset, setWeekOffset] = useState(0); 

  const targetDate = useMemo(() => {
    const d = new Date();
    if (weekOffset < 0) {
      return subWeeks(d, Math.abs(weekOffset));
    }
    return d;
  }, [weekOffset]);

  const summary = useMemo(() => generateSummary(targetDate), [targetDate, generateSummary]);

  const [learned, setLearned] = useState('');
  const [improve, setImprove] = useState('');

  useEffect(() => {
    setLearned(summary.reflectionLearned || '');
    setImprove(summary.reflectionImprove || '');
    
    // Auto-add to history if it doesn't exist
    if (!summaries.find(s => s.id === summary.id)) {
      addSummary(summary);
    }
  }, [summary.id, summary.reflectionLearned, summary.reflectionImprove, summaries, addSummary, summary]);

  const handleSave = () => {
    saveReflection(summary.id, learned, improve);
    alert('Reflexão salva com sucesso!');
  };

  const handlePrevWeek = () => {
    if (weekOffset > -3) setWeekOffset(prev => prev - 1);
  };

  const handleNextWeek = () => {
    if (weekOffset < 0) setWeekOffset(prev => prev + 1);
  };

  const previousSummary = useMemo(() => {
    return summaries.find(s => s.id === format(subWeeks(targetDate, 1), 'yyyy-MM-dd'));
  }, [summaries, targetDate]);

  const chartData = [
    {
      name: 'Semana Passada',
      Tarefas: previousSummary?.tasksCompleted || 0,
      Hábitos: previousSummary?.habitsCompleted || 0,
    },
    {
      name: 'Esta Semana',
      Tarefas: summary.tasksCompleted,
      Hábitos: summary.habitsCompleted,
    }
  ];

  const taskPercentage = summary.tasksTotal > 0 ? Math.round((summary.tasksCompleted / summary.tasksTotal) * 100) : 0;
  const bestDayFormatted = summary.bestDay ? format(parseISO(summary.bestDay), 'EEEE', { locale: ptBR }) : 'Nenhum';

  return (
    <div className="glass-card p-6 md:p-8 relative overflow-hidden mt-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-accent-blue/10 to-transparent rounded-bl-full -z-10"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="text-accent-blue" size={28} />
            Resumo Semanal
          </h2>
          <p className="text-text-sec mt-1">
            {format(parseISO(summary.startDate), "dd 'de' MMM", { locale: ptBR })} a {format(parseISO(summary.endDate), "dd 'de' MMM", { locale: ptBR })}
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-bg-sec p-1.5 rounded-xl border border-border-subtle">
          <button 
            onClick={handlePrevWeek}
            disabled={weekOffset <= -3}
            className="p-2 rounded-lg hover:bg-bg-card disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            {weekOffset === 0 ? 'Esta Semana' : `${Math.abs(weekOffset)} sem. atrás`}
          </span>
          <button 
            onClick={handleNextWeek}
            disabled={weekOffset >= 0}
            className="p-2 rounded-lg hover:bg-bg-card disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Stats Column */}
        <div className="lg:col-span-1 space-y-6">
          <h3 className="text-lg font-bold text-white mb-4">Essa semana você:</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-bg-sec/50 p-3 rounded-xl border border-border-subtle">
              <div className="p-2 bg-accent-blue/10 rounded-lg text-accent-blue">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-sm text-text-sec">Concluiu</p>
                <p className="font-bold text-white">{summary.tasksCompleted} tasks <span className="text-xs font-normal text-text-sec">({taskPercentage}% do total)</span></p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-bg-sec/50 p-3 rounded-xl border border-border-subtle">
              <div className="p-2 bg-success/10 rounded-lg text-success">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm text-text-sec">Manteve</p>
                <p className="font-bold text-white">{summary.habitsCompleted} hábitos</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-bg-sec/50 p-3 rounded-xl border border-border-subtle">
              <div className="p-2 bg-accent-purple/10 rounded-lg text-accent-purple">
                <Target size={20} />
              </div>
              <div>
                <p className="text-sm text-text-sec">Completou</p>
                <p className="font-bold text-white">{summary.metasCompleted} metas</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-bg-sec/50 p-3 rounded-xl border border-border-subtle">
              <div className="p-2 bg-warning/10 rounded-lg text-warning">
                <Star size={20} />
              </div>
              <div>
                <p className="text-sm text-text-sec">Ganhou</p>
                <p className="font-bold text-white">{summary.xpEarned} XP <span className="text-xs font-normal text-text-sec">(Nível {summary.levelReached})</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-bg-sec p-4 rounded-xl border border-border-subtle text-center">
              <p className="text-xs text-text-sec mb-1 uppercase tracking-wider">Melhor Dia</p>
              <p className="font-bold text-accent-blue capitalize">{bestDayFormatted}</p>
            </div>
            <div className="bg-bg-sec p-4 rounded-xl border border-border-subtle text-center">
              <p className="text-xs text-text-sec mb-1 uppercase tracking-wider">Pomodoros</p>
              <p className="font-bold text-accent-purple">{summary.totalPomodoros}</p>
            </div>
          </div>
        </div>

        {/* Reflection & Chart Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart */}
          <div className="bg-bg-sec/30 p-5 rounded-2xl border border-border-subtle">
            <h3 className="text-sm font-bold text-text-sec uppercase tracking-wider mb-4 flex items-center gap-2">
              <TrendingUp size={16} />
              Comparação com Semana Passada
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#27272a' }}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                  />
                  <Bar dataKey="Tarefas" fill="var(--theme-primary)" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="Hábitos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Reflection Form */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy size={20} className="text-warning" />
              Reflexão Semanal
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-sec mb-2">O que você aprendeu ou fez bem essa semana?</label>
                <textarea
                  value={learned}
                  onChange={(e) => setLearned(e.target.value)}
                  placeholder="Escreva suas vitórias e aprendizados..."
                  className="w-full bg-bg-sec border border-border-subtle rounded-xl px-4 py-3 text-text-main placeholder-text-sec focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue resize-none h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-sec mb-2">O que pode melhorar para a próxima semana?</label>
                <textarea
                  value={improve}
                  onChange={(e) => setImprove(e.target.value)}
                  placeholder="Identifique obstáculos e como superá-los..."
                  className="w-full bg-bg-sec border border-border-subtle rounded-xl px-4 py-3 text-text-main placeholder-text-sec focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple resize-none h-24"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-accent-blue to-accent-purple text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-accent-blue/20"
                >
                  <Save size={18} />
                  Salvar Reflexão
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
