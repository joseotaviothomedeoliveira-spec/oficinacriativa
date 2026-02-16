import { useState } from "react";
import { Plus, ChevronDown, Users, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Turma } from "./types";

interface TurmaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (turma: Turma) => void;
  editTurma?: Turma | null;
}

const TurmaModal = ({ open, onClose, onSave, editTurma }: TurmaModalProps) => {
  const [form, setForm] = useState<Omit<Turma, "id">>({
    nome: editTurma?.nome || "",
    ano: editTurma?.ano || "",
    descricao: editTurma?.descricao || "",
    dificuldades: editTurma?.dificuldades || "",
    pontosFortes: editTurma?.pontosFortes || "",
    ritmo: editTurma?.ritmo || "",
    comportamento: editTurma?.comportamento || "",
    estrategias: editTurma?.estrategias || "",
  });

  const handleSave = () => {
    if (!form.nome.trim() || !form.ano.trim()) return;
    onSave({
      id: editTurma?.id || crypto.randomUUID(),
      ...form,
    });
    onClose();
  };

  const fields: { key: keyof Omit<Turma, "id">; label: string; placeholder: string }[] = [
    { key: "nome", label: "Nome da Turma", placeholder: "Ex: 3.º B" },
    { key: "ano", label: "Ano", placeholder: "Ex: 3.º Ano" },
    { key: "descricao", label: "Descrição geral", placeholder: "Breve descrição da turma" },
    { key: "dificuldades", label: "Dificuldades principais", placeholder: "Principais dificuldades" },
    { key: "pontosFortes", label: "Pontos fortes", placeholder: "Pontos fortes da turma" },
    { key: "ritmo", label: "Ritmo médio", placeholder: "Ex: Moderado" },
    { key: "comportamento", label: "Perfil comportamental", placeholder: "Como se comportam" },
    { key: "estrategias", label: "Estratégias que funcionam", placeholder: "O que resulta bem" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]">
            {editTurma ? "Editar Turma" : "Adicionar Turma"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]">
                {label} {(key === "nome" || key === "ano") && <span className="text-red-500">*</span>}
              </label>
              <Input
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="text-sm"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={!form.nome.trim() || !form.ano.trim()}
            className="mt-2 w-full rounded-xl bg-[hsl(217,91%,60%)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[hsl(217,91%,50%)] disabled:opacity-50"
          >
            {editTurma ? "Guardar alterações" : "Adicionar turma"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ── Selector ── */
interface TurmaSelectorProps {
  turmas: Turma[];
  activeTurmaId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: (turma: Turma) => void;
  onEdit: (turma: Turma) => void;
  onDelete: (id: string) => void;
}

const TurmaSelector = ({
  turmas,
  activeTurmaId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
}: TurmaSelectorProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTurma, setEditTurma] = useState<Turma | null>(null);

  const active = turmas.find((t) => t.id === activeTurmaId);

  return (
    <div className="flex items-center gap-3">
      {/* Dropdown */}
      <div className="relative flex-1">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex w-full items-center justify-between rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] px-4 py-2.5 text-sm font-medium text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)] transition-colors hover:border-[hsl(217,91%,60%)]"
        >
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[hsl(217,91%,60%)]" />
            {active ? active.nome : "Sem turma selecionada"}
          </span>
          <ChevronDown className={`h-4 w-4 text-[hsl(220,9%,46%)] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-[hsl(220,13%,91%)] dark:border-[hsl(220,15%,20%)] bg-white dark:bg-[hsl(220,18%,13%)] py-1 shadow-lg">
            <button
              onClick={() => { onSelect(null); setDropdownOpen(false); }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-[hsl(210,33%,98%)] dark:hover:bg-[hsl(220,15%,18%)] ${!activeTurmaId ? "font-semibold text-[hsl(217,91%,60%)]" : "text-[hsl(220,9%,46%)] dark:text-[hsl(220,10%,60%)]"}`}
            >
              Sem turma
            </button>
            {turmas.map((t) => (
              <div
                key={t.id}
                className={`flex items-center justify-between px-4 py-2 transition-colors hover:bg-[hsl(210,33%,98%)] dark:hover:bg-[hsl(220,15%,18%)] ${t.id === activeTurmaId ? "font-semibold text-[hsl(217,91%,60%)]" : ""}`}
              >
                <button
                  onClick={() => { onSelect(t.id); setDropdownOpen(false); }}
                  className="flex-1 text-left text-sm text-[hsl(222,47%,11%)] dark:text-[hsl(210,40%,98%)]"
                >
                  {t.nome} <span className="text-xs text-[hsl(220,9%,46%)]">({t.ano})</span>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditTurma(t); setModalOpen(true); setDropdownOpen(false); }}
                    className="rounded p-1 text-[hsl(220,9%,46%)] hover:bg-[hsl(220,14%,96%)] dark:hover:bg-[hsl(220,15%,22%)]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(t.id); setDropdownOpen(false); }}
                    className="rounded p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={() => { setEditTurma(null); setModalOpen(true); }}
        className="flex items-center gap-1.5 rounded-xl border border-dashed border-[hsl(217,91%,60%)] px-3 py-2.5 text-xs font-semibold text-[hsl(217,91%,60%)] transition-colors hover:bg-[hsl(217,91%,95%)] dark:hover:bg-[hsl(217,91%,15%)]"
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Adicionar Turma</span>
      </button>

      {/* Modal */}
      {modalOpen && (
        <TurmaModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditTurma(null); }}
          onSave={(turma) => {
            editTurma ? onEdit(turma) : onAdd(turma);
          }}
          editTurma={editTurma}
        />
      )}
    </div>
  );
};

export default TurmaSelector;
