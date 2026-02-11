/**
 * DADOS MOCKADOS DE PRODUTOS
 *
 * Para migrar para Firestore:
 * 1. Crie uma coleção "products" no Firestore
 * 2. Cada documento deve ter os campos abaixo (mesma estrutura)
 * 3. Troque a função getProducts() / getProductBySlug() para buscar do Firestore
 *    Exemplo:
 *      import { collection, getDocs, query, where } from 'firebase/firestore';
 *      import { db } from '@/lib/firebase';
 *
 *      export async function getProducts(): Promise<Product[]> {
 *        const snapshot = await getDocs(collection(db, 'products'));
 *        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
 *      }
 *
 *      export async function getProductBySlug(slug: string): Promise<Product | undefined> {
 *        const q = query(collection(db, 'products'), where('slug', '==', slug));
 *        const snapshot = await getDocs(q);
 *        if (snapshot.empty) return undefined;
 *        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
 *      }
 */

// ---- IMAGENS: troque os imports abaixo pelas suas imagens reais ----
import coverImage from "@/assets/product-cover.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export interface FAQ {
  q: string;
  a: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  priceText: string;
  shortDescription: string;
  description: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  benefits: string[];
  faqs: FAQ[];
  hotmartCheckoutUrl: string;
}

// ---- PRODUTOS MOCKADOS ----
// Para adicionar novos produtos, basta duplicar o objeto abaixo e alterar os campos.
export const products: Product[] = [
  {
    id: "1",
    slug: "kit-moldes-eva-teste",
    name: "Kit 5.000 Moldes de EVA (Teste)",
    priceText: "\u20AC9,90",
    shortDescription: "Mais de 5.000 moldes prontos para imprimir e usar.",
    description:
      "O Kit 5.000 Moldes de EVA reune a maior colecao de moldes digitais para artesanato em EVA disponivel online. Sao mais de 5.000 modelos organizados por categoria: letras, numeros, animais, flores, personagens, datas comemorativas e muito mais. Todos os arquivos estao em alta resolucao, prontos para imprimir em qualquer impressora comum. Ideal para professoras, artesas, decoradoras de festas e maes que querem criar pecas incriveis sem precisar desenhar. Basta baixar, imprimir, recortar o molde e transferir para o EVA. Acesso imediato apos a compra, com atualizacoes gratuitas.",
    // ---- IMAGENS: troque pelos seus URLs ou imports reais ----
    coverImageUrl: coverImage,
    galleryImageUrls: [coverImage, gallery1, gallery2, gallery3, gallery4],
    benefits: [
      "Economize tempo com moldes prontos",
      "Letras e numeros perfeitos",
      "Mais de 5.000 modelos variados",
      "Imprima quantas vezes quiser",
      "Organizados por categoria",
      "Atualizacoes gratuitas incluidas",
    ],
    faqs: [
      {
        q: "Como recebo o material?",
        a: "Apos a confirmacao do pagamento, voce recebe acesso imediato por e-mail com o link para download.",
      },
      {
        q: "Posso imprimir em qualquer impressora?",
        a: "Sim, os moldes estao em formato PDF e podem ser impressos em qualquer impressora comum.",
      },
      {
        q: "Os moldes servem para que tamanho de EVA?",
        a: "Os moldes vem em tamanho real, mas voce pode ajustar a escala na hora de imprimir.",
      },
      {
        q: "Tem garantia?",
        a: "Sim, voce tem 7 dias de garantia incondicional. Se nao gostar, devolvemos seu dinheiro.",
      },
    ],
    hotmartCheckoutUrl:
      "https://pay.hotmart.com/I103359542I?checkoutMode=2",
  },
];

// ---- FUNÇÕES DE ACESSO (troque aqui para Firestore) ----

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
