import { GoogleGenAI } from "@google/genai";
import { HealthData, WorkoutPlan, Meta, MetaPeriodo } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { getDataStringBrasil } from "../utils/dataUtils";
import { addDays, endOfWeek, endOfMonth, endOfQuarter, format } from "date-fns";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY });

export async function generateDeepeningQuestions(userProfile: any) {
  const prompt = `
    Analise o seguinte perfil de usuário para um sistema de produtividade:
    Nome: ${userProfile.nome}
    Objetivos: ${userProfile.objetivos}
    Rotina Atual: ${userProfile.rotina}
    Hábitos Atuais: ${userProfile.habitosAtuais}
    Horários Disponíveis: ${userProfile.horariosDisponiveis}

    Gere 3 perguntas de aprofundamento para entender melhor como otimizar a rotina dessa pessoa.
    As perguntas devem ser curtas e diretas.
    Retorne apenas as perguntas em formato JSON array de strings.
    Exemplo: ["Pergunta 1?", "Pergunta 2?", "Pergunta 3?"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Erro ao gerar perguntas:", error);
    return [
      "Quais são seus maiores obstáculos para manter a produtividade?",
      "Você prefere trabalhar em blocos longos ou curtos?",
      "Como você lida com interrupções?"
    ];
  }
}

export async function generateRoutineSuggestion(userProfile: any, answers: any) {
  const prompt = `
    Crie uma rotina de produtividade para o seguinte usuário:
    Nome: ${userProfile.nome}
    Objetivos: ${userProfile.objetivos}
    Rotina Atual: ${userProfile.rotina}
    Hábitos Atuais: ${userProfile.habitosAtuais}
    Horários Disponíveis: ${userProfile.horariosDisponiveis}
    Filosofia (Hara Hachi Bu): ${userProfile.haraHachiBu}
    Filosofia (Shokunin): ${userProfile.shokunin}
    Respostas Extras: ${answers.join(" | ")}

    Gere uma lista de tarefas (tasks) e uma lista de hábitos (habitos) que ajudarão esse usuário a alcançar seus objetivos.
    
    Retorne APENAS um objeto JSON com a seguinte estrutura:
    {
      "tasks": [
        {
          "titulo": "string",
          "descricao": "string",
          "duracao": number (em minutos),
          "categoria": "trabalho" | "pessoal" | "saude" | "estudos",
          "prioridade": "alta" | "media" | "baixa",
          "tipoRepeticao": "uma_vez" | "diario" | "semanal"
        }
      ],
      "habitos": [
        {
          "nome": "string",
          "categoria": "string",
          "diasSemana": [0, 1, 2, 3, 4, 5, 6] (array de números, 0=domingo, 6=sábado),
          "horario": "HH:mm"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{"tasks":[], "habitos":[]}');
  } catch (error) {
    console.error("Erro ao gerar rotina:", error);
    throw error;
  }
}

export async function generateDarebeePlan(healthData: HealthData): Promise<WorkoutPlan> {
  const prompt = `
    Atue como um personal trainer especialista na metodologia Darebee (www.darebee.com).
    Crie um plano de treino semanal (7 dias) personalizado baseado nos seguintes dados do usuário:
    
    - Peso: ${healthData.peso} kg
    - Altura: ${healthData.altura} cm
    - Idade: ${healthData.idade} anos
    - Gênero: ${healthData.genero}
    - Nível de Atividade: ${healthData.nivelAtividade}
    - Objetivo: ${healthData.objetivo}
    - Equipamentos Disponíveis: ${healthData.equipamentos}
    - Dias Disponíveis para Treino: ${healthData.diasTreino}
    - Tempo Disponível por Dia: ${healthData.tempoPorDia} minutos
    - Condições Médicas: ${healthData.condicoesMedicas || 'Nenhuma'}

    Regras da Metodologia Darebee:
    - Foco em exercícios com peso corporal (se equipamentos = 'nenhum').
    - Treinos estruturados em circuitos ou séries.
    - Nomes de exercícios claros e comuns no Darebee (ex: Push-ups, Squats, Jumping Jacks, Plank).
    - Incluir dias de descanso ativo ou recuperação se o usuário não treinar os 7 dias.
    - O número de dias de treino com exercícios deve ser exatamente igual a ${healthData.diasTreino}. Os outros dias devem ser marcados como "Descanso".

    Retorne APENAS um objeto JSON com a seguinte estrutura exata:
    {
      "recomendacoesGerais": "string (dicas gerais de hidratação, postura, etc)",
      "dias": [
        {
          "dia": number (1 a 7),
          "foco": "string (ex: Upper Body, Full Body, Cardio, Descanso)",
          "exercicios": [
            {
              "nome": "string (nome do exercício)",
              "series": number (quantidade de séries),
              "repeticoes": "string (ex: '10-12', '30s', 'Ate a falha')",
              "descanso": "string (ex: '60s', 'Sem descanso')",
              "instrucoes": "string (dica rápida de execução)"
            }
          ]
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    
    return {
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString(),
      dias: parsed.dias || [],
      recomendacoesGerais: parsed.recomendacoesGerais || "Mantenha-se hidratado e respeite seus limites.",
    };
  } catch (error) {
    console.error("Erro ao gerar plano Darebee:", error);
    throw new Error("Falha ao gerar o plano de treino. Tente novamente.");
  }
}

export async function generateMetas(userProfile: any): Promise<Meta[]> {
  const prompt = `
    Crie 9 metas para o usuário baseado no seu perfil:
    Nome: ${userProfile?.nome || 'Usuário'}
    Objetivos: ${userProfile?.objetivos || 'Melhorar produtividade e saúde'}
    Rotina Atual: ${userProfile?.rotina || 'Ocupada'}

    Você deve gerar exatamente:
    - 3 metas SEMANAIS (curto prazo, acionáveis)
    - 3 metas MENSAIS (médio prazo, requerem consistência)
    - 3 metas TRIMESTRAIS (longo prazo, grandes marcos)

    Retorne APENAS um objeto JSON com a seguinte estrutura:
    {
      "metas": [
        {
          "titulo": "string",
          "descricao": "string",
          "periodo": "semanal" | "mensal" | "trimestral",
          "metaProgresso": number (valor alvo, ex: 100 para 100%, 10 para 10 livros, etc)
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const parsed = JSON.parse(response.text || '{"metas":[]}');
    const hoje = new Date();
    
    return parsed.metas.map((m: any) => {
      let dataFim = hoje;
      if (m.periodo === 'semanal') dataFim = endOfWeek(hoje, { weekStartsOn: 1 });
      if (m.periodo === 'mensal') dataFim = endOfMonth(hoje);
      if (m.periodo === 'trimestral') dataFim = endOfQuarter(hoje);

      return {
        id: uuidv4(),
        titulo: m.titulo,
        descricao: m.descricao,
        periodo: m.periodo as MetaPeriodo,
        dataInicio: getDataStringBrasil(),
        dataFim: format(dataFim, 'yyyy-MM-dd'),
        progresso: 0,
        status: 'nao_iniciada',
        metaProgresso: m.metaProgresso || 100,
        tasksVinculadas: [],
        ehIkigai: false,
        ehShokunin: false,
      } as Meta;
    });
  } catch (error) {
    console.error("Erro ao gerar metas:", error);
    return [];
  }
}

export async function generateHarderMeta(metaAnterior: Meta, userProfile: any): Promise<Meta> {
  const prompt = `
    O usuário concluiu a seguinte meta:
    Título: ${metaAnterior.titulo}
    Descrição: ${metaAnterior.descricao}
    Período: ${metaAnterior.periodo}
    Valor Alvo: ${metaAnterior.metaProgresso}

    Perfil do usuário:
    Objetivos: ${userProfile?.objetivos || ''}

    Crie uma NOVA meta do mesmo período ('${metaAnterior.periodo}') que seja uma progressão natural (Kaizen) da meta anterior.
    A nova meta deve ser cerca de 10% a 20% mais difícil ou abrangente.

    Retorne APENAS um objeto JSON com a seguinte estrutura:
    {
      "titulo": "string",
      "descricao": "string",
      "metaProgresso": number (valor alvo maior que o anterior)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const m = JSON.parse(response.text || '{}');
    const hoje = new Date();
    
    let dataFim = hoje;
    if (metaAnterior.periodo === 'semanal') dataFim = endOfWeek(hoje, { weekStartsOn: 1 });
    if (metaAnterior.periodo === 'mensal') dataFim = endOfMonth(hoje);
    if (metaAnterior.periodo === 'trimestral') dataFim = endOfQuarter(hoje);

    return {
      id: uuidv4(),
      titulo: m.titulo || `Evolução: ${metaAnterior.titulo}`,
      descricao: m.descricao || 'Meta gerada automaticamente por progressão.',
      periodo: metaAnterior.periodo,
      dataInicio: getDataStringBrasil(),
      dataFim: format(dataFim, 'yyyy-MM-dd'),
      progresso: 0,
      status: 'nao_iniciada',
      metaProgresso: m.metaProgresso || Math.round(metaAnterior.metaProgresso! * 1.1),
      tasksVinculadas: [],
      ehIkigai: false,
      ehShokunin: false,
    };
  } catch (error) {
    console.error("Erro ao gerar meta mais difícil:", error);
    
    // Fallback
    const hoje = new Date();
    let dataFim = hoje;
    if (metaAnterior.periodo === 'semanal') dataFim = endOfWeek(hoje, { weekStartsOn: 1 });
    if (metaAnterior.periodo === 'mensal') dataFim = endOfMonth(hoje);
    if (metaAnterior.periodo === 'trimestral') dataFim = endOfQuarter(hoje);

    return {
      id: uuidv4(),
      titulo: `${metaAnterior.titulo} (Nível 2)`,
      descricao: 'Continue progredindo!',
      periodo: metaAnterior.periodo,
      dataInicio: getDataStringBrasil(),
      dataFim: format(dataFim, 'yyyy-MM-dd'),
      progresso: 0,
      status: 'nao_iniciada',
      metaProgresso: Math.round(metaAnterior.metaProgresso! * 1.1),
      tasksVinculadas: [],
      ehIkigai: false,
      ehShokunin: false,
    };
  }
}
