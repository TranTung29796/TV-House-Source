"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useProductTemplateStatus } from "@/components/status/product-template-status-provider";

type ProductTemplateAccountStatusBridgeProps = {
  updated?: "profile";
  error?: "portal_unavailable" | "database_unconfigured" | "forbidden_billing" | "invalid_profile";
  messages: Partial<Record<"updated" | "portal_unavailable" | "database_unconfigured" | "forbidden_billing" | "invalid_profile", string>>;
};

export function ProductTemplateAccountStatusBridge({
  updated,
  error,
  messages,
}: ProductTemplateAccountStatusBridgeProps) {
  const firedRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useProductTemplateStatus();

  useEffect(() => {
    if (firedRef.current) {
      return;
    }

    const queue: Array<{ tone: "success" | "warning"; message: string }> = [];

    if (updated === "profile" && messages.updated) {
      queue.push({ tone: "success", message: messages.updated });
    }

    if (error && messages[error]) {
      queue.push({ tone: "warning", message: messages[error] as string });
    }

    if (queue.length === 0) {
      return;
    }

    firedRef.current = true;

    for (const item of queue) {
      pushToast(item);
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("updated");
    nextParams.delete("error");
    const nextQuery = nextParams.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [error, messages, pathname, pushToast, router, searchParams, updated]);

  return null;
}
