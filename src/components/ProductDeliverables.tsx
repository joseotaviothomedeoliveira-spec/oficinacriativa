import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Lock } from "lucide-react";
import { Link } from "react-router-dom";

interface Deliverable {
  id: string;
  label: string;
  file_url: string;
  sort_order: number;
}

interface Props {
  productSlug: string;
  onPurchaseStatusChange?: (hasPurchase: boolean) => void;
}

const ProductDeliverables = ({ productSlug, onPurchaseStatusChange }: Props) => {
  const { user } = useAuth();
  const [hasPurchase, setHasPurchase] = useState(false);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      onPurchaseStatusChange?.(false);
      return;
    }

    const fetchData = async () => {
      // Check purchase
      const { data: purchases } = await supabase
        .from("purchases")
        .select("id")
        .eq("product_slug", productSlug)
        .limit(1);

      const purchased = (purchases?.length ?? 0) > 0;
      setHasPurchase(purchased);
      onPurchaseStatusChange?.(purchased);

      if (purchased) {
        const { data } = await supabase
          .from("deliverables")
          .select("*")
          .eq("product_slug", productSlug)
          .order("sort_order");
        setDeliverables(data ?? []);
      }

      setLoading(false);
    };

    fetchData();
  }, [user, productSlug]);

  if (loading) return null;

  // Not logged in
  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium">Materiais do produto</span>
        </div>
        <p className="text-sm text-muted-foreground">
          <Link to="/login" className="text-primary hover:underline font-medium">
            Entre com o seu email
          </Link>{" "}
          para acessar os materiais da sua compra.
        </p>
      </div>
    );
  }

  // Logged in but no purchase
  if (!hasPurchase) {
    return null;
  }

  // Has purchase but no deliverables yet
  if (deliverables.length === 0) {
    return (
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-2">
        <span className="text-sm font-semibold text-primary">Produto comprado!</span>
        <p className="text-sm text-muted-foreground">
          Os materiais serão disponibilizados em breve.
        </p>
      </div>
    );
  }

  // Has purchase + deliverables
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 space-y-3">
      <span className="text-sm font-semibold text-primary">Seus materiais</span>
      <ul className="space-y-2">
        {deliverables.map((d) => (
          <li key={d.id}>
            <a
              href={d.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" />
              {d.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductDeliverables;
