import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  BookOpen,
  ClipboardList,
  LogOut,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/* ── Dashboard cards data ── */
const tools = [
  {
    icon: FileText,
    title: "Planos de Aula",
    description: "Crie planos de aula completos e adaptados à sua turma em segundos.",
    soon: true,
  },
  {
    icon: BookOpen,
    title: "Atividades",
    description: "Gere atividades pedagógicas prontas a aplicar, organizadas por tema.",
    soon: true,
  },
  {
    icon: ClipboardList,
    title: "Avaliações",
    description: "Monte avaliações ajustadas ao nível da sua turma com critérios claros.",
    soon: true,
  },
];

const AssistenteDashboardPage = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const checkAccess = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("id")
        .eq("product_slug", "assistente-pedagogico")
        .limit(1);

      if (!data || data.length === 0) {
        setHasAccess(false);
      } else {
        setHasAccess(true);
      }
    };

    checkAccess();
  }, [user, authLoading, navigate]);

  /* Loading state */
  if (authLoading || hasAccess === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[hsl(217,91%,60%)] border-t-transparent" />
      </div>
    );
  }

  /* No access */
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
            <h1 className="text-xl font-bold text-[hsl(222,47%,11%)]">Acesso restrito</h1>
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

  /* Dashboard */
  return (
    <>
      <Helmet>
        <title>Assistente Pedagógico — Dashboard</title>
        <meta
          name="description"
          content="Acesse suas ferramentas pedagógicas com inteligência artificial."
        />
      </Helmet>

      <main className="min-h-[80vh] bg-[hsl(210,33%,98%)]">
        {/* Header bar */}
        <div className="border-b border-[hsl(220,13%,91%)] bg-white">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(217,91%,60%)] text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-[hsl(222,47%,11%)]">Assistente Pedagógico</h1>
                <p className="text-xs text-[hsl(220,9%,46%)]">
                  As suas ferramentas de IA para a sala de aula
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[hsl(220,9%,46%)] transition-colors hover:bg-[hsl(220,14%,96%)] hover:text-[hsl(222,47%,11%)]"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Welcome */}
        <div className="container mx-auto px-4 pt-8 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[hsl(217,91%,60%)]" />
            <h2 className="text-xl font-bold text-[hsl(222,47%,11%)]">
              Bem-vinda, professora!
            </h2>
          </div>
          <p className="mt-1 text-sm text-[hsl(220,9%,46%)]">
            Escolha uma ferramenta para começar a preparar as suas aulas.
          </p>
        </div>

        {/* Tool cards */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map(({ icon: Icon, title, description, soon }) => (
              <div
                key={title}
                className="group relative rounded-2xl border border-[hsl(220,13%,91%)] bg-white p-6 shadow-[0_1px_3px_hsl(220,13%,91%,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_hsl(220,13%,91%,0.5)]"
              >
                {soon && (
                  <span className="absolute top-4 right-4 rounded-full bg-[hsl(217,91%,95%)] px-2.5 py-0.5 text-[10px] font-semibold text-[hsl(217,91%,60%)]">
                    Em breve
                  </span>
                )}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(217,91%,95%)] text-[hsl(217,91%,60%)] transition-colors group-hover:bg-[hsl(217,91%,60%)] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-[hsl(222,47%,11%)]">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[hsl(220,9%,46%)]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default AssistenteDashboardPage;
