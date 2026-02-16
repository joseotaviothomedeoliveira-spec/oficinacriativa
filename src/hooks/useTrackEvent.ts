import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generate a session ID per browser tab
const SESSION_ID =
  sessionStorage.getItem("analytics_sid") ||
  (() => {
    const id = crypto.randomUUID();
    sessionStorage.setItem("analytics_sid", id);
    return id;
  })();

export function trackEvent(
  eventType: string,
  page: string,
  metadata: Record<string, unknown> = {}
) {
  supabase
    .from("analytics_events")
    .insert({
      event_type: eventType,
      page,
      metadata,
      session_id: SESSION_ID,
    } as any)
    .then(); // fire-and-forget
}

/** Track a page view once when the component mounts */
export function useTrackPageView(page: string) {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("page_view", page);
  }, [page]);
}
