import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

// Simple email regex
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- 1. Verify Hotmart signature ---
    const HOTTOK = Deno.env.get("HOTMART_HOTTOK");
    if (!HOTTOK) {
      console.error("HOTMART_HOTTOK secret not configured");
      return new Response(JSON.stringify({ error: "Server misconfigured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const receivedToken = req.headers.get("x-hotmart-hottok");
    if (!receivedToken || receivedToken !== HOTTOK) {
      console.error("Invalid or missing Hottok token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- 2. Parse & validate body ---
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase env vars");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    console.log("Hotmart webhook received");

    const event = body.event || body.data?.event || "";

    // Extract & validate buyer email
    const rawEmail =
      body.data?.buyer?.email ||
      body.buyer?.email ||
      "";

    if (!rawEmail || typeof rawEmail !== "string") {
      return new Response(JSON.stringify({ error: "No buyer email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailNorm = rawEmail.toLowerCase().trim().slice(0, 255);
    if (!EMAIL_RE.test(emailNorm)) {
      return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract & validate product name
    const rawProductName =
      body.data?.product?.name ||
      body.product?.name ||
      "";

    if (!rawProductName || typeof rawProductName !== "string") {
      return new Response(JSON.stringify({ error: "No product name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const productName = rawProductName.slice(0, 200);

    // Extract & validate transaction id
    const rawTxId =
      body.data?.purchase?.transaction ||
      body.purchase?.transaction ||
      body.data?.transaction ||
      "";
    const transactionId = typeof rawTxId === "string" ? rawTxId.slice(0, 100) : "";

    // Map product name to slug
    const slugMap: Record<string, string> = {
      "+5000 Atividades": "5000-atividades",
      "Kit Completo da Alfabetização": "kit-completo-alfabetizacao",
      "Kit Sala de Aula em 1 Hora": "kit-sala-de-aula-1-hora",
      "Moldes Novos Todos os Meses": "moldes-novos-todos-os-meses",
      "Painel das Palavras": "painel-das-palavras",
      "Palavras Escondidas": "palavras-escondidas",
      "+5000 Moldes de EVA": "5000-moldes-eva",
    };

    const productSlug = slugMap[productName] || sanitizeSlug(productName);

    // --- 3. Only process purchase approved events ---
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

    // --- 4. Insert purchase (deduplicate by transaction id) ---
    const txId = transactionId || null;

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

    console.log(`Purchase recorded: ${emailNorm} -> ${productSlug}`);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
