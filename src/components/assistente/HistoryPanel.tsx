import { ArrowLeft, Clock, Trash2, Eye } from "lucide-react";
import type { HistoryItem } from "./types";
import { CATEGORY_INFO } from "./types";

interface Props {
  history: HistoryItem[];
  onBack: () => void;
  onView: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const HistoryPanel = ({ history, onBack, onView, onDelete }: Props) => {
  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-[hsl(220,9%,46%)] transition-colors hover:bg-[hsl(220,14%,96%)] dark:hover:bg-[hsl(220,15%,18%)]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-bold text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
          Histórico
        </h2>
      </div>

      {history.length === 0 ? (
        <div className="py-16 text-center">
          <Clock className="mx-auto h-10 w-10 text-[hsl(220,13%,85%)] dark:text-[hsl(220,15%,30%)]" />
          <p className="mt-3 text-sm text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
            Ainda não há conteúdos gerados
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] px-4 py-3 transition-colors hover:border-[hsl(217,91%,80%)]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                  {item.tema}
                </p>
                <p className="mt-0.5 text-xs text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
                  {CATEGORY_INFO[item.category].label} · {item.disciplina} · {item.ano}
                  {item.turmaName && ` · ${item.turmaName}`}
                </p>
                <p className="mt-0.5 text-[10px] text-[hsl(220,9%,70%)] dark:text-[hsl(220,10%,45%)]">
                  {new Date(item.createdAt).toLocaleDateString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="ml-3 flex items-center gap-1">
                <button
                  onClick={() => onView(item)}
                  className="rounded-lg p-2 text-[hsl(217,91%,60%)] transition-colors hover:bg-[hsl(217,91%,95%)] dark:hover:bg-[hsl(217,40%,18%)]"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
