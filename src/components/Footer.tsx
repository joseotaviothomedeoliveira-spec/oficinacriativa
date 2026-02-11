import { useState } from "react";
import InstallPrompt from "@/components/InstallPrompt";

const Footer = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <>
      <footer className="border-t border-border bg-card py-6">
        <div className="container flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <span>Conteudo digital. Acesso imediato apos confirmacao.</span>
          <button
            onClick={() => setShowPrompt(true)}
            className="text-xs text-primary hover:underline transition-colors"
          >
            Como adicionar como app
          </button>
        </div>
      </footer>
      {showPrompt && (
        <InstallPrompt forceOpen onClose={() => setShowPrompt(false)} />
      )}
    </>
  );
};

export default Footer;
