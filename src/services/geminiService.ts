import { GoogleGenAI } from "@google/genai";

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
