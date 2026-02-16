import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getProductBySlugFromDB } from "@/hooks/useProducts";
import type { Product } from "@/data/products";
import ProductGallery from "@/components/ProductGallery";
import ProductBenefits from "@/components/ProductBenefits";
import ProductFAQ from "@/components/ProductFAQ";
import HotmartButton from "@/components/HotmartButton";
import WistiaVideo from "@/components/WistiaVideo";
import ProductDeliverables from "@/components/ProductDeliverables";
import DrivePreview from "@/components/DrivePreview";
import { useTrackPageView } from "@/hooks/useTrackEvent";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [hasPurchase, setHasPurchase] = useState(false);
  useTrackPageView(`/p/${slug}`);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getProductBySlugFromDB(slug || "").then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <main className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

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

            {!hasPurchase && (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-price">{product.priceText}</span>
              </div>
            )}

            <ProductDeliverables
              productSlug={product.slug}
              onPurchaseStatusChange={setHasPurchase}
            />

            {!hasPurchase && (
              <HotmartButton checkoutUrl={product.hotmartCheckoutUrl} />
            )}

            <div className="rounded-lg border border-border bg-card p-5">
              <ProductBenefits benefits={product.benefits} />
            </div>

            {product.wistiaMediaId && (
              <WistiaVideo mediaId={product.wistiaMediaId} aspect={product.wistiaAspect || "0.5625"} />
            )}

            {product.videoDividerText && (
              <h3 className="text-lg font-semibold text-foreground">{product.videoDividerText}</h3>
            )}

            {product.wistiaMediaId2 && (
              <WistiaVideo mediaId={product.wistiaMediaId2} aspect={product.wistiaAspect2 || "0.5625"} />
            )}

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
