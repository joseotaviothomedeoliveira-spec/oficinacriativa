import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles, MessageCircle, Loader2 } from "lucide-react";
import assistenteLogo from "@/assets/assistente-logo.png";
import { useEffect, useState } from "react";
import type { Product } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useTrackPageView } from "@/hooks/useTrackEvent";

const Index = () => {
  const { products: allProducts, loading: productsLoading } = useProducts();
  const { user } = useAuth();
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  useTrackPageView("/");

  useEffect(() => {
    if (productsLoading || allProducts.length === 0) return;

    if (!user) {
      setSortedProducts(allProducts);
      return;
    }

    const fetchPurchases = async () => {
      const { data } = await supabase
        .from("purchases")
        .select("product_slug");

      if (data && data.length > 0) {
        const purchasedSlugs = new Set(data.map((p) => p.product_slug));
        const purchased = allProducts.filter((p) => purchasedSlugs.has(p.slug));
        const notPurchased = allProducts.filter((p) => !purchasedSlugs.has(p.slug));
        setSortedProducts([...purchased, ...notPurchased]);
      } else {
        setSortedProducts(allProducts);
      }
    };

    fetchPurchases();
  }, [user, allProducts, productsLoading]);

  return (
    <>
      <Helmet>
        <title>Oficina Criativa — Materiais e ofertas digitais</title>
        <meta
          name="description"
          content="Acesse seus materiais e ofertas digitais na Oficina Criativa. Produtos digitais com acesso imediato."
        />
      </Helmet>

      <main className="container py-8">
        <Link
          to="/assistente"
          className="group relative mb-6 flex items-center gap-4 overflow-hidden rounded-2xl border border-[hsl(217,91%,60%)]/30 p-5 transition-all hover:border-[hsl(217,91%,60%)]/50 hover:shadow-lg hover:shadow-[hsl(217,91%,60%)]/10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(217,91%,60%)]/10 via-[hsl(217,91%,60%)]/5 to-[hsl(217,91%,70%)]/10" />
          <div className="absolute -top-8 -left-8 h-32 w-32 rounded-full bg-[hsl(217,91%,60%)]/20 blur-3xl" />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-[hsl(217,91%,70%)]/20 blur-3xl" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />

          <div className="relative h-14 w-14 shrink-0 -my-1 transition-transform group-hover:scale-105">
            <img src={assistenteLogo} alt="Assistente Pedagógico" className="h-full w-full scale-150 object-contain" />
          </div>
          <div className="relative flex-1">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              Acesse o Assistente Pedagógico
              <Sparkles className="h-3.5 w-3.5 text-[hsl(217,91%,60%)]" />
            </span>
            <p className="text-xs text-muted-foreground">Tire dúvidas e receba sugestões personalizadas</p>
          </div>
        </Link>

        {user && (
          <a
            href="https://chat.whatsapp.com/FIqC3KR2gVgCImH4hbMtDa"
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-6 flex items-center gap-4 rounded-2xl border border-[hsl(142,70%,45%)]/30 bg-[hsl(142,70%,45%)]/5 p-5 transition-all hover:border-[hsl(142,70%,45%)]/50 hover:shadow-lg hover:shadow-[hsl(142,70%,45%)]/10"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[hsl(142,70%,45%)]/15 transition-transform group-hover:scale-105">
              <MessageCircle className="h-7 w-7 text-[hsl(142,70%,45%)]" />
            </div>
            <div className="flex-1">
              <span className="flex items-center gap-2 text-sm font-bold text-foreground">
                Grupo da Oficina Criativa no WhatsApp
              </span>
              <p className="text-xs text-muted-foreground">Entre no grupo e fique por dentro das novidades</p>
            </div>
          </a>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Produtos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha um produto para ver os detalhes
          </p>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Index;
