import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ONESIGNAL_APP_ID = "217be61a-b58a-4363-8f07-6eda597599b1";

// Messages for users who DON'T own the product (promotional)
const promoMessages: Record<string, { title: string; message: string }[]> = {
  "5000-atividades": [
    { title: "📚 +5000 Atividades prontas!", message: "Poupe horas de trabalho com atividades prontas para imprimir. Confira!" },
    { title: "✨ Sua aula pronta em minutos!", message: "São mais de 5000 atividades organizadas por tema. Acesse agora!" },
  ],
  "kit-alfabetizacao": [
    { title: "🔤 Kit Completo da Alfabetização!", message: "Tudo para ensinar leitura de forma divertida e eficaz. Conheça!" },
    { title: "📖 Alfabetize com facilidade!", message: "Exercícios interativos e divertidos para seus alunos. Veja o kit!" },
  ],
  "5000-moldes-eva": [
    { title: "🎨 +5000 Moldes de EVA!", message: "Moldes prontos para imprimir e usar em atividades criativas. Confira!" },
    { title: "✂️ Moldes lindos para suas aulas!", message: "Mais de 5000 opções de moldes de EVA organizados por tema." },
  ],
  "moldes-novos": [
    { title: "🆕 Moldes Novos Todo Mês!", message: "Receba moldes atualizados mensalmente para manter suas aulas frescas." },
    { title: "✨ Novidades em moldes!", message: "Moldes inéditos todos os meses. Confira as novidades!" },
  ],
  "painel-palavras": [
    { title: "📝 Painel das Palavras!", message: "Ajude seus alunos a lerem com facilidade usando este recurso incrível." },
    { title: "🔡 Leitura facilitada!", message: "O Painel das Palavras transforma o aprendizado em diversão!" },
  ],
  "palavras-escondidas": [
    { title: "🔍 Palavras Escondidas!", message: "Transforme a leitura em brincadeira. As crianças adoram!" },
    { title: "🎯 Atividade que engaja!", message: "Palavras Escondidas — a atividade favorita dos alunos!" },
  ],
  "kit-sala-aula": [
    { title: "🏫 Kit Sala de Aula!", message: "Murais, calendários e decoração prontos para imprimir. Monte sua sala!" },
    { title: "🎒 Prepare sua sala em 1 hora!", message: "Kit completo com tudo para decorar e organizar sua sala de aula." },
  ],
};

// Messages for users who ALREADY own the product (engagement)
const ownerMessages: Record<string, { title: string; message: string }[]> = {
  "5000-atividades": [
    { title: "📚 Já usou suas atividades hoje?", message: "Você tem +5000 atividades disponíveis. Acesse e imprima as de amanhã!" },
    { title: "💡 Dica: atividades por tema!", message: "Suas +5000 atividades estão organizadas por tema. Explore novos assuntos!" },
  ],
  "kit-alfabetizacao": [
    { title: "🔤 Continue a alfabetização!", message: "Seu Kit de Alfabetização tem exercícios novos para explorar. Acesse!" },
    { title: "📖 Progresso dos alunos!", message: "Use os exercícios do seu Kit para acompanhar a evolução da turma." },
  ],
  "5000-moldes-eva": [
    { title: "🎨 Hora de criar!", message: "Seus moldes de EVA estão esperando. Que tal uma atividade criativa amanhã?" },
    { title: "✂️ Novo projeto com EVA?", message: "Explore seus +5000 moldes e crie algo especial para a turma!" },
  ],
  "moldes-novos": [
    { title: "🆕 Novos moldes disponíveis!", message: "Seus moldes foram atualizados este mês. Confira as novidades!" },
    { title: "✨ Moldes fresquinhos!", message: "Acesse seus moldes novos e surpreenda a turma!" },
  ],
  "painel-palavras": [
    { title: "📝 Use o Painel amanhã!", message: "O Painel das Palavras é perfeito para a primeira atividade do dia!" },
    { title: "🔡 Dica de uso!", message: "Combine o Painel das Palavras com ditado para reforçar a leitura." },
  ],
  "palavras-escondidas": [
    { title: "🔍 Atividade rápida!", message: "Use Palavras Escondidas como aquecimento. Leva só 10 minutos!" },
    { title: "🎯 Revisão divertida!", message: "Palavras Escondidas é perfeito para revisar conteúdos da semana." },
  ],
  "kit-sala-aula": [
    { title: "🏫 Renove sua sala!", message: "Seu Kit Sala de Aula tem materiais para atualizar a decoração. Acesse!" },
    { title: "🎒 Calendário do mês!", message: "Já imprimiu o calendário atualizado do seu Kit? Confira!" },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ONESIGNAL_REST_API_KEY = Deno.env.get("ONESIGNAL_REST_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!ONESIGNAL_REST_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    // Check time (Brazil UTC-3)
    const now = new Date();
    const brHour = (now.getUTCHours() - 3 + 24) % 24;
    const isMorning = brHour >= 7 && brHour < 12;
    const isEvening = brHour >= 18 && brHour < 22;

    if (!isMorning && !isEvening) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: "Outside notification hours" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Pick a random product to feature
    const allSlugs = Object.keys(promoMessages);
    const featuredSlug = pickRandom(allSlugs);

    // Get emails of users who own this product
    const { data: purchases } = await supabaseAdmin
      .from("purchases")
      .select("buyer_email")
      .eq("product_slug", featuredSlug)
      .eq("status", "approved");

    const ownerEmails = new Set((purchases ?? []).map((p) => p.buyer_email));

    const results: any[] = [];

    // 1) Send PROMOTIONAL notification to non-owners (everyone except owners)
    const promoPool = promoMessages[featuredSlug] ?? [];
    if (promoPool.length > 0) {
      const promo = pickRandom(promoPool);

      // Build filters: exclude owners by external_user_id (email)
      const promoPayload: any = {
        app_id: ONESIGNAL_APP_ID,
        headings: { en: promo.title },
        contents: { en: promo.message },
        url: "https://id-preview--f3d133e2-6e88-4e1b-9d30-7bf9d5ed3846.lovable.app",
      };

      if (ownerEmails.size > 0) {
        // Send to all EXCEPT owners
        promoPayload.included_segments = ["All"];
        promoPayload.exclude_external_user_ids = Array.from(ownerEmails);
      } else {
        promoPayload.included_segments = ["All"];
      }

      const promoRes = await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify(promoPayload),
      });
      const promoData = await promoRes.json();
      console.log("Promo notification sent:", JSON.stringify(promoData));
      results.push({ type: "promo", product: featuredSlug, ...promoData });
    }

    // 2) Send ENGAGEMENT notification to owners
    if (ownerEmails.size > 0) {
      const ownerPool = ownerMessages[featuredSlug] ?? [];
      if (ownerPool.length > 0) {
        const engagement = pickRandom(ownerPool);

        const engagementPayload = {
          app_id: ONESIGNAL_APP_ID,
          headings: { en: engagement.title },
          contents: { en: engagement.message },
          url: "https://id-preview--f3d133e2-6e88-4e1b-9d30-7bf9d5ed3846.lovable.app",
          include_aliases: { external_id: Array.from(ownerEmails) },
          target_channel: "push",
        };

        const engRes = await fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
          },
          body: JSON.stringify(engagementPayload),
        });
        const engData = await engRes.json();
        console.log("Engagement notification sent:", JSON.stringify(engData));
        results.push({ type: "engagement", product: featuredSlug, ...engData });
      }
    }

    return new Response(JSON.stringify({ ok: true, featured: featuredSlug, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
