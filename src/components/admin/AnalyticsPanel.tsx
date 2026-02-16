import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Eye, MousePointer, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";

interface DailyStat {
  date: string;
  count: number;
}

interface PageStat {
  page: string;
  count: number;
}

interface EventStat {
  event_type: string;
  page: string;
  count: number;
}

const AnalyticsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [liveNow, setLiveNow] = useState<PageStat[]>([]);
  const [dailyViews, setDailyViews] = useState<DailyStat[]>([]);
  const [topPages, setTopPages] = useState<PageStat[]>([]);
  const [buttonClicks, setButtonClicks] = useState<EventStat[]>([]);
  const [weekTotal, setWeekTotal] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);

    const now = new Date();
    const last30min = new Date(now.getTime() - 30 * 60 * 1000).toISOString();
    const last7days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // Active users (last 30 min) - unique sessions per page
    const { data: recentData } = await supabase
      .from("analytics_events")
      .select("page, session_id")
      .eq("event_type", "page_view")
      .gte("created_at", last30min);

    if (recentData) {
      const pageSessionMap: Record<string, Set<string>> = {};
      recentData.forEach((e) => {
        if (!pageSessionMap[e.page]) pageSessionMap[e.page] = new Set();
        if (e.session_id) pageSessionMap[e.page].add(e.session_id);
      });
      const live = Object.entries(pageSessionMap)
        .map(([page, sessions]) => ({ page, count: sessions.size }))
        .sort((a, b) => b.count - a.count);
      setLiveNow(live);
    }

    // Daily views last 7 days
    const { data: weekData } = await supabase
      .from("analytics_events")
      .select("created_at")
      .eq("event_type", "page_view")
      .gte("created_at", last7days);

    if (weekData) {
      setWeekTotal(weekData.length);
      const dayMap: Record<string, number> = {};
      weekData.forEach((e) => {
        const day = e.created_at.slice(0, 10);
        dayMap[day] = (dayMap[day] || 0) + 1;
      });
      // Fill in missing days
      const days: DailyStat[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        days.push({ date: key, count: dayMap[key] || 0 });
      }
      setDailyViews(days);
    }

    // Today total
    const { data: todayData } = await supabase
      .from("analytics_events")
      .select("id")
      .eq("event_type", "page_view")
      .gte("created_at", todayStart);
    setTodayTotal(todayData?.length ?? 0);

    // Top pages (last 7 days)
    const { data: pagesData } = await supabase
      .from("analytics_events")
      .select("page")
      .eq("event_type", "page_view")
      .gte("created_at", last7days);

    if (pagesData) {
      const pageMap: Record<string, number> = {};
      pagesData.forEach((e) => {
        pageMap[e.page] = (pageMap[e.page] || 0) + 1;
      });
      setTopPages(
        Object.entries(pageMap)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10)
      );
    }

    // Button clicks & checkout clicks
    const { data: clicksData } = await supabase
      .from("analytics_events")
      .select("event_type, page")
      .in("event_type", ["button_click", "checkout_click"])
      .gte("created_at", last7days);

    if (clicksData) {
      const clickMap: Record<string, EventStat> = {};
      clicksData.forEach((e) => {
        const key = `${e.event_type}::${e.page}`;
        if (!clickMap[key]) clickMap[key] = { event_type: e.event_type, page: e.page, count: 0 };
        clickMap[key].count++;
      });
      setButtonClicks(
        Object.values(clickMap).sort((a, b) => b.count - a.count)
      );
    }

    setLoading(false);
  };

  const formatPage = (page: string) => {
    if (page === "/") return "Página Inicial";
    if (page.startsWith("/p/")) return `Produto: ${page.replace("/p/", "")}`;
    if (page === "/upsell-assistente") return "Upsell Assistente";
    if (page === "/assistente-pedagogico") return "Vendas Assistente";
    if (page === "/assistente") return "Dashboard Assistente";
    return page;
  };

  const formatEventType = (type: string) => {
    if (type === "checkout_click") return "Clique Checkout";
    if (type === "button_click") return "Clique Botão";
    return type;
  };

  const formatDate = (dateStr: string) => {
    const [, m, d] = dateStr.split("-");
    return `${d}/${m}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const maxDaily = Math.max(...dailyViews.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            Hoje
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{todayTotal}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Últimos 7 dias
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{weekTotal}</p>
        </div>
      </div>

      {/* Live now */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Ao vivo (últimos 30 min)
        </h3>
        {liveNow.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum visitante ativo</p>
        ) : (
          <ul className="space-y-1">
            {liveNow.map((l) => (
              <li key={l.page} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{formatPage(l.page)}</span>
                <span className="font-medium text-foreground">{l.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Daily chart */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Visitas por dia (últimos 7 dias)
        </h3>
        <div className="flex items-end gap-1.5 h-32">
          {dailyViews.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-foreground">{d.count}</span>
              <div
                className="w-full rounded-t bg-primary/80 transition-all"
                style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? "4px" : "1px" }}
              />
              <span className="text-[10px] text-muted-foreground">{formatDate(d.date)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top pages */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Páginas mais acessadas
        </h3>
        {topPages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados ainda</p>
        ) : (
          <ul className="space-y-2">
            {topPages.map((p) => (
              <li key={p.page} className="flex items-center justify-between text-sm">
                <span className="text-foreground truncate max-w-[70%]">{formatPage(p.page)}</span>
                <span className="font-medium text-muted-foreground">{p.count} views</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Button & checkout clicks */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <MousePointer className="h-4 w-4" />
          Cliques em botões e checkout
        </h3>
        {buttonClicks.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem dados ainda</p>
        ) : (
          <ul className="space-y-2">
            {buttonClicks.map((c, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <div>
                  <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium mr-2 ${c.event_type === "checkout_click" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"}`}>
                    {formatEventType(c.event_type)}
                  </span>
                  <span className="text-foreground">{formatPage(c.page)}</span>
                </div>
                <span className="font-medium text-muted-foreground">{c.count}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default AnalyticsPanel;
