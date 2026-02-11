import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductBenefits from "@/components/ProductBenefits";
import ProductFAQ from "@/components/ProductFAQ";
import HotmartButton from "@/components/HotmartButton";
import WistiaVideo from "@/components/WistiaVideo";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || "");

  if (!product) {
    return (
      <main className="container py-16 text-center">
        <h2 className="text-xl font-semibold text-foreground">Produto nao encontrado</h2>
        <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
          Voltar para a loja
        </Link>
      </main>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} — Oficina Criativa</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <main className="container py-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Galeria */}
          <div className="animate-fade-in">
            <ProductGallery images={product.galleryImageUrls} productName={product.name} />
          </div>

          {/* Info */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-price">{product.priceText}</span>
            </div>

            <HotmartButton checkoutUrl={product.hotmartCheckoutUrl} />

            <div className="rounded-lg border border-border bg-card p-5">
              <ProductBenefits benefits={product.benefits} />
            </div>

            <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
              {product.description}
            </div>

            <ProductFAQ faqs={product.faqs} />
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
