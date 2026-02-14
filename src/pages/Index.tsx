import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { GraduationCap } from "lucide-react";
import { getProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const products = getProducts();

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
          to="/assistente-pedagogico"
          className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-semibold text-foreground">Acesse o Assistente Pedagógico</span>
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
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Index;
