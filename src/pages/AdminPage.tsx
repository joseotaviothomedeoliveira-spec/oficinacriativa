import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { getProducts } from "@/data/products";
import { Send, UserPlus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const products = getProducts();

const AdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // Grant access state
  const [grantEmail, setGrantEmail] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [granting, setGranting] = useState(false);

  // Manual purchases list
  const [manualPurchases, setManualPurchases] = useState<
    { id: string; buyer_email: string; product_slug: string; product_name: string }[]
  >([]);

  // Notification state
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [sending, setSending] = useState(false);

  // Sent notifications
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; sent_at: string }[]
  >([]);

  useEffect(() => {
    if (!user) return;
    const checkAdmin = async () => {
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchManualPurchases();
    fetchNotifications();
  }, [isAdmin]);

  const fetchManualPurchases = async () => {
    const { data } = await supabase
      .from("purchases")
      .select("id, buyer_email, product_slug, product_name")
      .is("hotmart_transaction_id", null)
      .order("created_at", { ascending: false });
    setManualPurchases(data ?? []);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from("notification_messages")
      .select("id, title, message, sent_at")
      .order("sent_at", { ascending: false })
      .limit(20);
    setNotifications(data ?? []);
  };

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleGrantAccess = async () => {
    if (!grantEmail.trim() || selectedSlugs.length === 0) {
      toast.error("Preencha o email e selecione pelo menos um produto.");
      return;
    }
    setGranting(true);
    const email = grantEmail.toLowerCase().trim();

    for (const slug of selectedSlugs) {
      const product = products.find((p) => p.slug === slug);
      await supabase.from("purchases").insert({
        buyer_email: email,
        product_slug: slug,
        product_name: product?.name ?? slug,
        hotmart_transaction_id: null,
        status: "approved",
      });
    }

    toast.success("Acesso concedido com sucesso!");
    setGrantEmail("");
    setSelectedSlugs([]);
    setGranting(false);
    fetchManualPurchases();
  };

  const handleRemoveAccess = async (id: string) => {
    await supabase.from("purchases").delete().eq("id", id);
    toast.success("Acesso removido.");
    fetchManualPurchases();
  };

  const handleSendNotification = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error("Preencha título e mensagem.");
      return;
    }
    setSending(true);
    try {
      const res = await supabase.functions.invoke("send-notification", {
        body: { title: notifTitle, message: notifMessage },
      });
      if (res.error) throw res.error;
      toast.success("Notificação enviada!");
      setNotifTitle("");
      setNotifMessage("");
      fetchNotifications();
    } catch (err: any) {
      toast.error("Erro ao enviar: " + (err.message || "desconhecido"));
    }
    setSending(false);
  };

  if (authLoading || isAdmin === null) {
    return (
      <main className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Helmet>
        <title>Admin — Oficina Criativa</title>
      </Helmet>

      <main className="container py-8 space-y-10 max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground">Painel Admin</h1>

        {/* Grant Access */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Conceder Acesso
          </h2>
          <div>
            <label className="text-sm font-medium text-foreground">Email do usuário</label>
            <input
              type="email"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Produtos</label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {products.map((p) => (
                <label
                  key={p.slug}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer transition-colors ${
                    selectedSlugs.includes(p.slug)
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSlugs.includes(p.slug)}
                    onChange={() => toggleSlug(p.slug)}
                    className="accent-primary"
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
          <button
            onClick={handleGrantAccess}
            disabled={granting}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {granting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Conceder Acesso
          </button>
        </section>

        {/* Manual Purchases */}
        {manualPurchases.length > 0 && (
          <section className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Acessos Manuais</h2>
            <ul className="space-y-2">
              {manualPurchases.map((p) => (
                <li key={p.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <div className="text-sm">
                    <span className="font-medium text-foreground">{p.buyer_email}</span>
                    <span className="mx-2 text-muted-foreground">→</span>
                    <span className="text-muted-foreground">{p.product_name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAccess(p.id)}
                    className="text-destructive hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Send Notification */}
        <section className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Notificação
          </h2>
          <div>
            <label className="text-sm font-medium text-foreground">Título</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              placeholder="Título da notificação"
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Mensagem</label>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              placeholder="Corpo da notificação"
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <button
            onClick={handleSendNotification}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Enviar
          </button>
        </section>

        {/* Notification History */}
        {notifications.length > 0 && (
          <section className="rounded-lg border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Notificações Enviadas</h2>
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li key={n.id} className="rounded-md border border-border px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.sent_at).toLocaleString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
};

export default AdminPage;
