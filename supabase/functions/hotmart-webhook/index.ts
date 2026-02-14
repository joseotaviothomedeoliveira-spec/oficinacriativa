import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase env vars");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    console.log("Hotmart webhook payload:", JSON.stringify(body));

    // Hotmart sends different event types
    const event = body.event || body.data?.event || "";
    
    // Extract buyer info - Hotmart webhook v2 structure
    const buyerEmail =
      body.data?.buyer?.email ||
      body.buyer?.email ||
      body.data?.buyer?.checkout_phone ||
      "";

    const productName =
      body.data?.product?.name ||
      body.product?.name ||
      "";

    const transactionId =
      body.data?.purchase?.transaction ||
      body.purchase?.transaction ||
      body.data?.transaction ||
      "";

    if (!buyerEmail) {
      console.error("No buyer email found in webhook payload");
      return new Response(JSON.stringify({ error: "No buyer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Map product name to slug
    const slugMap: Record<string, string> = {
      "+5000 Atividades": "5000-atividades",
      "Kit Completo da Alfabetização": "kit-completo-alfabetizacao",
      "Kit Sala de Aula em 1 Hora": "kit-sala-de-aula-1-hora",
      "Moldes Novos Todos os Meses": "moldes-novos-todos-os-meses",
      "Painel das Palavras": "painel-das-palavras",
      "Palavras Escondidas": "palavras-escondidas",
    };

    const productSlug = slugMap[productName] || productName.toLowerCase().replace(/\s+/g, "-");

    // Only process purchase approved events
    const isApproved =
      event === "PURCHASE_APPROVED" ||
      event === "purchase.approved" ||
      body.status === "approved";

    if (!isApproved) {
      console.log(`Ignoring event: ${event}`);
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert purchase (ignore duplicates by transaction id)
    const emailNorm = buyerEmail.toLowerCase().trim();
    const txId = transactionId || null;

    // Check if already exists
    if (txId) {
      const { data: existing } = await supabase
        .from("purchases")
        .select("id")
        .eq("hotmart_transaction_id", txId)
        .limit(1);
      if (existing && existing.length > 0) {
        return new Response(JSON.stringify({ ok: true, duplicate: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { error } = await supabase.from("purchases").insert({
      buyer_email: emailNorm,
      product_slug: productSlug,
      product_name: productName,
      hotmart_transaction_id: txId,
      status: "approved",
    });

    if (error) {
      console.error("Error inserting purchase:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`Purchase recorded: ${buyerEmail} -> ${productSlug}`);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
