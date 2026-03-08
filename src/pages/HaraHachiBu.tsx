import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Utensils, Sparkles, Check, RefreshCw, AlertCircle, Info, Flame, Droplets, Wheat } from 'lucide-react';
import { generateHaraHachiBuMeals } from '../services/geminiService';
import { getDataStringBrasil } from '../utils/dataUtils';
import { MealOption, Meal } from '../types';

export function HaraHachiBu() {
  const { healthData, userProfile, dailyMeals, saveDailyMeals, chooseMealOption } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hoje = getDataStringBrasil();
  const needsGeneration = !dailyMeals || dailyMeals.data !== hoje;

  useEffect(() => {
    if (needsGeneration && healthData && userProfile && !isGenerating) {
      handleGenerate();
    }
  }, [needsGeneration, healthData, userProfile]);

  const handleGenerate = async () => {
    if (!healthData || !userProfile) {
      setError("Preencha seu perfil de saúde e perfil geral para gerar as refeições.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const opcoes = await generateHaraHachiBuMeals(healthData, userProfile);
      saveDailyMeals({
        data: hoje,
        opcoesGeradas: opcoes,
        opcaoEscolhidaId: undefined
      });
    } catch (err) {
      setError("Erro ao gerar opções de refeição. Tente novamente.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMeal = (title: string, meal: Meal) => (
    <div className="bg-bg-main border border-border-subtle rounded-xl p-4 space-y-3">
      <div className="flex justify-between items-start">
        <h4 className="font-semibold text-text-main">{title}</h4>
        <span className="text-xs font-medium bg-accent-purple/10 text-accent-purple px-2 py-1 rounded-lg flex items-center gap-1">
          <Flame size={12} />
          {meal.calorias} kcal
        </span>
      </div>
      
      <div>
        <p className="text-sm font-medium text-white">{meal.nome}</p>
        <p className="text-xs text-text-sec mt-1">{meal.quantidade} • {meal.porcoes}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-subtle">
        <div className="flex flex-col items-center p-1.5 bg-bg-sec rounded-lg">
          <span className="text-[10px] text-text-sec flex items-center gap-1"><Droplets size={10} className="text-blue-400"/> Prot</span>
          <span className="text-xs font-semibold text-white">{meal.proteina}g</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-bg-sec rounded-lg">
          <span className="text-[10px] text-text-sec flex items-center gap-1"><Wheat size={10} className="text-yellow-400"/> Carb</span>
          <span className="text-xs font-semibold text-white">{meal.carboidratos}g</span>
        </div>
        <div className="flex flex-col items-center p-1.5 bg-bg-sec rounded-lg">
          <span className="text-[10px] text-text-sec flex items-center gap-1"><Droplets size={10} className="text-orange-400"/> Gord</span>
          <span className="text-xs font-semibold text-white">{meal.gorduras}g</span>
        </div>
      </div>
    </div>
  );

  if (!healthData) {
    return (
      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-purple/10 rounded-xl">
            <Utensils size={28} className="text-accent-purple" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Hara Hachi Bu</h1>
        </div>
        <div className="glass-card p-8 text-center max-w-2xl mx-auto mt-12">
          <AlertCircle size={48} className="text-accent-purple mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-4">Perfil Incompleto</h2>
          <p className="text-text-sec mb-6">Para gerar opções de refeições personalizadas, precisamos dos seus dados de saúde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent-purple/10 rounded-xl">
            <Utensils size={28} className="text-accent-purple" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Hara Hachi Bu</h1>
            <p className="text-text-sec mt-1">Coma até 80% da sua capacidade</p>
          </div>
        </div>
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn-secondary flex items-center gap-2"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin" />
          ) : (
            <RefreshCw size={20} className="text-accent-purple" />
          )}
          Gerar Novas Opções
        </button>
      </div>

      <div className="bg-accent-purple/10 border border-accent-purple/20 rounded-2xl p-4 flex items-start gap-3">
        <Info size={24} className="text-accent-purple shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-accent-purple mb-1">Princípio Hara Hachi Bu</h3>
          <p className="text-sm text-text-sec">
            A filosofia de Okinawa ensina a parar de comer quando você se sentir 80% satisfeito.
            Isso evita a letargia pós-refeição, melhora a digestão e contribui para a longevidade.
            <strong> Dica: Coma devagar e preste atenção aos sinais do seu corpo.</strong>
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      {isGenerating ? (
        <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 border-4 border-accent-purple/30 border-t-accent-purple rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-medium mb-2">O Nutricionista IA está preparando seu menu...</h3>
          <p className="text-text-sec max-w-md">Calculando macronutrientes e porções baseadas no seu objetivo de {healthData.objetivo.replace('_', ' ')}.</p>
        </div>
      ) : dailyMeals?.opcoesGeradas ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Opções para Hoje</h2>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {dailyMeals.opcoesGeradas.map((opcao, index) => {
              const isSelected = dailyMeals.opcaoEscolhidaId === opcao.id;
              
              return (
                <div 
                  key={opcao.id}
                  className={`glass-card relative overflow-hidden transition-all duration-300 ${isSelected ? 'ring-2 ring-accent-purple shadow-lg shadow-accent-purple/20 scale-[1.02]' : 'hover:border-border-subtle'}`}
                >
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-accent-purple text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                      <Check size={12} />
                      ESCOLHIDA
                    </div>
                  )}
                  
                  <div className="p-6 border-b border-border-subtle bg-bg-sec/50">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-bold">Opção {index + 1}</h3>
                      <span className="font-bold text-accent-purple">{opcao.caloriasTotais} kcal</span>
                    </div>
                    
                    {!isSelected && (
                      <button
                        onClick={() => chooseMealOption(opcao.id)}
                        className="w-full mt-4 py-2 rounded-xl border border-accent-purple text-accent-purple hover:bg-accent-purple hover:text-white transition-colors font-medium text-sm"
                      >
                        Escolher esta opção
                      </button>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    {renderMeal("Café da Manhã", opcao.cafeDaManha)}
                    {renderMeal("Almoço", opcao.almoco)}
                    {renderMeal("Lanche da Tarde", opcao.lancheDaTarde)}
                    {renderMeal("Jantar", opcao.jantar)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
