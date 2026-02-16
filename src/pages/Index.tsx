import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles } from "lucide-react";
import assistenteLogo from "@/assets/assistente-logo.png";
import { useEffect, useState } from "react";
import { getProducts } from "@/data/products";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const allProducts = getProducts();
  const { user } = useAuth();
  const [sortedProducts, setSortedProducts] = useState<Product[]>(allProducts);

  useEffect(() => {
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
  }, [user]);

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

          <div className="relative h-14 w-14 shrink-0 transition-transform group-hover:scale-105">
            <img src={assistenteLogo} alt="Assistente Pedagógico" className="h-full w-full object-contain" />
          </div>
          <div className="relative flex-1">
            <span className="flex items-center gap-2 text-sm font-bold text-foreground">
              Acesse o Assistente Pedagógico
              <Sparkles className="h-3.5 w-3.5 text-[hsl(217,91%,60%)]" />
            </span>
            <p className="text-xs text-muted-foreground">Tire dúvidas e receba sugestões personalizadas</p>
          </div>
        </Link>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">Produtos</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Escolha um produto para ver os detalhes
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Index;