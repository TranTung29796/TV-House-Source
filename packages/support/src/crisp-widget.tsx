"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

/**
 * Crisp chat widget component.
 * Lazy-loads the Crisp script to avoid blocking page performance.
 *
 * Security:
 * - Loads script only from crisp.chat domain
 * - WebsiteID read from env (not hardcoded)
 * - No user data sent until identifyUser() is called explicitly
 *
 * Usage:
 * ```tsx
 * import { CrispWidget } from "@datbuilds/support/widget";
 * // in layout.tsx body:
 * <CrispWidget />
 * ```
 */
export function CrispWidget() {
  useEffect(() => {
    const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!websiteId) return;

    // Prevent double-initialization
    if (window.CRISP_WEBSITE_ID) return;

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    // Content Security Policy: only load from crisp.chat
    script.setAttribute("data-cfasync", "false");
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount (rare for layout-level component)
      try {
        document.head.removeChild(script);
      } catch {
        // Script may have already been removed
      }
    };
  }, []);

  return null;
}
