import { ArrowLeft, Copy, Check, Save } from "lucide-react";
import { useState } from "react";
import { stripMarkdown } from "./types";

interface Props {
  result: string;
  onBack: () => void;
  onSave: () => void;
  saved: boolean;
}

const ResultView = ({ result, onBack, onSave, saved }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(stripMarkdown(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderResult = () => {
    const cleaned = stripMarkdown(result);
    const lines = cleaned.split("\n");

    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} className="h-3" />;

      // Section header detection (ALL CAPS lines, at least 5 chars, mostly letters)
      const isHeader =
        trimmed.length >= 5 &&
        trimmed === trimmed.toUpperCase() &&
        /[A-ZÀ-ÚÃÕ]{3,}/.test(trimmed) &&
        !/^\d/.test(trimmed);

      if (isHeader) {
        return (
          <h3
            key={i}
            className="mt-6 mb-2 border-b border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,25%)] pb-1 text-sm font-bold uppercase tracking-wide text-[hsl(217,91%,50%)]"
          >
            {trimmed}
          </h3>
        );
      }

      // Numbered item
      if (/^\d+[\.\)]/.test(trimmed)) {
        return (
          <p
            key={i}
            className="ml-2 mb-1.5 text-sm leading-relaxed text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,93%)]"
          >
            {trimmed}
          </p>
        );
      }

      // Regular paragraph
      return (
        <p
          key={i}
          className="mb-2 text-sm leading-relaxed text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,93%)]"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Top actions */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[hsl(220,9%,46%)] transition-colors hover:bg-[hsl(220,14%,96%)] dark:hover:bg-[hsl(220,15%,18%)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            disabled={saved}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
              saved
                ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                : "bg-[hsl(217,91%,95%)] dark:bg-[hsl(217,40%,18%)] text-[hsl(217,91%,50%)] hover:bg-[hsl(217,91%,90%)]"
            }`}
          >
            {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
            {saved ? "Guardado" : "Guardar"}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-[hsl(217,91%,95%)] dark:bg-[hsl(217,40%,18%)] px-3 py-2 text-xs font-semibold text-[hsl(217,91%,50%)] transition-colors hover:bg-[hsl(217,91%,90%)]"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* Result card */}
      <div className="rounded-2xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] p-6 shadow-sm md:p-8">
        {renderResult()}
      </div>
    </div>
  );
};

export default ResultView;
