import { useEffect, useState } from "react";

interface HotmartButtonProps {
  checkoutUrl: string;
}

let hotmartLoaded = false;

const HotmartButton = ({ checkoutUrl }: HotmartButtonProps) => {
  const [ready, setReady] = useState(hotmartLoaded);

  useEffect(() => {
    if (hotmartLoaded) {
      setReady(true);
      return;
    }

    // Carrega o script do widget Hotmart
    const script = document.createElement("script");
    script.src = "https://static.hotmart.com/checkout/widget.min.js";
    script.onload = () => {
      hotmartLoaded = true;
      setReady(true);
    };
    document.head.appendChild(script);

    // Carrega o CSS do widget Hotmart
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://static.hotmart.com/css/hotmart-fb.min.css";
    document.head.appendChild(link);
  }, []);

  if (!ready) {
    return (
      <div className="rounded-lg bg-muted py-3 text-center text-sm text-muted-foreground">
        Carregando checkout...
      </div>
    );
  }

  return (
    <a
      onClick={() => false}
      href={checkoutUrl}
      className="hotmart-fb hotmart__button-checkout inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
    >
      Comprar agora
    </a>
  );
};

export default HotmartButton;
