import type { Metadata } from "next";

import { APP_CONFIG } from "@datbuilds/config";

export interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  baseUrl?: string;
}

/**
 * Build a consistent Next.js Metadata object across all apps.
 */
export function buildMetadata({
  title,
  description = APP_CONFIG.description,
  path = "/",
  image = "/og.png",
  noIndex = false,
  baseUrl = "http://localhost:3000",
}: BuildMetadataOptions = {}): Metadata {
  const resolvedTitle = title ? `${title} · ${APP_CONFIG.name}` : APP_CONFIG.name;
  const url = new URL(path, baseUrl).toString();

  return {
    metadataBase: new URL(baseUrl),
    title: resolvedTitle,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url,
      title: resolvedTitle,
      description,
      siteName: APP_CONFIG.name,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [image],
    },
  };
}

/**
 * Generate a JSON-LD script payload for structured data.
 */
export function jsonLd<T extends Record<string, unknown>>(data: T) {
  return {
    __html: JSON.stringify({ "@context": "https://schema.org", ...data }),
  };
}
