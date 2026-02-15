import { useState } from "react";
import { MessageCircle, Mail, X } from "lucide-react";

const SupportButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="mb-2 w-64 rounded-xl border border-border bg-card p-4 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200">
          <p className="mb-3 text-sm font-semibold text-foreground">Precisa de ajuda?</p>
          <div className="flex flex-col gap-2">
            <a
              href="https://wa.me/5548917540009?text=Olá%2C%20vim%20do%20site%20e%20tenho%20uma%20dúvida."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href="mailto:oficinacriativa.artes@gmail.com"
              className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Suporte"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default SupportButton;
