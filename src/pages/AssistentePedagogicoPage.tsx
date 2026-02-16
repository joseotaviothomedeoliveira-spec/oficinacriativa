import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Clock,
  Brain,
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
import garantiaImg from "@/assets/garantia-60-dias.png";
import assistenteLogo from "@/assets/assistente-logo.png";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "wistia-player": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { "media-id"?: string; aspect?: string }, HTMLElement>;
    }
  }
}

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

/* ── Wistia VSL ── */
const WistiaVSL = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Wistia player script
    const playerScript = document.createElement("script");
    playerScript.src = "https://fast.wistia.com/player.js";
    playerScript.async = true;
    document.head.appendChild(playerScript);

    // Load Wistia embed script
    const embedScript = document.createElement("script");
    embedScript.src = "https://fast.wistia.com/embed/4s3eziy2e3.js";
    embedScript.async = true;
    embedScript.type = "module";
    document.head.appendChild(embedScript);
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <wistia-player media-id="4s3eziy2e3" aspect="0.5625" />
    </div>
  );
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
  { icon: Infinity, text: "Acesso ilimitado, use quantas vezes quiser, sem limite" },
  { icon: Zap, text: "Atualizações constantes com novas funcionalidades" },
  { icon: Star, text: "Economize horas por semana no planeamento" },
  { icon: Gift, text: "Suporte dedicado para tirar todas as suas dúvidas" },
  { icon: ShieldCheck, text: "Garantia total: se não gostar, devolvemos o seu dinheiro" },
];

/* ── CTA Button ── */
const CtaButton = ({ ready }: { ready: boolean }) => {
  if (!ready) {
    return (
      <div className="mx-auto max-w-md rounded-2xl bg-muted py-4 text-center text-sm text-muted-foreground">
        Carregando...
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <a
        onClick={() => false}
        href={CHECKOUT_URL}
        className="hotmart-fb hotmart__button-checkout group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-b from-[hsl(150,50%,45%)] to-[hsl(155,55%,35%)] px-8 py-5 text-base font-bold tracking-wide text-white shadow-[0_8px_32px_hsl(150,50%,38%,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_hsl(150,50%,38%,0.55)] active:scale-[0.98]"
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(210,40%,96%)] via-[hsl(215,35%,97%)] to-[hsl(225,30%,94%)] pt-6 pb-12 md:pt-10 md:pb-16">
          <div className="absolute -top-32 -left-32 h-96 w-96 animate-pulse rounded-full bg-[hsl(210,55%,85%)] opacity-50 blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 animate-pulse rounded-full bg-[hsl(225,50%,85%)] opacity-50 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(200,50%,90%)] opacity-30 blur-[80px]" />

           <div className="container relative mx-auto max-w-3xl px-4 text-center">
            <h1 className="mx-auto max-w-2xl text-2xl font-extrabold leading-[1.15] tracking-tight text-foreground md:text-3xl lg:text-4xl">
              Pare de perder horas a planear aulas do zero.{" "}
              <span className="bg-gradient-to-r from-[hsl(210,70%,50%)] to-[hsl(240,55%,55%)] bg-clip-text text-transparent">
                Deixe o Assistente fazer isso por si.
              </span>
            </h1>

            <div className="mx-auto mt-6 max-w-[800px] overflow-hidden rounded-2xl">
              <WistiaVSL />
            </div>

            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              Veja em menos de 2 minutos como professoras estão a preparar
              semanas de aula em minutos.
            </p>

            <div className="mt-6">
              <div className="mx-auto w-full max-w-md">
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("oferta");
                    if (el) {
                      const rect = el.getBoundingClientRect();
                      const scrollTop = window.pageYOffset + rect.top - 40;
                      window.scrollTo({ top: scrollTop, behavior: "smooth" });
                    }
                  }}
                  href="#oferta"
                  className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-b from-[hsl(150,50%,45%)] to-[hsl(155,55%,35%)] px-8 py-5 text-base font-bold tracking-wide text-white shadow-[0_8px_32px_hsl(150,50%,38%,0.4)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_hsl(150,50%,38%,0.55)] active:scale-[0.98]"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative z-10 flex items-center gap-2">
                    QUERO ACESSO AO ASSISTENTE
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Acesso imediato após a compra.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════ DOR ═══════ */}
        <section className="bg-gradient-to-b from-[hsl(215,35%,96%)] to-[hsl(220,30%,98%)] py-12 md:py-14">
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
                  className="group flex items-start gap-4 rounded-2xl border border-[hsl(215,35%,82%)] bg-gradient-to-br from-[hsl(210,50%,95%)] via-[hsl(220,45%,96%)] to-[hsl(230,40%,97%)] p-4 shadow-md shadow-[hsl(215,40%,70%)]/10 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[hsl(215,40%,70%)]/20"
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
        <section className="relative overflow-hidden bg-gradient-to-br from-[hsl(220,30%,98%)] via-[hsl(215,25%,97%)] to-[hsl(210,35%,95%)] py-12 md:py-14">
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
                    className="group flex items-center gap-4 rounded-2xl border border-[hsl(215,35%,82%)] bg-gradient-to-r from-[hsl(210,55%,93%)] via-[hsl(220,50%,95%)] to-[hsl(230,45%,96%)] px-5 py-3.5 shadow-md shadow-[hsl(215,40%,70%)]/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[hsl(215,40%,70%)]/20"
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
        <section className="bg-gradient-to-b from-[hsl(215,35%,96%)] to-[hsl(220,30%,98%)] py-12 md:py-14">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-4xl">
              O que muda na sua rotina
            </h2>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {benefits.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-[hsl(215,35%,82%)] bg-gradient-to-br from-[hsl(210,55%,92%)] via-[hsl(220,50%,95%)] to-[hsl(230,45%,97%)] p-5 shadow-md shadow-[hsl(215,40%,70%)]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[hsl(215,40%,70%)]/20"
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
        <section id="oferta" className="bg-gradient-to-b from-[hsl(220,30%,98%)] to-[hsl(215,35%,96%)] py-12 md:py-14">
          <div className="container mx-auto max-w-2xl px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(210,65%,50%)] to-[hsl(230,60%,45%)] p-[2px] shadow-xl shadow-[hsl(215,50%,50%)]/15">
              <div className="rounded-3xl bg-gradient-to-br from-[hsl(210,35%,97%)] to-white px-6 py-10 md:px-12">
                <div className="text-center">
                  <img src={assistenteLogo} alt="Assistente Pedagógico" className="mx-auto -mb-2 h-44 w-auto object-contain md:h-56" />

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
                      className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[hsl(210,55%,92%)] via-[hsl(220,50%,94%)] to-[hsl(230,45%,96%)] px-4 py-3 shadow-sm shadow-[hsl(215,40%,70%)]/8"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(210,65%,50%)] to-[hsl(230,60%,55%)]">
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl bg-gradient-to-br from-[hsl(150,40%,95%)] to-[hsl(155,35%,97%)] p-6 text-center shadow-inner">
                  <p className="text-sm font-medium text-muted-foreground">Tudo isso por apenas</p>
                  <p className="mt-1 bg-gradient-to-r from-[hsl(150,55%,38%)] to-[hsl(160,50%,32%)] bg-clip-text text-6xl font-black text-transparent md:text-7xl">
                    10€
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[hsl(150,45%,35%)]">Pagamento único · Acesso vitalício</p>
                </div>

                <div className="mt-6 text-center">
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
        <section className="bg-gradient-to-b from-[hsl(215,35%,96%)] to-[hsl(220,30%,98%)] py-12 md:py-14">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <div className="relative mx-auto mb-6 w-full max-w-xs">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[hsl(210,60%,55%)] opacity-30 blur-[40px]" />
              <img
                src={garantiaImg}
                alt="Garantia de 60 dias"
                className="relative mx-auto w-full animate-[float_4s_ease-in-out_infinite] object-contain drop-shadow-[0_0_25px_hsl(210,60%,55%,0.4)]"
              />
            </div>

            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Risco zero para si
            </h2>
            <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
              Você tem até 60 dias de garantia incondicional. Se dentro desse prazo sentir que o Assistente não
              ajuda na sua rotina, basta pedir reembolso. Simples assim, sem perguntas.
            </p>
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
