import React from 'react';
import { Meta } from '../../types';
import { Target, CheckCircle, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { formatarData } from '../../utils/dataUtils';

interface MetaCardProps {
  meta: Meta;
  onUpdate: (id: string, updates: Partial<Meta>) => void;
}

export function MetaCard({ meta, onUpdate }: MetaCardProps) {
  const isConcluida = meta.status === 'concluida';

  return (
    <div className={clsx(
      "glass-card p-6 border-l-4",
      isConcluida ? "border-l-success" : "border-l-accent-blue"
    )}>
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className={clsx("font-bold text-xl tracking-tight", isConcluida && "line-through text-text-sec")}>
            {meta.titulo}
          </h3>
          <span className="text-[10px] font-bold text-text-sec uppercase tracking-widest bg-bg-sec border border-border-subtle px-2.5 py-1 rounded-md mt-2 inline-block">
            {meta.periodo}
          </span>
        </div>
        {isConcluida ? (
          <div className="p-2 bg-success/10 rounded-xl">
            <CheckCircle className="text-success" size={24} />
          </div>
        ) : (
          <div className="p-2 bg-accent-blue/10 rounded-xl">
            <Target className="text-accent-blue" size={24} />
          </div>
        )}
      </div>

      {meta.descricao && <p className="text-text-sec text-sm mb-5 leading-relaxed">{meta.descricao}</p>}

      <div className="mb-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-text-sec font-medium">Progresso</span>
          <span className="text-white font-bold">{Math.round(meta.progresso)}%</span>
        </div>
        <div className="w-full bg-bg-sec rounded-full h-2.5 border border-border-subtle overflow-hidden">
          <div 
            className={clsx(
              "h-full rounded-full transition-all duration-1000 ease-out relative",
              isConcluida ? "bg-success" : "bg-gradient-to-r from-accent-blue to-accent-purple"
            )}
            style={{ width: `${meta.progresso}%` }}
          >
            {!isConcluida && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-sec font-medium bg-bg-sec/50 p-2 rounded-lg border border-border-subtle/50 w-fit">
        <Calendar size={14} className="text-accent-blue" />
        <span>{formatarData(meta.dataInicio)} - {formatarData(meta.dataFim)}</span>
      </div>
    </div>
  );
}

