import { Helmet } from "react-helmet-async";
import { getProducts } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const Index = () => {
  const products = getProducts();

  return (
    <>
      <Helmet>
        <title>Vetrina+ — Materiais e ofertas digitais</title>
        <meta
          name="description"
          content="Acesse seus materiais e ofertas digitais na Vetrina+. Produtos digitais com acesso imediato."
        />
      </Helmet>

      <main className="container py-8">
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
