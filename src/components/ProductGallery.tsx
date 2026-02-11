import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = ({ images, productName }: ProductGalleryProps) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <img
          src={images[selected]}
          alt={`${productName} - imagem ${selected + 1}`}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
              i === selected
                ? "border-primary"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <img
              src={img}
              alt={`${productName} - miniatura ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
