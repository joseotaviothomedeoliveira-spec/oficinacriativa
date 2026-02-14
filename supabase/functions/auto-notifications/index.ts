const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const morningMessages = [
  { title: "☀️ Bom dia, professora!", message: "Já viu as +5000 atividades prontas para imprimir? Poupe horas de trabalho hoje!" },
  { title: "📚 Comece o dia com criatividade!", message: "O Kit Completo da Alfabetização tem tudo para ensinar leitura de forma divertida." },
  { title: "✨ Novidade na Oficina Criativa!", message: "Moldes novos todos os meses para manter suas aulas sempre atualizadas." },
  { title: "🎨 Atividades prontas te esperando!", message: "Mais de 5000 moldes de EVA para imprimir e usar em atividades criativas." },
  { title: "🏫 Prepare sua sala em 1 hora!", message: "Kit Sala de Aula com murais, calendários e decoração prontos para imprimir." },
];

const eveningMessages = [
  { title: "🌙 Prepare o dia de amanhã!", message: "Com as +5000 Atividades, você tem material pronto para qualquer situação. Confira!" },
  { title: "📖 Dica para amanhã!", message: "Use o Painel das Palavras para ajudar seus alunos a lerem com facilidade." },
  { title: "💡 Já organizou as atividades?", message: "Palavras Escondidas transforma a leitura em brincadeira. As crianças adoram!" },
  { title: "🎯 Planeje com antecedência!", message: "O Kit de Alfabetização tem exercícios interativos perfeitos para o dia a dia." },
  { title: "✏️ Materiais novos disponíveis!", message: "Confira os moldes e atividades novas na Oficina Criativa." },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ONESIGNAL_REST_API_KEY = Deno.env.get("ONESIGNAL_REST_API_KEY");
    const ONESIGNAL_APP_ID = "217be61a-b58a-4363-8f07-6eda597599b1";

    if (!ONESIGNAL_REST_API_KEY) {
      throw new Error("ONESIGNAL_REST_API_KEY not configured");
    }

    // Determine time of day (UTC-3 for Brazil)
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

    const pool = isMorning ? morningMessages : eveningMessages;
    const pick = pool[Math.floor(Math.random() * pool.length)];

    const osResponse = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["All"],
        headings: { en: pick.title },
        contents: { en: pick.message },
        url: "https://id-preview--f3d133e2-6e88-4e1b-9d30-7bf9d5ed3846.lovable.app",
      }),
    });

    const osData = await osResponse.json();
    console.log("Auto notification sent:", JSON.stringify(osData));

    return new Response(JSON.stringify({ ok: true, sent: pick, onesignal: osData }), {
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
