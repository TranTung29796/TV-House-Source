"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ProductTemplateStatusTone = "success" | "warning" | "error" | "info";

type ProductTemplateStatusToastInput = {
  tone: ProductTemplateStatusTone;
  message: string;
  title?: string;
  durationMs?: number;
};

type ProductTemplateStatusToast = ProductTemplateStatusToastInput & {
  id: string;
};

type ProductTemplateStatusContextValue = {
  pushToast: (toast: ProductTemplateStatusToastInput) => string;
  dismissToast: (id: string) => void;
};

const ProductTemplateStatusContext = createContext<ProductTemplateStatusContextValue | null>(null);

function toneLabel(tone: ProductTemplateStatusTone) {
  if (tone === "success") return "Success";
  if (tone === "warning") return "Warning";
  if (tone === "error") return "Error";
  return "Info";
}

function StatusToneIcon({ tone }: { tone: ProductTemplateStatusTone }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (tone === "success") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path {...common} d="M12 3.75a8.25 8.25 0 1 1 0 16.5a8.25 8.25 0 0 1 0-16.5Z" />
        <path {...common} d="m8.75 12.1 2.1 2.15 4.4-4.65" />
      </svg>
    );
  }

  if (tone === "warning") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path {...common} d="M12 4.5 4.75 17.5h14.5L12 4.5Z" />
        <path {...common} d="M12 9v4.5" />
        <path {...common} d="M12 16.5h.01" />
      </svg>
    );
  }

  if (tone === "error") {
    return (
      <svg viewBox="0 0 24 24" focusable="false">
        <path {...common} d="M12 3.75a8.25 8.25 0 1 1 0 16.5a8.25 8.25 0 0 1 0-16.5Z" />
        <path {...common} d="m9.25 9.25 5.5 5.5" />
        <path {...common} d="m14.75 9.25-5.5 5.5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path {...common} d="M12 3.75a8.25 8.25 0 1 1 0 16.5a8.25 8.25 0 0 1 0-16.5Z" />
      <path {...common} d="M12 10.25v5" />
      <path {...common} d="M12 7.7h.01" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" focusable="false">
      <path
        d="m8 8 8 8M16 8l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ProductTemplateStatusProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ProductTemplateStatusToast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback(
    ({ durationMs = 4200, ...toast }: ProductTemplateStatusToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

      setToasts((current) => [...current, { id, durationMs, ...toast }]);

      const timer = setTimeout(() => {
        dismissToast(id);
      }, durationMs);

      timersRef.current.set(id, timer);
      return id;
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      for (const timer of timers.values()) {
        clearTimeout(timer);
      }
      timers.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      pushToast,
      dismissToast,
    }),
    [dismissToast, pushToast],
  );

  return (
    <ProductTemplateStatusContext.Provider value={value}>
      {children}
      <div className="xsolt-status-toast-stack" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`xsolt-status-toast xsolt-status-toast--${toast.tone}`}
            role="status"
          >
            <span className="xsolt-status-toast__glyph" aria-hidden="true">
              <StatusToneIcon tone={toast.tone} />
            </span>
            <div className="xsolt-status-toast__body">
              <strong>{toast.title ?? toneLabel(toast.tone)}</strong>
              <p>{toast.message}</p>
            </div>
            <button
              type="button"
              className="xsolt-status-toast__close"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </ProductTemplateStatusContext.Provider>
  );
}

export function useProductTemplateStatus() {
  const context = useContext(ProductTemplateStatusContext);

  if (!context) {
    throw new Error("useProductTemplateStatus must be used within ProductTemplateStatusProvider.");
  }

  return context;
}
