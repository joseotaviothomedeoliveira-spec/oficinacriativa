import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Clock,
  Brain,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Heart,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  Timer,
  Puzzle,
  Users,
  BatteryLow,
  Hourglass,
  Star,
  Gift,
  Infinity,
  FileText,
  GraduationCap,
} from "lucide-react";

const CHECKOUT_URL = "https://pay.hotmart.com/I104454333M";

/* ── Hotmart widget loader (singleton) ── */
let hotmartLoaded = false;

const useHotmart = () => {
  const [ready, setReady] = useState(hotmartLoaded);

  useEffect(() => {
    if (hotmartLoaded) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://static.hotmart.com/checkout/widget.min.js";
    script.onload = () => {
      hotmartLoaded = true;
      setReady(true);
    };
    document.head.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://static.hotmart.com/css/hotmart-fb.min.css";
    document.head.appendChild(link);
  }, []);

  return ready;
};

/* ── Data ── */
const pains = [
  { icon: Timer, text: "Planeamentos que demoram horas" },
  { icon: Puzzle, text: "Falta de ideias novas para atividades" },
  { icon: Users, text: "Turmas diferentes que exigem tudo personalizado" },
  { icon: BatteryLow, text: "Cansaço mental no fim do dia" },
  { icon: Hourglass, text: "Sensação de estar sempre atrasada" },
];

const benefits = [
  { icon: Clock, text: "Mais tempo livre" },
  { icon: Heart, text: "Menos stress" },
  { icon: Lightbulb, text: "Mais variedade" },
  { icon: BookOpen, text: "Aulas organizadas" },
  { icon: Zap, text: "Menos cansaço" },
];

const features = [
  { icon: CheckCircle2, text: "Planos de aula estruturados" },
  { icon: CheckCircle2, text: "Atividades prontas a aplicar" },
  { icon: CheckCircle2, text: "Sequências didáticas completas" },
  { icon: CheckCircle2, text: "Avaliações ajustadas ao nível da turma" },
];

const offerBullets = [
  { icon: Brain, text: "Assistente com Inteligência Artificial treinado para educação" },
  { icon: FileText, text: "Planos de aula gerados em segundos, adaptados à sua turma" },
  { icon: GraduationCap, text: "Atividades, sequências didáticas e avaliações completas" },
  { icon: Infinity, text: "Acesso ilimitado — use quantas vezes quiser, sem limite" },
  { icon: Zap, text: "Atualizações constantes com novas funcionalidades" },
  { icon: Star, text: "Economize horas por semana no planeamento" },
  { icon: Gift, text: "Suporte dedicado para tirar todas as suas dúvidas" },
  { icon: ShieldCheck, text: "Garantia total — se não gostar, devolvemos o seu dinheiro" },
];

/* ── CTA Button ── */
const CtaButton = ({ ready }: { ready: boolean }) => {
  if (!ready) {
    return (
      <div className="mx-auto max-w-md rounded-full bg-muted py-4 text-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <a
        onClick={() => false}
        href={CHECKOUT_URL}
        className="hotmart-fb hotmart__button-checkout group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[hsl(210,80%,50%)] to-[hsl(230,75%,55%)] px-8 py-5 text-base font-bold tracking-wide text-white shadow-[0_8px_32px_hsl(215,70%,50%,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_hsl(215,70%,50%,0.55)] active:scale-[0.98]"
      >
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative z-10 flex items-center gap-2">
          QUERO ACESSO AO ASSISTENTE
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </span>
      </a>
    </div>
  );
};

/* ── Page ── */
const AssistentePedagogicoPage = () => {
  const ready = useHotmart();

  return (
    <>
      <Helmet>
        <title>Assistente Pedagógico — Oficina Criativa</title>
        <meta
          name="description"
          content="Prepare semanas de aula em minutos com o Assistente Pedagógico. Planos de aula, atividades e avaliações adaptados à sua turma."
        />
      </Helmet>

      <main className="scroll-smooth">
        {/* ═══════ HERO ═══════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(210,40%,96%)] via-background to-[hsl(225,30%,94%)] pt-6 pb-12 md:pt-10 md:pb-16">
          <div className="absolute -top-32 -left-32 h-96 w-96 animate-pulse rounded-full bg-[hsl(210,55%,85%)] opacity-50 blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-[hsl(225,50%,85%)] opacity-50 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(200,50%,90%)] opacity-30 blur-[80px]" />

          <div className="container relative mx-auto max-w-3xl px-4 text-center">
            <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Pare de perder horas a planear aulas do zero.{" "}
              <span className="bg-gradient-to-r from-[hsl(210,70%,50%)] to-[hsl(240,55%,55%)] bg-clip-text text-transparent">
                Deixe o Assistente fazer isso por si.
              </span>
            </h1>

            <div className="mx-auto mt-8 max-w-[800px] overflow-hidden rounded-3xl border border-[hsl(215,30%,85%)] bg-white/50 p-1 shadow-xl shadow-[hsl(215,40%,70%)]/15 backdrop-blur-sm">
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(210,30%,95%)] to-[hsl(225,25%,93%)]">
                {/* COLE AQUI O EMBED DA VSL */}
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(215,50%,50%)]/10">
                    <Sparkles className="h-6 w-6 text-[hsl(215,50%,50%)]" />
                  </div>
                  <p className="text-sm font-medium">Vídeo em breve</p>
                </div>
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              Veja em menos de 2 minutos como professoras estão a preparar
              semanas de aula em minutos.
            </p>

            <div className="mt-6">
              <CtaButton ready={ready} />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Acesso imediato após a compra.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ DOR ═══════ */}
        <section className="py-12 md:py-14">
          <div className="container mx-auto max-w-4xl px-4">
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-1.5 text-xs font-semibold text-destructive">
                <AlertTriangle className="h-3.5 w-3.5" />
                Você se identifica?
              </span>
            </div>
            <h2 className="mx-auto max-w-2xl text-center text-2xl font-bold text-foreground md:text-4xl">
              Se preparar aulas está a consumir o seu tempo...{" "}
              <span className="text-[hsl(215,55%,50%)]">você não está sozinha.</span>
            </h2>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pains.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 rounded-2xl border border-destructive/15 bg-gradient-to-br from-destructive/5 to-transparent p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-destructive/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-colors group-hover:bg-destructive/15">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-foreground">{text}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-center text-lg font-semibold text-[hsl(215,55%,50%)]">
              Foi exatamente para resolver isso que criámos o Assistente Pedagógico.
            </p>
          </div>
        </section>

        {/* ═══════ O QUE É ═══════ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(210,35%,95%)] via-[hsl(220,30%,96%)] to-background py-12 md:py-14">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[hsl(215,50%,88%)] opacity-30 blur-[80px]" />

          <div className="container relative mx-auto max-w-3xl px-4 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(210,65%,55%)] to-[hsl(230,60%,50%)] shadow-lg shadow-[hsl(215,50%,50%)]/25">
              <Brain className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-2xl font-bold text-foreground md:text-4xl">
              O seu novo cérebro pedagógico{" "}
              <span className="bg-gradient-to-r from-[hsl(210,65%,50%)] to-[hsl(240,50%,55%)] bg-clip-text text-transparent">
                disponível 24 horas
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              O Assistente Pedagógico aprende como é a sua turma e passa a gerar
              materiais já adaptados à sua realidade.
            </p>

            <div className="mx-auto mt-8 max-w-lg text-left">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Você descreve a sua turma uma vez... e ele começa a criar automaticamente:
              </p>
              <div className="grid gap-2.5">
                {features.map(({ icon: Icon, text }, i) => (
                  <div
                    key={i}
                    className="group flex items-center gap-4 rounded-2xl border border-[hsl(215,40%,85%)] bg-gradient-to-r from-[hsl(210,50%,96%)] to-[hsl(225,45%,97%)] px-5 py-3.5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(210,65%,50%)] to-[hsl(230,60%,55%)]">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ BENEFÍCIOS ═══════ */}
        <section className="py-12 md:py-14">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-4xl">
              O que muda na sua rotina
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {benefits.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-[hsl(215,40%,85%)] bg-gradient-to-br from-[hsl(210,50%,96%)] to-[hsl(225,45%,98%)] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[hsl(215,40%,70%)]/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[hsl(210,65%,50%)] to-[hsl(230,60%,55%)] shadow-md shadow-[hsl(215,50%,50%)]/20 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ OFERTA ═══════ */}
        <section className="py-12 md:py-14">
          <div className="container mx-auto max-w-2xl px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(210,65%,50%)] to-[hsl(230,60%,45%)] p-[2px]">
              <div className="rounded-3xl bg-gradient-to-br from-[hsl(210,35%,97%)] to-white px-6 py-10 md:px-12">
                <div className="text-center">
                  <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-[hsl(215,55%,50%)]/10 px-4 py-1.5 text-xs font-bold tracking-wide text-[hsl(215,55%,45%)]">
                    <Zap className="h-3.5 w-3.5" />
                    OFERTA ESPECIAL
                  </span>

                  <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                    Tudo isso está incluído no seu acesso
                  </h2>
                  <p className="mx-auto mt-2 max-w-md text-base text-muted-foreground">
                    Veja tudo o que você recebe ao garantir o Assistente Pedagógico hoje:
                  </p>
                </div>

                <div className="mt-6 grid gap-2.5">
                  {offerBullets.map(({ icon: Icon, text }, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[hsl(210,50%,96%)] to-[hsl(225,40%,98%)] px-4 py-3"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(210,65%,50%)] to-[hsl(230,60%,55%)]">
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <p className="mb-4 text-sm font-semibold text-[hsl(215,55%,45%)]">
                    Aproveite esta condição especial disponível apenas neste momento.
                  </p>
                  <CtaButton ready={ready} />
                  <p className="mt-2 text-xs text-muted-foreground">
                    Oferta exclusiva desta página.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ GARANTIA ═══════ */}
        <section className="py-12 md:py-14">
          <div className="container mx-auto max-w-lg px-4">
            <div className="rounded-3xl border-2 border-[hsl(215,40%,85%)] bg-gradient-to-br from-[hsl(210,35%,97%)] to-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(150,45%,42%)] to-[hsl(150,50%,35%)] shadow-lg shadow-[hsl(150,45%,40%)]/25">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Risco zero para si
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
                Se dentro do prazo de garantia você sentir que o Assistente não
                ajuda na sua rotina, basta pedir reembolso. Simples assim.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          Assistente Pedagógico — Todos os direitos reservados
        </footer>
      </main>
    </>
  );
};

export default AssistentePedagogicoPage;
