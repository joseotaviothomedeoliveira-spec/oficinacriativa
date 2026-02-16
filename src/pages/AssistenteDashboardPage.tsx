import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  GraduationCap,
  Clock,
  Moon,
  Sun,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import TurmaSelector from "@/components/assistente/TurmaManager";
import CategoryCards from "@/components/assistente/CategoryCards";
import GenerationForm from "@/components/assistente/GenerationForm";
import ResultView from "@/components/assistente/ResultView";
import HistoryPanel from "@/components/assistente/HistoryPanel";
import type { Turma, Category, HistoryItem } from "@/components/assistente/types";
import { storage } from "@/components/assistente/types";

type View = "home" | "form" | "result" | "history";

const AssistenteDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Access gate
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  // App state
  const [view, setView] = useState<View>("home");
  const [turmas, setTurmas] = useState<Turma[]>(storage.getTurmas());
  const [activeTurmaId, setActiveTurmaId] = useState<string | null>(
    storage.getActiveTurmaId()
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentResult, setCurrentResult] = useState("");
  const [currentFormData, setCurrentFormData] = useState<{
    ano: string;
    disciplina: string;
    tema: string;
  } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(storage.getHistory());
  const [resultSaved, setResultSaved] = useState(false);

  const activeTurma = turmas.find((t) => t.id === activeTurmaId) || null;

  // Persist turmas
  useEffect(() => {
    storage.setTurmas(turmas);
  }, [turmas]);

  useEffect(() => {
    storage.setActiveTurmaId(activeTurmaId);
  }, [activeTurmaId]);

  useEffect(() => {
    storage.setHistory(history);
  }, [history]);

  // Check access
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    const check = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("id")
        .eq("product_slug", "assistente-pedagogico")
        .limit(1);
      setHasAccess((data?.length ?? 0) > 0);
    };
    check();
  }, [user, authLoading, navigate]);

  // Handlers
  const handleAddTurma = (turma: Turma) => {
    setTurmas((prev) => [...prev, turma]);
    setActiveTurmaId(turma.id);
  };

  const handleEditTurma = (turma: Turma) => {
    setTurmas((prev) => prev.map((t) => (t.id === turma.id ? turma : t)));
  };

  const handleDeleteTurma = (id: string) => {
    setTurmas((prev) => prev.filter((t) => t.id !== id));
    if (activeTurmaId === id) setActiveTurmaId(null);
  };

  const handleCategorySelect = (cat: Category) => {
    setSelectedCategory(cat);
    setView("form");
  };

  const handleResult = (
    result: string,
    formData: { ano: string; disciplina: string; tema: string }
  ) => {
    setCurrentResult(result);
    setCurrentFormData(formData);
    setResultSaved(false);
    setView("result");
  };

  const handleSaveToHistory = () => {
    if (!selectedCategory || !currentFormData) return;
    const item: HistoryItem = {
      id: crypto.randomUUID(),
      category: selectedCategory,
      tema: currentFormData.tema,
      ano: currentFormData.ano,
      disciplina: currentFormData.disciplina,
      result: currentResult,
      createdAt: new Date().toISOString(),
      turmaName: activeTurma?.nome,
    };
    setHistory((prev) => [item, ...prev]);
    setResultSaved(true);
  };

  const handleViewHistoryItem = (item: HistoryItem) => {
    setCurrentResult(item.result);
    setCurrentFormData({
      ano: item.ano,
      disciplina: item.disciplina,
      tema: item.tema,
    });
    setSelectedCategory(item.category);
    setResultSaved(true);
    setView("result");
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  /* ── Loading ── */
  if (authLoading || hasAccess === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(217,91%,60%)] border-t-transparent" />
      </div>
    );
  }

  /* ── No access ── */
  if (!hasAccess) {
    return (
      <>
        <Helmet>
          <title>Acesso restrito — Assistente Pedagógico</title>
        </Helmet>
        <main className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(220,14%,96%)]">
              <Lock className="h-7 w-7 text-[hsl(220,9%,46%)]" />
            </div>
            <h1 className="text-xl font-bold text-[hsl(222,47%,11%)]">
              Acesso restrito
            </h1>
            <p className="mt-2 text-sm text-[hsl(220,9%,46%)]">
              Você ainda não tem acesso ao Assistente Pedagógico.
            </p>
            <button
              onClick={() => navigate("/assistente-pedagogico")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[hsl(217,91%,60%)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[hsl(217,91%,50%)]"
            >
              Conhecer o Assistente
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </>
    );
  }

  /* ── Dashboard ── */
  return (
    <>
      <Helmet>
        <title>Assistente Pedagógico — Dashboard</title>
      </Helmet>

      <div className="min-h-[80vh] bg-[hsl(210,33%,98%)] dark:bg-[hsl(220,20%,8%)]">
        {/* ── Header bar ── */}
        <div className="border-b border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,10%)]">
          <div className="container mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(217,91%,60%)] text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-sm font-bold text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                Assistente Pedagógico de{" "}
                <span className="text-[hsl(217,91%,60%)]">IA</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setView("history")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)] transition-colors hover:bg-[hsl(220,14%,96%)] dark:hover:bg-[hsl(220,15%,18%)]"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Histórico</span>
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)] transition-colors hover:bg-[hsl(220,14%,96%)] dark:hover:bg-[hsl(220,15%,18%)]"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="container mx-auto px-4 py-6">
          {view === "home" && (
            <div className="space-y-8">
              {/* Turma selector */}
              <TurmaSelector
                turmas={turmas}
                activeTurmaId={activeTurmaId}
                onSelect={setActiveTurmaId}
                onAdd={handleAddTurma}
                onEdit={handleEditTurma}
                onDelete={handleDeleteTurma}
              />

              {/* Category cards */}
              <CategoryCards
                onSelect={handleCategorySelect}
                activeTurma={activeTurma}
              />
            </div>
          )}

          {view === "form" && selectedCategory && (
            <GenerationForm
              category={selectedCategory}
              activeTurma={activeTurma}
              onBack={() => setView("home")}
              onResult={handleResult}
            />
          )}

          {view === "result" && (
            <ResultView
              result={currentResult}
              onBack={() => setView("home")}
              onSave={handleSaveToHistory}
              saved={resultSaved}
            />
          )}

          {view === "history" && (
            <HistoryPanel
              history={history}
              onBack={() => setView("home")}
              onView={handleViewHistoryItem}
              onDelete={handleDeleteHistoryItem}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AssistenteDashboardPage;
