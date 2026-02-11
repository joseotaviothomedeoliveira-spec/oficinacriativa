import { Link } from "react-router-dom";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link
      to={`/p/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg animate-fade-in"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={product.coverImageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h2 className="text-base font-semibold text-card-foreground leading-snug">
          {product.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {product.shortDescription}
        </p>
        <p className="mt-3 text-lg font-bold text-price">{product.priceText}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
