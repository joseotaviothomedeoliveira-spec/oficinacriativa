import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Track which page+day combos we already sent this session
const trackedPageDays = new Set<string>();

export async function trackEvent(
  eventType: string,
  page: string,
  metadata: Record<string, unknown> = {}
) {
  // Only track logged-in users
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return;

  const email = session.user.email;
  const today = new Date().toISOString().slice(0, 10);
  const dedupeKey = `${eventType}::${page}::${email}::${today}`;

  // Prevent duplicate in same browser session
  if (trackedPageDays.has(dedupeKey)) return;
  trackedPageDays.add(dedupeKey);

  supabase
    .from("analytics_events")
    .insert({
      event_type: eventType,
      page,
      metadata: { ...metadata, email },
      session_id: email,
    } as any)
    .then();
}

/** Track a page view once per user per day */
export function useTrackPageView(page: string) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("page_view", page);
  }, [page]);
}
