import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

// Fetch products from database, with static fallback
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error || !data || data.length === 0) {
        // Fallback to static products
        const { getProducts } = await import("@/data/products");
        setProducts(getProducts());
      } else {
        setProducts(
          data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            priceText: row.price_text,
            shortDescription: row.short_description,
            description: row.description,
            coverImageUrl: row.cover_image_url,
            galleryImageUrls: (row.gallery_image_urls as string[]) || [],
            benefits: (row.benefits as string[]) || [],
            faqs: (row.faqs as Array<{ q: string; a: string }>) || [],
            hotmartCheckoutUrl: row.hotmart_checkout_url,
            wistiaMediaId: row.wistia_media_id || undefined,
            wistiaAspect: row.wistia_aspect || undefined,
            wistiaMediaId2: row.wistia_media_id2 || undefined,
            wistiaAspect2: row.wistia_aspect2 || undefined,
            videoDividerText: row.video_divider_text || undefined,
            drivePreviewFolderId: row.drive_preview_folder_id || undefined,
          }))
        );
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { products, loading };
}

export async function getProductBySlugFromDB(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    // Fallback to static
    const { getProductBySlug } = await import("@/data/products");
    return getProductBySlug(slug);
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    priceText: data.price_text,
    shortDescription: data.short_description,
    description: data.description,
    coverImageUrl: data.cover_image_url,
    galleryImageUrls: (data.gallery_image_urls as string[]) || [],
    benefits: (data.benefits as string[]) || [],
    faqs: (data.faqs as Array<{ q: string; a: string }>) || [],
    hotmartCheckoutUrl: data.hotmart_checkout_url,
    wistiaMediaId: data.wistia_media_id || undefined,
    wistiaAspect: data.wistia_aspect || undefined,
    wistiaMediaId2: data.wistia_media_id2 || undefined,
    wistiaAspect2: data.wistia_aspect2 || undefined,
    videoDividerText: data.video_divider_text || undefined,
    drivePreviewFolderId: data.drive_preview_folder_id || undefined,
  };
}
