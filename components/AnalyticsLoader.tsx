"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getSettings, onStoreChange } from "@/lib/store";

/**
 * Reads the GA4 Measurement ID saved from /admin (localStorage) and
 * injects the official Next.js GA script dynamically.
 */
export default function AnalyticsLoader() {
  const [gaId, setGaId] = useState("");

  useEffect(() => {
    const sync = () => setGaId(getSettings().gaId);
    sync();
    return onStoreChange(sync);
  }, []);

  if (!/^G-[A-Z0-9]{4,}$/i.test(gaId)) return null;
  return <GoogleAnalytics gaId={gaId.toUpperCase()} />;
}
