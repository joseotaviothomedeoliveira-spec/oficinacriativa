import { BookOpen, Lightbulb, ClipboardList } from "lucide-react";
import type { Category, Turma } from "./types";
import { CATEGORY_INFO } from "./types";

const ICONS: Record<Category, typeof BookOpen> = {
  planeamento: BookOpen,
  atividade: Lightbulb,
  avaliacao: ClipboardList,
};

interface Props {
  onSelect: (cat: Category) => void;
  activeTurma?: Turma | null;
}

const CategoryCards = ({ onSelect, activeTurma }: Props) => {
  const categories: Category[] = ["planeamento", "atividade", "avaliacao"];

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
          Assistente Pedagógico <span className="text-[hsl(217,91%,60%)]">IA</span>
        </h2>
        <p className="mt-1 text-sm text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
          Escolha como deseja ser auxiliada hoje
        </p>
        {activeTurma && (
          <p className="mt-1 text-xs text-[hsl(217,91%,60%)]">
            Turma ativa: {activeTurma.nome}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const Icon = ICONS[cat];
          const info = CATEGORY_INFO[cat];
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className="group rounded-2xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] p-6 text-left shadow-[0_1px_3px_hsl(220,13%,91%,0.4)] transition-all duration-200 hover:-translate-y-1 hover:border-[hsl(217,91%,80%)] hover:shadow-[0_8px_24px_hsl(217,91%,60%,0.12)]"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(217,91%,95%)] dark:bg-[hsl(217,40%,20%)] text-[hsl(217,91%,60%)] transition-colors group-hover:bg-[hsl(217,91%,60%)] group-hover:text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
                {info.label}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
                {info.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryCards;
