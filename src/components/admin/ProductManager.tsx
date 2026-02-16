import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, Loader2, Save, X, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price_text: string;
  short_description: string;
  description: string;
  cover_image_url: string;
  gallery_image_urls: string[];
  benefits: string[];
  faqs: Array<{ q: string; a: string }>;
  hotmart_checkout_url: string;
  wistia_media_id: string | null;
  wistia_aspect: string | null;
  wistia_media_id2: string | null;
  wistia_aspect2: string | null;
  video_divider_text: string | null;
  drive_preview_folder_id: string | null;
  sort_order: number;
  is_active: boolean;
}

const emptyProduct: Omit<ProductRow, "id"> = {
  slug: "",
  name: "",
  price_text: "€0,00",
  short_description: "",
  description: "",
  cover_image_url: "",
  gallery_image_urls: [],
  benefits: [],
  faqs: [],
  hotmart_checkout_url: "",
  wistia_media_id: null,
  wistia_aspect: null,
  wistia_media_id2: null,
  wistia_aspect2: null,
  video_divider_text: null,
  drive_preview_folder_id: null,
  sort_order: 0,
  is_active: true,
};

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const ProductManager = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductRow | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [benefitInput, setBenefitInput] = useState("");
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });
    setProducts((data as any[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const startNew = () => {
    setEditing({ ...emptyProduct, id: "", sort_order: products.length + 1 } as ProductRow);
    setIsNew(true);
    setShowAdvanced(false);
    setBenefitInput("");
    setFaqQ("");
    setFaqA("");
  };

  const startEdit = (p: ProductRow) => {
    setEditing({ ...p });
    setIsNew(false);
    setShowAdvanced(false);
    setBenefitInput("");
    setFaqQ("");
    setFaqA("");
  };

  const cancel = () => {
    setEditing(null);
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.slug.trim()) {
      toast.error("Nome e slug são obrigatórios.");
      return;
    }
    setSaving(true);

    const payload = {
      slug: editing.slug.trim(),
      name: editing.name.trim(),
      price_text: editing.price_text.trim(),
      short_description: editing.short_description.trim(),
      description: editing.description.trim(),
      cover_image_url: editing.cover_image_url.trim(),
      gallery_image_urls: editing.gallery_image_urls,
      benefits: editing.benefits,
      faqs: editing.faqs,
      hotmart_checkout_url: editing.hotmart_checkout_url.trim(),
      wistia_media_id: editing.wistia_media_id?.trim() || null,
      wistia_aspect: editing.wistia_aspect?.trim() || null,
      wistia_media_id2: editing.wistia_media_id2?.trim() || null,
      wistia_aspect2: editing.wistia_aspect2?.trim() || null,
      video_divider_text: editing.video_divider_text?.trim() || null,
      drive_preview_folder_id: editing.drive_preview_folder_id?.trim() || null,
      sort_order: editing.sort_order,
      is_active: editing.is_active,
    };

    if (isNew) {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast.error("Erro ao criar: " + error.message);
        setSaving(false);
        return;
      }
      toast.success("Produto criado!");
    } else {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) {
        toast.error("Erro ao atualizar: " + error.message);
        setSaving(false);
        return;
      }
      toast.success("Produto atualizado!");
    }

    setSaving(false);
    setEditing(null);
    setIsNew(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir: " + error.message);
      return;
    }
    toast.success("Produto excluído.");
    fetchProducts();
  };

  const toggleActive = async (p: ProductRow) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !p.is_active })
      .eq("id", p.id);
    if (error) {
      toast.error("Erro ao alterar estado.");
      return;
    }
    fetchProducts();
  };

  const addBenefit = () => {
    if (!benefitInput.trim() || !editing) return;
    setEditing({ ...editing, benefits: [...editing.benefits, benefitInput.trim()] });
    setBenefitInput("");
  };

  const removeBenefit = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, benefits: editing.benefits.filter((_, idx) => idx !== i) });
  };

  const addFaq = () => {
    if (!faqQ.trim() || !faqA.trim() || !editing) return;
    setEditing({ ...editing, faqs: [...editing.faqs, { q: faqQ.trim(), a: faqA.trim() }] });
    setFaqQ("");
    setFaqA("");
  };

  const removeFaq = (i: number) => {
    if (!editing) return;
    setEditing({ ...editing, faqs: editing.faqs.filter((_, idx) => idx !== i) });
  };

  const updateField = (field: keyof ProductRow, value: any) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Edit/Create form
  if (editing) {
    return (
      <section className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {isNew ? "Novo Produto" : `Editar: ${editing.name}`}
          </h2>
          <button onClick={cancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Basic fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-foreground">Nome *</label>
            <input className={inputClass} value={editing.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Nome do produto" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Slug *</label>
            <input className={inputClass} value={editing.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="meu-produto" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Preço</label>
            <input className={inputClass} value={editing.price_text} onChange={(e) => updateField("price_text", e.target.value)} placeholder="€10,00" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Ordem</label>
            <input type="number" className={inputClass} value={editing.sort_order} onChange={(e) => updateField("sort_order", parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Descrição curta</label>
          <input className={inputClass} value={editing.short_description} onChange={(e) => updateField("short_description", e.target.value)} placeholder="Breve descrição" />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Descrição completa</label>
          <textarea className={inputClass + " min-h-[120px] resize-y"} value={editing.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Descrição detalhada do produto..." />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">URL da imagem de capa</label>
          <input className={inputClass} value={editing.cover_image_url} onChange={(e) => updateField("cover_image_url", e.target.value)} placeholder="https://..." />
          {editing.cover_image_url && (
            <img src={editing.cover_image_url} alt="Preview" className="mt-2 h-24 rounded-md object-contain border border-border" />
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Link de checkout (Hotmart)</label>
          <input className={inputClass} value={editing.hotmart_checkout_url} onChange={(e) => updateField("hotmart_checkout_url", e.target.value)} placeholder="https://pay.hotmart.com/..." />
        </div>

        {/* Benefits */}
        <div>
          <label className="text-sm font-medium text-foreground">Benefícios</label>
          <div className="mt-1 space-y-1">
            {editing.benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm">
                <span className="flex-1 text-foreground">{b}</span>
                <button onClick={() => removeBenefit(i)} className="text-destructive hover:opacity-70"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input className={inputClass} value={benefitInput} onChange={(e) => setBenefitInput(e.target.value)} placeholder="Novo benefício" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())} />
            <button onClick={addBenefit} className="shrink-0 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">+</button>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <label className="text-sm font-medium text-foreground">Perguntas Frequentes</label>
          <div className="mt-1 space-y-1">
            {editing.faqs.map((f, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-border px-3 py-1.5 text-sm">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{f.q}</p>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
                <button onClick={() => removeFaq(i)} className="text-destructive hover:opacity-70 mt-0.5"><X className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
          <div className="mt-2 space-y-2">
            <input className={inputClass} value={faqQ} onChange={(e) => setFaqQ(e.target.value)} placeholder="Pergunta" />
            <input className={inputClass} value={faqA} onChange={(e) => setFaqA(e.target.value)} placeholder="Resposta" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFaq())} />
            <button onClick={addFaq} className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">Adicionar FAQ</button>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Campos avançados (VSL, Drive, etc.)
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-lg border border-border p-4">
            <div>
              <label className="text-sm font-medium text-foreground">Wistia Media ID</label>
              <input className={inputClass} value={editing.wistia_media_id ?? ""} onChange={(e) => updateField("wistia_media_id", e.target.value || null)} placeholder="abc123" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Wistia Aspect</label>
              <input className={inputClass} value={editing.wistia_aspect ?? ""} onChange={(e) => updateField("wistia_aspect", e.target.value || null)} placeholder="0.5625" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Wistia Media ID 2</label>
              <input className={inputClass} value={editing.wistia_media_id2 ?? ""} onChange={(e) => updateField("wistia_media_id2", e.target.value || null)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Wistia Aspect 2</label>
              <input className={inputClass} value={editing.wistia_aspect2 ?? ""} onChange={(e) => updateField("wistia_aspect2", e.target.value || null)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Texto divisor de vídeo</label>
              <input className={inputClass} value={editing.video_divider_text ?? ""} onChange={(e) => updateField("video_divider_text", e.target.value || null)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Drive Folder ID</label>
              <input className={inputClass} value={editing.drive_preview_folder_id ?? ""} onChange={(e) => updateField("drive_preview_folder_id", e.target.value || null)} />
            </div>
          </div>
        )}

        {/* Active toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={editing.is_active}
            onChange={(e) => updateField("is_active", e.target.checked)}
            className="accent-primary"
          />
          <span className="text-sm font-medium text-foreground">Produto ativo (visível no site)</span>
        </label>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isNew ? "Criar Produto" : "Guardar Alterações"}
        </button>
      </section>
    );
  }

  // Product list
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Produtos ({products.length})</h2>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
              p.is_active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"
            }`}
          >
            {p.cover_image_url && (
              <img src={p.cover_image_url} alt={p.name} className="h-12 w-12 rounded-md object-contain border border-border" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.slug} · {p.price_text}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleActive(p)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                title={p.is_active ? "Desativar" : "Ativar"}
              >
                {p.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => startEdit(p)}
                className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="rounded-md p-1.5 text-destructive hover:opacity-70"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductManager;
