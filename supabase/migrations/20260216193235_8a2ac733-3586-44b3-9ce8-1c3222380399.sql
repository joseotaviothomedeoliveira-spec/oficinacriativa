
-- Create products table for admin-managed products
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price_text TEXT NOT NULL DEFAULT '€0,00',
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  gallery_image_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  hotmart_checkout_url TEXT NOT NULL DEFAULT '',
  wistia_media_id TEXT,
  wistia_aspect TEXT,
  wistia_media_id2 TEXT,
  wistia_aspect2 TEXT,
  video_divider_text TEXT,
  drive_preview_folder_id TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Everyone can read active products
CREATE POLICY "Anyone can view active products"
ON public.products
FOR SELECT
USING (is_active = true);

-- Admins can do everything
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_products_updated_at();

-- Insert existing products
INSERT INTO public.products (slug, name, price_text, short_description, description, cover_image_url, gallery_image_urls, benefits, faqs, hotmart_checkout_url, wistia_media_id, wistia_aspect, wistia_media_id2, wistia_aspect2, video_divider_text, drive_preview_folder_id, sort_order) VALUES
('5000-atividades', '+5000 Atividades', '€10,00', 'Mais de 5.000 atividades prontas a imprimir para todas as situações educativas.', E'Descobre a solução completa para poupar horas de trabalho e ter atividades prontas para todas as situações educativas.\n\nPor apenas 10 €, tens acesso imediato a uma biblioteca com mais de 5.000 atividades, todas prontas a imprimir e usar.\n\nIdeal para professores, pais e educadores.\n\nO que vais receber:\n- Mais de 5.000 atividades organizadas\n- Recursos prontos a usar\n- Economia de tempo\n\nApós a compra, acesso imediato ao material.', '/product-images/5000-atividades.png', '[]'::jsonb, '["Mais de 5.000 atividades organizadas","Prontas a imprimir e usar","Ideal para professores e pais","Economia de horas de trabalho","Acesso imediato após a compra","Material para todas as situações educativas"]'::jsonb, '[{"q":"Como recebo o material?","a":"Após a confirmação do pagamento, recebes acesso imediato por e-mail."},{"q":"Posso imprimir quantas vezes quiser?","a":"Sim, podes imprimir todas as atividades sem limite."},{"q":"Serve para que faixa etária?","a":"O material abrange diversas faixas etárias, do pré-escolar ao ensino básico."},{"q":"Tem garantia?","a":"Sim, tens 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/I103359542I?checkoutMode=2', 'kfrilcm89f', '0.75', NULL, NULL, NULL, '1-ID5tqsYjXzOy1e--dy2PIWyirmEIcIl', 1),
('kit-completo-alfabetizacao', 'Kit Completo da Alfabetização', '€10,00', 'Material completo para ensinar leitura e escrita de forma prática e divertida.', E'O Kit Completo da Alfabetização foi desenvolvido para professoras que desejam tornar o processo de leitura mais leve, prático e envolvente para as crianças.', '/product-images/kit-alfabetizacao.png', '[]'::jsonb, '["Material pronto para imprimir","Visual colorido que prende a atenção","Atividades manipulativas e lúdicas","Facilita o planejamento das aulas","Pode ser usado o ano inteiro","Ajuda a acelerar o processo de alfabetização"]'::jsonb, '[{"q":"Para que idade é indicado?","a":"Ideal para crianças em fase de alfabetização, dos 4 aos 7 anos."},{"q":"Como recebo?","a":"Acesso imediato por e-mail após a compra."},{"q":"Posso usar em sala de aula?","a":"Sim, o material é perfeito para uso em casa ou na escola."},{"q":"Tem garantia?","a":"Sim, 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/L102314316U?checkoutMode=2&off=4qem0af6', 'wokphhfz63', '0.5625', 'ys9jtv5vcm', '0.5625', 'Veja como as Atividades Funcionam:', NULL, 2),
('kit-sala-de-aula-1-hora', 'Kit Sala de Aula em 1 Hora', '€3,90', 'Modelos prontos de mural, calendário e decoração para montar a sala rapidamente.', E'Modelos prontos de mural, calendário, painel de boas-vindas e decoração essencial para montar a sala rapidamente.\n\nPrático, organizado e pronto para imprimir.', '/product-images/sala-aula.png', '[]'::jsonb, '["Modelos prontos de mural","Calendário escolar incluído","Painel de boas-vindas","Decoração essencial completa","Prático e organizado","Pronto para imprimir"]'::jsonb, '[{"q":"O que está incluído?","a":"Mural, calendário, painel de boas-vindas e decoração essencial."},{"q":"Posso personalizar?","a":"Sim, os modelos são editáveis para adaptares à tua sala."},{"q":"Como recebo?","a":"Acesso imediato por e-mail após a compra."},{"q":"Tem garantia?","a":"Sim, 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/W104304323F?checkoutMode=2&off=cthtqi23', NULL, NULL, NULL, NULL, NULL, NULL, 3),
('moldes-novos-todos-os-meses', 'Moldes Novos Todos os Meses', '€3,90', 'Receba novos moldes todos os meses para manter as atividades atualizadas.', E'Receba novos moldes adicionados todos os meses para manter suas atividades atualizadas.\n\nMaterial novo pronto para imprimir durante todo o ano.\n\nIdeal para professoras que querem variedade sem complicação.', '/product-images/moldes-novos.png', '[]'::jsonb, '["Novos moldes todos os meses","Material sempre atualizado","Pronto para imprimir","Variedade sem complicação","Ideal para professoras","Acesso contínuo"]'::jsonb, '[{"q":"Como recebo os novos moldes?","a":"Os novos moldes são adicionados automaticamente à tua área de acesso."},{"q":"Com que frequência são atualizados?","a":"Novos moldes são adicionados mensalmente."},{"q":"Posso imprimir tudo?","a":"Sim, sem limite de impressões."},{"q":"Tem garantia?","a":"Sim, 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/X104304560X?checkoutMode=2', NULL, NULL, NULL, NULL, NULL, NULL, 4),
('painel-das-palavras', 'Painel das Palavras', '€3,90', 'Material educativo completo para ajudar crianças a aprenderem a ler com facilidade.', E'Material educativo completo para ajudar as crianças a aprenderem a ler com facilidade.\n\nDesenvolve:\n- Reconhecimento de sons\n- Formação de palavras\n- Leitura fluente\n- Coordenação motora\n\nInclui guia ilustrado passo a passo.', '/product-images/painel-palavras.png', '[]'::jsonb, '["Reconhecimento de sons","Formação de palavras","Leitura fluente","Desenvolvimento da coordenação motora","Guia ilustrado passo a passo","Pronto a imprimir"]'::jsonb, '[{"q":"Para que idade é indicado?","a":"Ideal para crianças dos 4 aos 7 anos."},{"q":"Como recebo?","a":"Acesso imediato por e-mail após a compra."},{"q":"Inclui instruções?","a":"Sim, inclui guia ilustrado passo a passo."},{"q":"Tem garantia?","a":"Sim, 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/O102313182J?checkoutMode=2', 'mwp7urrfml', '0.5625', NULL, NULL, NULL, NULL, 5),
('palavras-escondidas', 'Palavras Escondidas', '€3,90', 'Atividade divertida para as crianças descobrirem palavras dentro de letras e sílabas.', E'A atividade Palavras Escondidas foi criada para tornar a aprendizagem da leitura muito mais divertida.', '/product-images/palavras-escondidas.png', '[]'::jsonb, '["Estimula a leitura de forma lúdica","Ajuda na memorização das palavras","Promove raciocínio e concentração","Pronta para imprimir e usar imediatamente"]'::jsonb, '[{"q":"Para que idade é indicado?","a":"Ideal para crianças em fase de alfabetização, dos 4 aos 7 anos."},{"q":"Como recebo?","a":"Acesso imediato por e-mail após a compra."},{"q":"Posso usar em sala de aula?","a":"Sim, é perfeito para uso em sala de aula ou em casa."},{"q":"Tem garantia?","a":"Sim, 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/J102380393P?checkoutMode=2', 'hqc0ir1wq6', '0.5625', NULL, NULL, NULL, NULL, 6),
('5000-moldes-eva', '+5000 Moldes de EVA', '€10,00', 'Mais de 5.000 moldes de EVA prontos para imprimir e usar em atividades criativas.', E'A maior coleção de moldes de EVA que você vai encontrar! São mais de 5.000 modelos prontos para imprimir, recortar e criar.\n\nIdeal para professoras, artesãs e mães que querem atividades criativas sem complicação.', '/product-images/moldes-eva.png', '[]'::jsonb, '["Mais de 5.000 moldes de EVA","Organizados por tema","Prontos para imprimir","Variedade de tamanhos e estilos","Ideal para professoras e artesãs","Acesso imediato"]'::jsonb, '[{"q":"Como recebo os moldes?","a":"Após a confirmação do pagamento, recebes acesso imediato por e-mail."},{"q":"Posso imprimir quantas vezes quiser?","a":"Sim, podes imprimir todos os moldes sem limite."},{"q":"Serve para que tipo de trabalho?","a":"Ideal para atividades escolares, decoração, artesanato e projetos criativos."},{"q":"Tem garantia?","a":"Sim, tens 7 dias de garantia incondicional."}]'::jsonb, 'https://pay.hotmart.com/N104202645J?off=nj0lu8n9&checkoutMode=2', NULL, NULL, NULL, NULL, NULL, NULL, 7);
