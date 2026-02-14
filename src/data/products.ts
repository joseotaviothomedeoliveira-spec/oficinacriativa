/**
 * DADOS DE PRODUTOS
 *
 * Para migrar para Firestore:
 * 1. Crie uma coleção "products" no Firestore
 * 2. Cada documento deve ter os campos abaixo (mesma estrutura)
 * 3. Troque a função getProducts() / getProductBySlug() para buscar do Firestore
 */

import img5000Atividades from "@/assets/product-5000-atividades.png";
import imgKitAlfabetizacao from "@/assets/product-kit-alfabetizacao.png";
import imgSalaAula from "@/assets/product-sala-aula.png";
import imgMoldesNovos from "@/assets/product-moldes-novos.png";
import imgPainelPalavras from "@/assets/product-painel-palavras.png";
import imgPalavrasEscondidas from "@/assets/product-palavras-escondidas.png";
import imgMoldesEva from "@/assets/product-moldes-eva.png";

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
  wistiaMediaId?: string;
  wistiaAspect?: string;
}

export const products: Product[] = [
  {
    id: "1",
    slug: "5000-atividades",
    name: "+5000 Atividades",
    priceText: "€10,00",
    wistiaMediaId: "kfrilcm89f",
    wistiaAspect: "0.75",
    shortDescription:
      "Mais de 5.000 atividades prontas a imprimir para todas as situações educativas.",
    description:
      "Descobre a solução completa para poupar horas de trabalho e ter atividades prontas para todas as situações educativas.\n\nPor apenas 37 €, tens acesso imediato a uma biblioteca com mais de 5.000 atividades, todas prontas a imprimir e usar.\n\nIdeal para professores, pais e educadores.\n\nO que vais receber:\n- Mais de 5.000 atividades organizadas\n- Recursos prontos a usar\n- Economia de tempo\n\nApós a compra, acesso imediato ao material.",
    coverImageUrl: img5000Atividades,
    galleryImageUrls: [img5000Atividades],
    benefits: [
      "Mais de 5.000 atividades organizadas",
      "Prontas a imprimir e usar",
      "Ideal para professores e pais",
      "Economia de horas de trabalho",
      "Acesso imediato após a compra",
      "Material para todas as situações educativas",
    ],
    faqs: [
      { q: "Como recebo o material?", a: "Após a confirmação do pagamento, recebes acesso imediato por e-mail." },
      { q: "Posso imprimir quantas vezes quiser?", a: "Sim, podes imprimir todas as atividades sem limite." },
      { q: "Serve para que faixa etária?", a: "O material abrange diversas faixas etárias, do pré-escolar ao ensino básico." },
      { q: "Tem garantia?", a: "Sim, tens 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/I103359542I?checkoutMode=2",
  },
  {
    id: "2",
    slug: "kit-completo-alfabetizacao",
    name: "Kit Completo da Alfabetização",
    priceText: "€7,00",
    shortDescription:
      "Material completo para ensinar leitura e escrita de forma prática e divertida.",
    description:
      "Material completo para ensinar leitura e escrita de forma prática e divertida.\n\nInclui:\n- Reconhecimento de letras e sílabas\n- Leitura fluente\n- Coordenação motora\n- Exercícios interativos\n\nIdeal para pais e educadores.",
    coverImageUrl: imgKitAlfabetizacao,
    galleryImageUrls: [imgKitAlfabetizacao],
    benefits: [
      "Reconhecimento de letras e sílabas",
      "Exercícios de leitura fluente",
      "Desenvolvimento da coordenação motora",
      "Exercícios interativos incluídos",
      "Ideal para pais e educadores",
      "Pronto a imprimir",
    ],
    faqs: [
      { q: "Para que idade é indicado?", a: "Ideal para crianças em fase de alfabetização, dos 4 aos 7 anos." },
      { q: "Como recebo?", a: "Acesso imediato por e-mail após a compra." },
      { q: "Posso usar em sala de aula?", a: "Sim, o material é perfeito para uso em casa ou na escola." },
      { q: "Tem garantia?", a: "Sim, 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/L102314316U?checkoutMode=2&off=apbz9nqw",
  },
  {
    id: "3",
    slug: "kit-sala-de-aula-1-hora",
    name: "Kit Sala de Aula em 1 Hora",
    priceText: "€3,90",
    shortDescription:
      "Modelos prontos de mural, calendário e decoração para montar a sala rapidamente.",
    description:
      "Modelos prontos de mural, calendário, painel de boas-vindas e decoração essencial para montar a sala rapidamente.\n\nPrático, organizado e pronto para imprimir.",
    coverImageUrl: imgSalaAula,
    galleryImageUrls: [imgSalaAula],
    benefits: [
      "Modelos prontos de mural",
      "Calendário escolar incluído",
      "Painel de boas-vindas",
      "Decoração essencial completa",
      "Prático e organizado",
      "Pronto para imprimir",
    ],
    faqs: [
      { q: "O que está incluído?", a: "Mural, calendário, painel de boas-vindas e decoração essencial." },
      { q: "Posso personalizar?", a: "Sim, os modelos são editáveis para adaptares à tua sala." },
      { q: "Como recebo?", a: "Acesso imediato por e-mail após a compra." },
      { q: "Tem garantia?", a: "Sim, 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/W104304323F?checkoutMode=2&off=cthtqi23",
  },
  {
    id: "4",
    slug: "moldes-novos-todos-os-meses",
    name: "Moldes Novos Todos os Meses",
    priceText: "€3,90",
    shortDescription:
      "Receba novos moldes todos os meses para manter as atividades atualizadas.",
    description:
      "Receba novos moldes adicionados todos os meses para manter suas atividades atualizadas.\n\nMaterial novo pronto para imprimir durante todo o ano.\n\nIdeal para professoras que querem variedade sem complicação.",
    coverImageUrl: imgMoldesNovos,
    galleryImageUrls: [imgMoldesNovos],
    benefits: [
      "Novos moldes todos os meses",
      "Material sempre atualizado",
      "Pronto para imprimir",
      "Variedade sem complicação",
      "Ideal para professoras",
      "Acesso contínuo",
    ],
    faqs: [
      { q: "Como recebo os novos moldes?", a: "Os novos moldes são adicionados automaticamente à tua área de acesso." },
      { q: "Com que frequência são atualizados?", a: "Novos moldes são adicionados mensalmente." },
      { q: "Posso imprimir tudo?", a: "Sim, sem limite de impressões." },
      { q: "Tem garantia?", a: "Sim, 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/X104304560X?checkoutMode=2",
  },
  {
    id: "5",
    slug: "painel-das-palavras",
    name: "Painel das Palavras",
    priceText: "€5,00",
    shortDescription:
      "Material educativo completo para ajudar crianças a aprenderem a ler com facilidade.",
    description:
      "Material educativo completo para ajudar as crianças a aprenderem a ler com facilidade.\n\nDesenvolve:\n- Reconhecimento de sons\n- Formação de palavras\n- Leitura fluente\n- Coordenação motora\n\nInclui guia ilustrado passo a passo.",
    coverImageUrl: imgPainelPalavras,
    galleryImageUrls: [imgPainelPalavras],
    benefits: [
      "Reconhecimento de sons",
      "Formação de palavras",
      "Leitura fluente",
      "Desenvolvimento da coordenação motora",
      "Guia ilustrado passo a passo",
      "Pronto a imprimir",
    ],
    faqs: [
      { q: "Para que idade é indicado?", a: "Ideal para crianças dos 4 aos 7 anos." },
      { q: "Como recebo?", a: "Acesso imediato por e-mail após a compra." },
      { q: "Inclui instruções?", a: "Sim, inclui guia ilustrado passo a passo." },
      { q: "Tem garantia?", a: "Sim, 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/O102313182J?checkoutMode=2",
  },
  {
    id: "6",
    slug: "palavras-escondidas",
    name: "Palavras Escondidas",
    priceText: "€5,00",
    shortDescription:
      "Atividade divertida para as crianças descobrirem palavras dentro de letras e sílabas.",
    description:
      "A atividade Palavras Escondidas foi criada para tornar a aprendizagem da leitura muito mais divertida.\n\nAs crianças vão adorar procurar e descobrir palavras dentro das letras e sílabas, desenvolvendo atenção, concentração e reconhecimento visual.\n\nIdeal para trabalhar vocabulário, leitura e coordenação motora. Perfeita para imprimir e usar em sala de aula ou em casa.",
    coverImageUrl: imgPalavrasEscondidas,
    galleryImageUrls: [imgPalavrasEscondidas],
    benefits: [
      "Estimula a leitura de forma lúdica",
      "Ajuda na memorização das palavras",
      "Promove raciocínio e concentração",
      "Pronta para imprimir e usar imediatamente",
    ],
    faqs: [
      { q: "Para que idade é indicado?", a: "Ideal para crianças em fase de alfabetização, dos 4 aos 7 anos." },
      { q: "Como recebo?", a: "Acesso imediato por e-mail após a compra." },
      { q: "Posso usar em sala de aula?", a: "Sim, é perfeito para uso em sala de aula ou em casa." },
      { q: "Tem garantia?", a: "Sim, 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/J102380393P?checkoutMode=2",
    wistiaMediaId: "hqc0ir1wq6",
    wistiaAspect: "0.5625",
  },
  {
    id: "7",
    slug: "5000-moldes-eva",
    name: "+5000 Moldes de EVA",
    priceText: "€10,00",
    shortDescription:
      "Mais de 5.000 moldes de EVA prontos para imprimir e usar em atividades criativas.",
    description:
      "A maior coleção de moldes de EVA que você vai encontrar! São mais de 5.000 modelos prontos para imprimir, recortar e criar.\n\nIdeal para professoras, artesãs e mães que querem atividades criativas sem complicação.\n\nO que está incluído:\n- Mais de 5.000 moldes organizados por tema\n- Prontos para imprimir em qualquer impressora\n- Variedade de tamanhos e estilos\n- Acesso imediato após a compra",
    coverImageUrl: imgMoldesEva,
    galleryImageUrls: [imgMoldesEva],
    benefits: [
      "Mais de 5.000 moldes de EVA",
      "Organizados por tema",
      "Prontos para imprimir",
      "Variedade de tamanhos e estilos",
      "Ideal para professoras e artesãs",
      "Acesso imediato",
    ],
    faqs: [
      { q: "Como recebo os moldes?", a: "Após a confirmação do pagamento, recebes acesso imediato por e-mail." },
      { q: "Posso imprimir quantas vezes quiser?", a: "Sim, podes imprimir todos os moldes sem limite." },
      { q: "Serve para que tipo de trabalho?", a: "Ideal para atividades escolares, decoração, artesanato e projetos criativos." },
      { q: "Tem garantia?", a: "Sim, tens 7 dias de garantia incondicional." },
    ],
    hotmartCheckoutUrl: "https://pay.hotmart.com/N104202645J?off=nj0lu8n9&checkoutMode=2",
  },
];

export function getProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
