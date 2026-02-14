
-- Tabela de compras (vinculada ao email do comprador)
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_email TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  hotmart_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para buscar compras por email
CREATE INDEX idx_purchases_buyer_email ON public.purchases (buyer_email);
CREATE UNIQUE INDEX idx_purchases_transaction ON public.purchases (hotmart_transaction_id) WHERE hotmart_transaction_id IS NOT NULL;

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Usuários autenticados podem ver apenas suas próprias compras (por email)
CREATE POLICY "Users can view own purchases"
ON public.purchases
FOR SELECT
TO authenticated
USING (buyer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Service role pode inserir (webhook)
CREATE POLICY "Service role can insert purchases"
ON public.purchases
FOR INSERT
TO service_role
WITH CHECK (true);

-- Tabela de entregáveis (admin cadastra)
CREATE TABLE public.deliverables (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  label TEXT NOT NULL,
  file_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_deliverables_product_slug ON public.deliverables (product_slug);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa autenticada pode ver entregáveis (controle é feito por ter a compra)
CREATE POLICY "Authenticated users can view deliverables"
ON public.deliverables
FOR SELECT
TO authenticated
USING (true);

-- Service role pode gerenciar
CREATE POLICY "Service role can manage deliverables"
ON public.deliverables
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Storage bucket para arquivos de entregáveis
INSERT INTO storage.buckets (id, name, public) VALUES ('deliverables', 'deliverables', true);

CREATE POLICY "Anyone can read deliverables files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'deliverables');

CREATE POLICY "Service role can upload deliverables"
ON storage.objects
FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'deliverables');
