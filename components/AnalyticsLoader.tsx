"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { getSettings, onStoreChange } from "@/lib/store";

export const GA_ID_PATTERN = /^G-[A-Z0-9]{4,}$/i;
export const GTM_ID_PATTERN = /^GTM-[A-Z0-9]{4,}$/i;

/**
 * Reads the GA4 Measurement ID and GTM Container ID saved from /admin
 * (localStorage) and injects the official Next.js scripts dynamically.
 */
export default function AnalyticsLoader() {
  const [gaId, setGaId] = useState("");
  const [gtmId, setGtmId] = useState("");

  useEffect(() => {
    const sync = () => {
      const s = getSettings();
      setGaId(s.gaId);
      setGtmId(s.gtmId);
    };
    sync();
    return onStoreChange(sync);
  }, []);

  return (
    <>
      {GA_ID_PATTERN.test(gaId) && <GoogleAnalytics gaId={gaId.toUpperCase()} />}
      {GTM_ID_PATTERN.test(gtmId) && <GoogleTagManager gtmId={gtmId.toUpperCase()} />}
    </>
  );
}
