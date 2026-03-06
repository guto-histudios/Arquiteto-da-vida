import React from 'react';
import { useApp } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart2 } from 'lucide-react';

export function Analytics() {
  const { tasks, habitos } = useApp();

  // Prepare data for the last 7 days
  const data = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const displayDate = format(date, 'dd/MM', { locale: ptBR });

    const tasksCompleted = tasks.filter(t => t.data === dateStr && t.status === 'concluida').length;
    const tasksTotal = tasks.filter(t => t.data === dateStr && t.status !== 'cancelada').length;

    // Calculate habits consistency
    const habitsForDay = habitos.filter(h => h.diasSemana.includes(date.getDay()));
    const habitsCompleted = habitsForDay.reduce((acc, h) => {
      const isCompleted = h.conclusoes.some(c => c.data === dateStr && c.concluido);
      return acc + (isCompleted ? 1 : 0);
    }, 0);
    
    const habitsPercentage = habitsForDay.length > 0 ? (habitsCompleted / habitsForDay.length) * 100 : 0;

    return {
      name: displayDate,
      Tarefas: tasksCompleted,
      Habitos: Math.round(habitsPercentage),
    };
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent-blue/10 rounded-xl">
          <BarChart2 size={28} className="text-accent-blue" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Tarefas Concluídas (Últimos 7 dias)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '0.75rem', color: '#fafafa', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Tarefas" fill="url(#colorTarefas)" radius={[6, 6, 0, 0]} barSize={30} />
                <defs>
                  <linearGradient id="colorTarefas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-6">Consistência de Hábitos (%)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '0.75rem', color: '#fafafa', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="Habitos" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#1a1a1a', stroke: '#22c55e', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

