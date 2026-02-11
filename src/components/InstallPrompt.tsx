import { useState, useEffect, useCallback } from "react";
import { X, Share, MoreVertical, Smartphone } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in">
        {/* Close X */}
        <button
          onClick={close}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-7 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 pr-8">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
              Coloque este site como App no seu telemovel
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Assim voce entra com 1 toque e nao perde novos materiais.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Platform-specific steps */}
          {platform === "ios" && <IOSSteps />}
          {platform === "android" && <AndroidSteps />}
          {platform === "desktop" && <DesktopMessage />}

          {/* Buttons */}
          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={dismissForever}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Adicionar agora
            </button>
            <button
              onClick={close}
              className="w-full rounded-xl py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Step row ─── */
const StepRow = ({
  number,
  icon,
  children,
}: {
  number: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-4">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
      {number}
    </span>
    <div className="flex items-start gap-2 pt-1 min-w-0">
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <p className="text-sm text-foreground leading-relaxed">{children}</p>
    </div>
  </div>
);

/* ─── iOS ─── */
const IOSSteps = () => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      No iPhone (Safari)
    </p>
    <div className="space-y-4">
      <StepRow number={1} icon={<Share className="h-4 w-4 text-primary" />}>
        Toque no botao de <strong>Partilha</strong> (quadrado com seta para cima, em baixo no ecra).
      </StepRow>
      <StepRow number={2}>
        Desca e toque em <strong>"Adicionar ao Ecra Principal"</strong>.
      </StepRow>
      <StepRow number={3}>
        Toque em <strong>"Adicionar"</strong> no canto superior.
      </StepRow>
    </div>
    <p className="text-sm text-muted-foreground pt-1">
      Vai aparecer como aplicativo no seu telemovel.
    </p>
  </div>
);

/* ─── Android ─── */
const AndroidSteps = () => (
  <div className="space-y-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      No Android (Chrome)
    </p>
    <div className="space-y-4">
      <StepRow number={1} icon={<MoreVertical className="h-4 w-4 text-primary" />}>
        Toque nos <strong>3 pontinhos</strong> no canto superior direito.
      </StepRow>
      <StepRow number={2}>
        Toque em <strong>"Adicionar a tela inicial"</strong> ou <strong>"Instalar app"</strong>.
      </StepRow>
      <StepRow number={3}>
        Confirme em <strong>"Instalar"</strong>.
      </StepRow>
    </div>
    <p className="text-sm text-muted-foreground pt-1">
      Pronto. Vai aparecer como aplicativo no seu telemovel.
    </p>
  </div>
);

/* ─── Desktop fallback ─── */
const DesktopMessage = () => (
  <div className="space-y-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      Dica
    </p>
    <p className="text-sm text-foreground leading-relaxed">
      Para guardar como app, abra este site no seu <strong>telemovel</strong> (iPhone ou Android) e siga o passo a passo que vai aparecer automaticamente.
    </p>
  </div>
);

export default InstallPrompt;
