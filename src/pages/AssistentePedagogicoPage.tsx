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
} from "lucide-react";
import HotmartButton from "@/components/HotmartButton";

const CHECKOUT_URL = "https://pay.hotmart.com/I104454333M";

const pains = [
  "Planeamentos que demoram horas",
  "Falta de ideias novas para atividades",
  "Turmas diferentes que exigem tudo personalizado",
  "Cansaco mental no fim do dia",
  "Sensacao de estar sempre atrasada",
];

const benefits = [
  { icon: Clock, text: "Mais tempo livre" },
  { icon: Heart, text: "Menos stress no planeamento" },
  { icon: Lightbulb, text: "Mais variedade nas atividades" },
  { icon: BookOpen, text: "Aulas mais organizadas" },
  { icon: Zap, text: "Menos cansaco mental" },
];

const features = [
  "Planos de aula estruturados",
  "Atividades prontas a aplicar",
  "Sequencias didaticas completas",
  "Avaliacoes ajustadas ao nivel da turma",
];

const CtaButton = () => (
  <div className="mx-auto w-full max-w-md">
    <HotmartButton checkoutUrl={CHECKOUT_URL} />
    <p className="mt-2 text-center text-xs text-muted-foreground">
      Acesso imediato apos a compra.
    </p>
  </div>
);

const AssistentePedagogicoPage = () => {
  return (
    <>
      <Helmet>
        <title>Assistente Pedagogico — Oficina Criativa</title>
        <meta
          name="description"
          content="Prepare semanas de aula em minutos com o Assistente Pedagogico. Planos de aula, atividades e avaliacoes adaptados a sua turma."
        />
      </Helmet>

      <main className="scroll-smooth">
        {/* ═══════ HERO ═══════ */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(260,40%,96%)] to-background py-16 md:py-24">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[hsl(260,50%,88%)] opacity-40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[hsl(200,50%,88%)] opacity-40 blur-3xl" />

          <div className="container relative mx-auto max-w-3xl px-4 text-center">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[hsl(260,45%,55%)]/10 px-3 py-1 text-xs font-semibold text-[hsl(260,45%,45%)]">
              <Sparkles className="h-3.5 w-3.5" />
              Assistente Pedagogico
            </span>

            <h1 className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl">
              Pare de perder horas a planear aulas do zero.{" "}
              <span className="text-[hsl(260,45%,50%)]">
                Deixe o Assistente Pedagogico fazer isso por si.
              </span>
            </h1>

            {/* VSL Container */}
            <div className="mx-auto mt-10 max-w-[800px] overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-[hsl(260,30%,70%)]/15">
              <div className="flex aspect-video items-center justify-center bg-muted text-muted-foreground">
                {/* COLE AQUI O EMBED DA VSL */}
                <p className="text-sm">Video em breve</p>
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground">
              Veja em menos de 2 minutos como professoras estao a preparar
              semanas de aula em minutos.
            </p>

            <div className="mt-8">
              <CtaButton />
            </div>
          </div>
        </section>

        {/* ═══════ DOR ═══════ */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="mb-8 flex items-center justify-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[hsl(260,45%,50%)]" />
              <h2 className="text-center text-2xl font-bold text-foreground md:text-3xl">
                Se preparar aulas esta a consumir o seu tempo... voce nao esta sozinha.
              </h2>
            </div>

            <ul className="mx-auto max-w-md space-y-3">
              {pains.map((pain, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-foreground"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-xs font-bold text-destructive">
                    !
                  </span>
                  {pain}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-center text-base font-medium text-[hsl(260,45%,50%)]">
              Foi exatamente para resolver isso que criamos o Assistente
              Pedagogico.
            </p>
          </div>
        </section>

        {/* ═══════ O QUE E ═══════ */}
        <section className="bg-gradient-to-b from-[hsl(260,40%,96%)] to-background py-16 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <Brain className="mx-auto mb-4 h-10 w-10 text-[hsl(260,45%,50%)]" />
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              O seu novo cerebro pedagogico disponivel 24 horas
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
              O Assistente Pedagogico aprende como e a sua turma e passa a gerar
              materiais ja adaptados a sua realidade.
            </p>

            <div className="mx-auto mt-8 max-w-md text-left">
              <p className="mb-3 text-sm font-semibold text-foreground">
                Voce descreve a sua turma uma vez... e ele comeca a criar
                automaticamente:
              </p>
              <ul className="space-y-2.5">
                {features.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 rounded-lg bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[hsl(260,45%,50%)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ═══════ BENEFICIOS ═══════ */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              O que muda na sua rotina
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {benefits.map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(260,45%,55%)]/10">
                    <Icon className="h-5 w-5 text-[hsl(260,45%,50%)]" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ OFERTA ═══════ */}
        <section className="bg-gradient-to-b from-[hsl(260,40%,96%)] to-background py-16 md:py-20">
          <div className="container mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Adicione agora o Assistente Pedagogico
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Aproveite esta condicao especial disponivel apenas neste momento.
            </p>
            <div className="mt-8">
              <CtaButton />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Oferta exclusiva desta pagina.
            </p>
          </div>
        </section>

        {/* ═══════ GARANTIA ═══════ */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto max-w-xl px-4 text-center">
            <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Risco zero para si
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
              Se dentro do prazo de garantia voce sentir que o Assistente nao
              ajuda na sua rotina, basta pedir reembolso. Simples assim.
            </p>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          Assistente Pedagogico — Todos os direitos reservados
        </footer>
      </main>
    </>
  );
};

export default AssistentePedagogicoPage;
