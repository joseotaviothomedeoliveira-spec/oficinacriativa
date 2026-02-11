import { useState, useEffect, useCallback } from "react";
import { X, Share, MoreVertical, Monitor, Smartphone } from "lucide-react";

const STORAGE_KEY = "install_prompt_dismissed";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

interface InstallPromptProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

const InstallPrompt = ({ forceOpen, onClose }: InstallPromptProps) => {
  const [open, setOpen] = useState(false);
  const platform = detectPlatform();

  useEffect(() => {
    if (forceOpen) {
      setOpen(true);
      return;
    }
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setOpen(true);
  }, [forceOpen]);

  const close = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  const dismissForever = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
    onClose?.();
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 space-y-5 animate-scale-in">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {platform === "ios" && <IOSTutorial />}
        {platform === "android" && <AndroidTutorial />}
        {platform === "desktop" && <DesktopTutorial />}

        {/* Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={close}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Entendi
          </button>
          <button
            onClick={dismissForever}
            className="w-full rounded-lg border border-border py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            Nao mostrar novamente
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Step component ─── */
const Step = ({ number, icon, text }: { number: number; icon: React.ReactNode; text: string }) => (
  <div className="flex items-start gap-3">
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
      {number}
    </span>
    <div className="flex items-center gap-2 pt-0.5">
      {icon}
      <span className="text-sm text-foreground">{text}</span>
    </div>
  </div>
);

/* ─── iOS ─── */
const IOSTutorial = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2.5">
      <Smartphone className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-bold text-foreground">Guarde este acesso no seu iPhone</h2>
    </div>
    <p className="text-sm text-muted-foreground">Fica como uma app no seu telefone.</p>
    <div className="space-y-3">
      <Step number={1} icon={null} text="Abra este site no Safari" />
      <Step number={2} icon={<Share className="h-4 w-4 text-primary" />} text='Toque no botao de Partilha (quadrado com seta para cima)' />
      <Step number={3} icon={null} text='"Adicionar ao Ecra Principal"' />
      <Step number={4} icon={null} text='Confirme em "Adicionar"' />
    </div>
    <p className="text-xs text-muted-foreground">Assim voce entra mais rapido e recebe as novas ofertas.</p>
  </div>
);

/* ─── Android ─── */
const AndroidTutorial = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2.5">
      <Smartphone className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-bold text-foreground">Guarde este acesso no seu Android</h2>
    </div>
    <p className="text-sm text-muted-foreground">Fica como uma app no seu telefone.</p>
    <div className="space-y-3">
      <Step number={1} icon={null} text="Abra este site no Chrome" />
      <Step number={2} icon={<MoreVertical className="h-4 w-4 text-primary" />} text="Toque nos 3 pontinhos (menu)" />
      <Step number={3} icon={null} text='"Adicionar a tela inicial" ou "Instalar app"' />
      <Step number={4} icon={null} text="Confirme" />
    </div>
    <p className="text-xs text-muted-foreground">Assim voce entra mais rapido e recebe as novas ofertas.</p>
  </div>
);

/* ─── Desktop ─── */
const DesktopTutorial = () => (
  <div className="space-y-4">
    <div className="flex items-center gap-2.5">
      <Monitor className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-bold text-foreground">Dica rapida</h2>
    </div>
    <p className="text-sm text-foreground leading-relaxed">
      Para adicionar como app, abra este link no telemovel (iPhone ou Android) e siga o passo a passo automatico.
    </p>
  </div>
);

export default InstallPrompt;
