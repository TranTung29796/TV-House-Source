"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { sendLoginMagicLink } from "@datbuilds/auth/actions";
import {
  isLocalDemoAuthEnabled,
  LOCAL_DEMO_AUTH_EMAIL,
} from "@datbuilds/auth/local-demo";
import {
  magicLinkLoginSchema,
  type MagicLinkLoginInput,
} from "@datbuilds/auth/schemas";

import { ProductTemplateLogoMark } from "@/components/branding/product-template-logo-mark";
import { useProductTemplateStatus } from "@/components/status/product-template-status-provider";

type ProductTemplateAuthShowcaseProps = {
  initialMode?: "login";
  onClose?: () => void;
  presentation?: "page" | "drawer";
  redirectTo?: string;
  isClosing?: boolean;
};

const featureItems = [
  {
    title: "Launch in minutes",
    body: "Use powerful templates to get started instantly.",
    tone: "violet",
  },
  {
    title: "Scale with confidence",
    body: "Built for performance, security and reliability.",
    tone: "blue",
  },
  {
    title: "Everything in one place",
    body: "Design, manage and grow from a single dashboard.",
    tone: "green",
  },
] as const;

export function ProductTemplateAuthShowcase({
  initialMode: _initialMode = "login",
  onClose,
  presentation = "page",
  redirectTo,
  isClosing = false,
}: ProductTemplateAuthShowcaseProps = {}) {
  const t = useTranslations("auth");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { pushToast } = useProductTemplateStatus();
  const redirect = redirectTo ?? searchParams.get("redirect") ?? "/";
  const [statusMessage, setStatusMessage] = useState<string | null>(
    searchParams.get("message") === "magic_link_sent" ? t("magicLinkSent") : null,
  );

  const loginForm = useForm<MagicLinkLoginInput>({
    resolver: zodResolver(magicLinkLoginSchema),
    defaultValues: { email: "" },
  });

  const isLocalDemoMode = isLocalDemoAuthEnabled();

  useEffect(() => {
    if (presentation !== "drawer") {
      return;
    }

    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlOverflow = documentElement.style.overflow;

    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    documentElement.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [presentation]);

  async function submitLogin(values: MagicLinkLoginInput) {
    setStatusMessage(null);
    try {
      const result = await sendLoginMagicLink({ ...values, redirectTo: redirect });

      if (!result.success) {
        const message = result.error ?? t("loginRequestFailed");
        loginForm.setError("root", { message });
        pushToast({ tone: "error", message });
        return;
      }

      if (result.completed) {
        router.push(redirect);
        router.refresh();
        return;
      }

      loginForm.reset({ email: values.email });
      const message = t("magicLinkSent");
      setStatusMessage(message);
      pushToast({ tone: "success", message });
    } catch {
      const message = t("loginRequestFailed");
      loginForm.setError("root", { message });
      pushToast({ tone: "error", message });
    }
  }

  const content = (
    <div className="xsolt-login-shell">
      <div className="xsolt-login-shell__story">
        <div className="xsolt-login-shell__brand">
          <div className="xsolt-login-shell__brand-mark">
            <ProductTemplateLogoMark className="xsolt-login-shell__logo" />
          </div>
          <div>
            <strong>NEXORA</strong>
            <span>Build. Launch. Scale.</span>
          </div>
        </div>

        <div className="xsolt-login-shell__copy">
          <h2>
            Build amazing
            <br />
            products, <em>faster</em>
          </h2>
          <p>
            The all-in-one platform to ship beautiful digital products and grow your
            business.
          </p>
        </div>

        <div className="xsolt-login-shell__feature-list">
          {featureItems.map((item) => (
            <div key={item.title} className="xsolt-login-shell__feature">
              <span
                className={`xsolt-login-shell__feature-icon xsolt-login-shell__feature-icon--${item.tone}`}
                aria-hidden="true"
              >
                <span />
              </span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xsolt-login-shell__panel">
        {onClose ? (
          <button
            type="button"
            className="xsolt-auth-dialog__close xsolt-login-shell__close"
            aria-label={t("closeLoginPanel")}
            onClick={onClose}
          >
            ×
          </button>
        ) : null}

        <div className="xsolt-login-card">
          <header className="xsolt-login-card__header">
            <h1 id="xsolt-login-title">{t("signIn")}</h1>
            <p>Sign in to continue to your account</p>
          </header>

          <form
            onSubmit={loginForm.handleSubmit(submitLogin)}
            className="xsolt-login-card__form"
          >
            {loginForm.formState.errors.root ? (
              <p className="xsolt-form-error">{loginForm.formState.errors.root.message}</p>
            ) : null}

            {statusMessage ? (
              <p className="xsolt-auth-card__notice">{statusMessage}</p>
            ) : null}

            {isLocalDemoMode ? (
              <p className="xsolt-auth-card__notice">
                {t("localDemo", { email: LOCAL_DEMO_AUTH_EMAIL })}
              </p>
            ) : null}

            <label className="xsolt-login-card__field">
              <span>{t("emailAddress")}</span>
              <div className="xsolt-login-card__input-wrap">
                <span className="xsolt-login-card__input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7.5h16v9H4z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinejoin="round"
                    />
                    <path
                      d="m5 8 7 6 7-6"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  autoComplete="email"
                  {...loginForm.register("email")}
                />
              </div>
              {loginForm.formState.errors.email ? (
                <p className="xsolt-form-error">
                  {loginForm.formState.errors.email.message}
                </p>
              ) : null}
            </label>

            <button
              type="submit"
              className="xsolt-login-card__submit"
              disabled={loginForm.formState.isSubmitting}
            >
              {loginForm.formState.isSubmitting
                ? t("sendingMagicLink")
                : "Continue with email"}
            </button>
          </form>

          <footer className="xsolt-login-card__footer">
            <span className="xsolt-login-card__footer-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.75 18.25 6v5.25c0 4.17-2.43 7.3-6.25 9-3.82-1.7-6.25-4.83-6.25-9V6L12 3.75Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="m9.75 12 1.5 1.5 3-3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span>Your data is protected with enterprise-grade security.</span>
          </footer>
        </div>
      </div>
    </div>
  );

  if (presentation === "drawer") {
    return (
      <div
        className={`xsolt-auth-drawer xsolt-auth-drawer--modal${isClosing ? " is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="xsolt-login-title"
      >
        <button
          type="button"
          className="xsolt-auth-drawer__backdrop"
          aria-label={t("closeLoginPanel")}
          onClick={onClose}
        />
        <div className="xsolt-auth-drawer__panel xsolt-auth-drawer__panel--modal">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section className="xsolt-view xsolt-auth-page xsolt-auth-page--login-only">
      <div className="xsolt-auth-page__body">{content}</div>
    </section>
  );
}
