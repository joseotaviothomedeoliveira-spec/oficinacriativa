import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import type { Category, Turma } from "./types";
import { CATEGORY_INFO, ANOS, DISCIPLINAS, buildTurmaProfile } from "./types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  category: Category;
  activeTurma: Turma | null;
  onBack: () => void;
  onResult: (result: string, formData: { ano: string; disciplina: string; tema: string }) => void;
}

const GenerationForm = ({ category, activeTurma, onBack, onResult }: Props) => {
  const [ano, setAno] = useState(activeTurma?.ano || "");
  const [disciplina, setDisciplina] = useState("");
  const [duracao, setDuracao] = useState("");
  const [nivel, setNivel] = useState("");
  const [tema, setTema] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [generating, setGenerating] = useState(false);
  const [suggestedThemes, setSuggestedThemes] = useState<string[]>([]);
  const [suggestingTheme, setSuggestingTheme] = useState(false);

  // Mini chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const turmaProfile = activeTurma ? buildTurmaProfile(activeTurma) : undefined;

  const handleSuggestTheme = async () => {
    if (!ano || !disciplina) return;
    setSuggestingTheme(true);
    try {
      const { data } = await supabase.functions.invoke("assistente-ai", {
        body: {
          action: "suggest-theme",
          ano,
          disciplina,
          turmaProfile,
          previousThemes: suggestedThemes,
        },
      });
      if (data?.content) {
        const suggestion = data.content.trim();
        setTema(suggestion);
        setSuggestedThemes((prev) => [...prev, suggestion]);
      }
    } catch (e) {
      console.error("Suggest theme error:", e);
    }
    setSuggestingTheme(false);
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const { data } = await supabase.functions.invoke("assistente-ai", {
        body: {
          action: "refine-chat",
          chatMessages: newMessages,
          objetivo,
          turmaProfile,
        },
      });
      if (data?.content) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content.trim() },
        ]);
      }
    } catch (e) {
      console.error("Chat error:", e);
    }
    setChatLoading(false);
  };

  const handleGenerate = async () => {
    if (!ano || !disciplina || !tema || !objetivo) return;
    setGenerating(true);
    try {
      const { data } = await supabase.functions.invoke("assistente-ai", {
        body: {
          action: "generate",
          category,
          ano,
          disciplina,
          duracao,
          nivel,
          tema,
          objetivo,
          turmaProfile,
        },
      });
      if (data?.content) {
        onResult(data.content, { ano, disciplina, tema });
      }
    } catch (e) {
      console.error("Generate error:", e);
    }
    setGenerating(false);
  };

  const isValid = ano && disciplina && tema && objetivo;

  return (
    <div className="mx-auto max-w-xl space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[hsl(220,9%,46%)] transition-colors hover:bg-[hsl(220,14%,96%)] dark:hover:bg-[hsl(220,15%,18%)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
          {CATEGORY_INFO[category].label}
        </h2>
      </div>

      {activeTurma && (
        <div className="rounded-xl bg-[hsl(217,91%,95%)] dark:bg-[hsl(217,40%,15%)] px-4 py-2.5 text-xs font-medium text-[hsl(217,91%,45%)] dark:text-[hsl(217,91%,70%)]">
          Turma ativa: {activeTurma.nome} ({activeTurma.ano})
        </div>
      )}

      {/* Form fields */}
      <div className="space-y-4">
        {/* Ano */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Ano <span className="text-red-500">*</span>
          </label>
          <select
            value={ano}
            onChange={(e) => setAno(e.target.value)}
            disabled={!!activeTurma}
            className="w-full rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] px-4 py-2.5 text-sm text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] disabled:opacity-60"
          >
            <option value="">Selecionar ano</option>
            {ANOS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Disciplina */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Disciplina <span className="text-red-500">*</span>
          </label>
          <select
            value={disciplina}
            onChange={(e) => setDisciplina(e.target.value)}
            className="w-full rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] px-4 py-2.5 text-sm text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]"
          >
            <option value="">Selecionar disciplina</option>
            {DISCIPLINAS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Duração */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Duração
          </label>
          <Input
            value={duracao}
            onChange={(e) => setDuracao(e.target.value)}
            placeholder="Ex: 50 minutos"
            className="rounded-xl text-sm"
          />
        </div>

        {/* Nível */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Nível
          </label>
          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="w-full rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] px-4 py-2.5 text-sm text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]"
          >
            <option value="">Selecionar nível</option>
            <option value="Básico">Básico</option>
            <option value="Intermédio">Intermédio</option>
            <option value="Avançado">Avançado</option>
          </select>
        </div>

        {/* Tema + Suggest */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Tema <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Ex: Frações"
              className="flex-1 rounded-xl text-sm"
            />
            <button
              onClick={handleSuggestTheme}
              disabled={!ano || !disciplina || suggestingTheme}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-[hsl(217,91%,95%)] dark:bg-[hsl(217,40%,18%)] px-3 py-2 text-xs font-semibold text-[hsl(217,91%,50%)] transition-colors hover:bg-[hsl(217,91%,90%)] dark:hover:bg-[hsl(217,40%,25%)] disabled:opacity-50"
            >
              {suggestingTheme ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Sugerir
            </button>
          </div>
        </div>

        {/* Objetivo */}
        <div>
          <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Objetivo da Aula <span className="text-red-500">*</span>
          </label>
          <textarea
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
            placeholder="Descreva o objetivo principal desta aula"
            rows={3}
            className="w-full resize-none rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] px-4 py-2.5 text-sm text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] placeholder:text-[hsl(220,9%,46%)] focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,60%)]"
          />
        </div>

        {/* Mini Chat toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="flex items-center gap-2 rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] px-4 py-2.5 text-sm font-medium text-[hsl(217,91%,50%)] transition-colors hover:bg-[hsl(217,91%,97%)] dark:hover:bg-[hsl(217,40%,15%)]"
        >
          <MessageCircle className="h-4 w-4" />
          Refinar com Chat IA
          <ChevronDown className={`h-4 w-4 transition-transform ${chatOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Mini Chat */}
        {chatOpen && (
          <div className="rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-[hsl(210,33%,98%)] dark:bg-[hsl(220,18%,10%)] p-4">
            <div className="mb-3 max-h-48 space-y-2 overflow-y-auto">
              {chatMessages.length === 0 && (
                <p className="text-center text-xs text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
                  Peça ajuda para refinar o seu objetivo
                </p>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${msg.role === "user" ? "bg-[hsl(220,9%,46%)]" : "bg-[hsl(217,91%,60%)]"}`}>
                    {msg.role === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-[hsl(220,14%,90%)] dark:bg-[hsl(220,15%,22%)] text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]" : "bg-white dark:bg-[hsl(220,18%,16%)] text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] shadow-sm"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[hsl(217,91%,60%)] text-white">
                    <Bot className="h-3 w-3" />
                  </div>
                  <Loader2 className="h-4 w-4 animate-spin text-[hsl(217,91%,60%)]" />
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Escreva a sua mensagem..."
                className="flex-1 rounded-xl text-xs"
              />
              <button
                onClick={handleChatSend}
                disabled={!chatInput.trim() || chatLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(217,91%,60%)] text-white transition-colors hover:bg-[hsl(217,91%,50%)] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!isValid || generating}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[hsl(217,91%,60%)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_hsl(217,91%,60%,0.3)] transition-all hover:bg-[hsl(217,91%,50%)] hover:shadow-[0_6px_20px_hsl(217,91%,60%,0.4)] disabled:opacity-50 disabled:shadow-none"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            A gerar...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Gerar {CATEGORY_INFO[category].label}
          </>
        )}
      </button>
    </div>
  );
};

export default GenerationForm;
