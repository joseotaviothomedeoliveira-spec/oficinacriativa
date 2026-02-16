export interface Turma {
  id: string;
  nome: string;
  ano: string;
  descricao: string;
  dificuldades: string;
  pontosFortes: string;
  ritmo: string;
  comportamento: string;
  estrategias: string;
}

export type Category = "planeamento" | "atividade" | "avaliacao";

export interface HistoryItem {
  id: string;
  category: Category;
  tema: string;
  ano: string;
  disciplina: string;
  result: string;
  createdAt: string;
  turmaName?: string;
}

export const CATEGORY_INFO: Record<Category, { label: string; description: string }> = {
  planeamento: {
    label: "Planeamento de Aula",
    description: "Crie planos de aula completos e estruturados",
  },
  atividade: {
    label: "Geração de Atividade",
    description: "Gere atividades pedagógicas prontas a aplicar",
  },
  avaliacao: {
    label: "Avaliação ou Teste",
    description: "Monte avaliações ajustadas ao nível da turma",
  },
};

export const ANOS = [
  "Pré-Escolar",
  "1.º Ano",
  "2.º Ano",
  "3.º Ano",
  "4.º Ano",
  "5.º Ano",
  "6.º Ano",
  "7.º Ano",
  "8.º Ano",
  "9.º Ano",
];

export const DISCIPLINAS = [
  "Português",
  "Matemática",
  "Estudo do Meio",
  "Ciências Naturais",
  "História e Geografia de Portugal",
  "Inglês",
  "Educação Visual",
  "Educação Tecnológica",
  "Educação Física",
  "Educação Musical",
  "Físico-Química",
  "Geografia",
  "História",
  "TIC",
  "Cidadania e Desenvolvimento",
  "Expressões Artísticas",
];

// localStorage helpers
const TURMAS_KEY = "assistente-turmas";
const ACTIVE_KEY = "assistente-active-turma";
const HISTORY_KEY = "assistente-history";

export const storage = {
  getTurmas: (): Turma[] => {
    try {
      return JSON.parse(localStorage.getItem(TURMAS_KEY) || "[]");
    } catch {
      return [];
    }
  },
  setTurmas: (t: Turma[]) => localStorage.setItem(TURMAS_KEY, JSON.stringify(t)),
  getActiveTurmaId: () => localStorage.getItem(ACTIVE_KEY),
  setActiveTurmaId: (id: string | null) => {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  },
  getHistory: (): HistoryItem[] => {
    try {
      return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    } catch {
      return [];
    }
  },
  setHistory: (h: HistoryItem[]) =>
    localStorage.setItem(HISTORY_KEY, JSON.stringify(h)),
};

export const stripMarkdown = (text: string): string =>
  text
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^---$/gm, "")
    .replace(/^>\s/gm, "");

export const buildTurmaProfile = (t: Turma): string =>
  [
    `Nome: ${t.nome}`,
    `Ano: ${t.ano}`,
    t.descricao && `Descrição: ${t.descricao}`,
    t.dificuldades && `Dificuldades: ${t.dificuldades}`,
    t.pontosFortes && `Pontos fortes: ${t.pontosFortes}`,
    t.ritmo && `Ritmo: ${t.ritmo}`,
    t.comportamento && `Comportamento: ${t.comportamento}`,
    t.estrategias && `Estratégias: ${t.estrategias}`,
  ]
    .filter(Boolean)
    .join("\n");
