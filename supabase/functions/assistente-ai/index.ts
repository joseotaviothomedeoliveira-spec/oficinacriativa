import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) {
    return new Response(JSON.stringify({ error: "AI not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { action } = body;

    let messages: any[];
    let maxTokens = 2000;
    let model = "google/gemini-3-flash-preview";

    switch (action) {
      case "suggest-theme":
        messages = suggestThemeMessages(body);
        maxTokens = 100;
        model = "google/gemini-2.5-flash-lite";
        break;
      case "refine-chat":
        messages = refineChatMessages(body);
        maxTokens = 500;
        model = "google/gemini-2.5-flash-lite";
        break;
      case "generate":
        messages = generateMessages(body);
        maxTokens = 3000;
        model = "google/gemini-3-flash-preview";
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const res = await fetch(AI_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages, max_tokens: maxTokens }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function suggestThemeMessages({ ano, disciplina, turmaProfile, previousThemes }: any) {
  const avoid = previousThemes?.length
    ? `\nNão sugirar estes temas: ${previousThemes.join(", ")}`
    : "";
  const turma = turmaProfile ? `\nPerfil da turma: ${turmaProfile}` : "";

  return [
    {
      role: "system",
      content: `És assistente pedagógica especialista no currículo nacional português. A tua função é sugerir UM tema de aula concreto, nuclear e estruturante.

REGRAS OBRIGATÓRIAS:
- Prioriza conteúdos NUCLEARES e ESTRUTURANTES do ano indicado.
- Prioriza conteúdos clássicos ensinados em praticamente todas as escolas de Portugal.
- O tema deve ser imediatamente reconhecível por qualquer docente português.
- Respeita rigorosamente o ano selecionado.
- Tema claro, direto, curricular, sem descrições longas, sem termos técnicos excessivos.

HIERARQUIA DE SUGESTÃO:
1. Conteúdo nuclear do ano
2. Conteúdo estruturante da disciplina
3. Conteúdo amplamente trabalhado nacionalmente

PROIBIDO sugerir:
- Subtemas demasiado específicos ou marginais
- Conteúdos estatísticos (gráficos, organização de dados) a menos que sejam centrais no ano
- Formulações vagas como "Organização e tratamento de dados"
- Temas periféricos que não são trabalhados na maioria das escolas

EXEMPLOS DE BOAS SUGESTÕES (Matemática):
1.º Ciclo: "Multiplicação por dois algarismos", "Resolução de problemas com frações", "Tabuada do 7", "Adição com transporte", "Sistema de numeração decimal"
2.º/3.º Ciclo: "Equações do 1.º grau", "Proporcionalidade direta", "Áreas e perímetros", "Teorema de Pitágoras", "Números racionais"

Se houver turma ativa, ajusta ao perfil (ex: se dificuldades em cálculo → priorizar cálculo).

Responde APENAS com o tema. Sem explicações, sem aspas, sem marcadores. Português de Portugal.${avoid}${turma}`,
    },
    { role: "user", content: `Ano: ${ano}\nDisciplina: ${disciplina}` },
  ];
}

function refineChatMessages({ chatMessages, objetivo, turmaProfile }: any) {
  const turma = turmaProfile ? `\nPerfil da turma: ${turmaProfile}` : "";
  return [
    {
      role: "system",
      content: `És assistente pedagógica. Ajudas a refinar objetivos de aula. Respostas breves, claras, em Português de Portugal. Sem markdown (sem #, *, **). Objetivo atual: "${objetivo}"${turma}`,
    },
    ...chatMessages,
  ];
}

function generateMessages({ category, ano, disciplina, duracao, nivel, tema, objetivo, turmaProfile }: any) {
  const catName: Record<string, string> = {
    planeamento: "Planeamento de Aula",
    atividade: "Atividade Pedagógica",
    avaliacao: "Avaliação ou Teste",
  };
  const turma = turmaProfile
    ? `\n\nPERFIL DA TURMA:\n${turmaProfile}\nAdapta o conteúdo ao perfil desta turma, considerando as dificuldades, pontos fortes, ritmo e estratégias que funcionam.`
    : "";

  return [
    {
      role: "system",
      content: `És assistente pedagógica profissional do sistema educativo português. Geras conteúdo pedagógico estruturado e de alta qualidade.

REGRAS OBRIGATÓRIAS:
- Escreve SEMPRE em Português de Portugal
- NÃO uses marcadores markdown (sem #, *, **, ___, ---)
- Usa texto limpo e bem formatado
- Parágrafos curtos e espaçados
- Linguagem clara, profissional e acessível
- Conteúdo baseado no currículo português real

ESTRUTURA OBRIGATÓRIA:

Começa SEMPRE com:
"Olá! Entendi o que pretende trabalhar com a sua turma. Preparei uma proposta estruturada para si:"

Depois segue EXATAMENTE esta estrutura:

TÍTULO E CONTEXTUALIZAÇÃO
(parágrafo breve)

OBJETIVOS PEDAGÓGICOS
1.
2.
3.

DESENVOLVIMENTO
1.
2.
3.

DIFERENCIAÇÃO PEDAGÓGICA
(como adaptar a diferentes níveis)

ESTRATÉGIA DE AVALIAÇÃO
(como avaliar)

TAREFA DE CASA
(sugestão de tarefa)

ATIVIDADES COMPLEMENTARES
1.
2.
3.${turma}`,
    },
    {
      role: "user",
      content: `Gera ${catName[category] || category}:\nAno: ${ano}\nDisciplina: ${disciplina}${duracao ? `\nDuração: ${duracao}` : ""}${nivel ? `\nNível: ${nivel}` : ""}\nTema: ${tema}\nObjetivo: ${objetivo}`,
    },
  ];
}
