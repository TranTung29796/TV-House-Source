import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { getUser } from "@datbuilds/auth/client/server";
import { Button } from "@datbuilds/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@datbuilds/ui/components/card";
import { Input } from "@datbuilds/ui/components/input";
import { Label } from "@datbuilds/ui/components/label";

import { ProductTemplateAvatarPicker } from "@/components/account/product-template-avatar-picker";
import { ProductTemplateAccountStatusBridge } from "@/components/account/product-template-account-status-bridge";
import { appRoutes } from "@/config/routes";
import { BillingPortalButton } from "@/features/billing/client/billing-portal-button";
import { getBillingSummary } from "@/features/billing/server/billing.service";
import { backendRequest, isBackendConfigured } from "@/features/core/server/backend-api";
import {
  deleteAccount,
  logOutAccount,
  updateAccountProfile,
} from "@/app/(product)/account/actions";

export const dynamic = "force-dynamic";

type AccountPageProps = {
  searchParams?: Promise<{
    updated?: string;
    error?: string;
  }>;
};

const accountSearchParamsSchema = z.object({
  updated: z.enum(["profile"]).optional(),
  error: z
    .enum([
      "portal_unavailable",
      "database_unconfigured",
      "forbidden_billing",
      "invalid_profile",
    ])
    .optional(),
});

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function formatPlanLabel(value: string | null | undefined) {
  if (!value) return null;
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function AccountGlyph({
  name,
  className,
}: {
  name: "crown" | "clock" | "calendar" | "chevron" | "shield" | "wallet";
  className?: string;
}) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      {name === "crown" ? (
        <>
          <path {...common} d="M4 18h16l-1.5-9-5 4-3.5-6-3.5 6-5-4L4 18Z" />
          <path {...common} d="M7 18v2h10v-2" />
        </>
      ) : null}
      {name === "clock" ? (
        <>
          <circle {...common} cx="12" cy="12" r="8" />
          <path {...common} d="M12 8v4l3 2" />
        </>
      ) : null}
      {name === "calendar" ? (
        <>
          <rect {...common} x="5" y="6" width="14" height="13" rx="2.5" />
          <path {...common} d="M8 4v4M16 4v4M5 10h14" />
        </>
      ) : null}
      {name === "chevron" ? <path {...common} d="m10 7 5 5-5 5" /> : null}
      {name === "shield" ? (
        <>
          <path {...common} d="M12 4c2.8 2 5.5 2.8 8 3v5.3c0 4.8-3.2 7.8-8 9.7-4.8-1.9-8-4.9-8-9.7V7c2.5-.2 5.2-1 8-3Z" />
        </>
      ) : null}
      {name === "wallet" ? (
        <>
          <path {...common} d="M4 8.5A2.5 2.5 0 0 1 6.5 6H18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 15.5v-7Z" />
          <path {...common} d="M4 9h13a2 2 0 0 1 0 4H4" />
          <circle {...common} cx="16.5" cy="11" r=".5" />
        </>
      ) : null}
    </svg>
  );
}

function toneForStatus(value: string) {
  const normalized = value.toLowerCase();

  if (normalized.includes("active") || normalized.includes("verified")) return "success";
  if (normalized.includes("pending")) return "warning";
  if (normalized.includes("inactive") || normalized.includes("not available")) return "muted";
  return "default";
}

function localizeStatus(value: string, t: Awaited<ReturnType<typeof getTranslations>>) {
  const normalized = value.toLowerCase();

  if (normalized.includes("verified")) return t("verified");
  if (normalized.includes("pending")) return t("pending");
  if (normalized.includes("active") && !normalized.includes("inactive")) return t("active");
  if (normalized.includes("inactive")) return t("inactive");
  if (normalized.includes("upgrade required")) return t("upgradeRequired");
  if (normalized.includes("available")) return t("available");
  if (normalized.includes("free")) return t("free");
  if (normalized.includes("not available")) return t("notAvailable");

  return value;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const user = await getUser();
  if (!user) redirect(appRoutes.auth.login);
  const t = await getTranslations("account");
  const profileFormId = "account-profile-form";

  const profilePromise = isBackendConfigured()
    ? backendRequest<{
        name?: string | null;
        avatar_url?: string | null;
        email_verified?: boolean;
      }>("/api/v1/users/me", { requireUser: true })
    : Promise.resolve(null);

  const [resolvedSearchParams, profileResponse, billing] = await Promise.all([
    searchParams ?? Promise.resolve({ updated: undefined, error: undefined }),
    profilePromise,
    getBillingSummary(),
  ]);
  const profile = profileResponse && "ok" in profileResponse && profileResponse.ok ? profileResponse.data : null;
  const parsedSearchParams = accountSearchParamsSchema.safeParse(resolvedSearchParams);
  const safeSearchParams = parsedSearchParams.success ? parsedSearchParams.data : {};

  const displayName =
    profile?.name ?? user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";
  const avatarUrl = stringValue(profile?.avatar_url ?? user.user_metadata?.avatar_url);
  const initials = displayName.slice(0, 1).toUpperCase();
  const subscriptionLabel = billing?.isActive
    ? formatPlanLabel(billing.subscription?.pricingPlanName) ??
      formatPlanLabel(billing.subscription?.planCode) ??
      t("activePlan")
    : t("free");
  const billingStatus = localizeStatus(billing?.status ?? t("inactive"), t);
  const renewalLabel = formatDate(billing?.currentPeriodEnd ?? null);
  const emailStatus = profile?.email_verified ? t("verified") : t("pending");
  const billingPortalLabel = billing?.isActive ? t("available") : t("upgradeRequired");

  return (
    <main className="xsolt-account-page">
      <ProductTemplateAccountStatusBridge
        updated={safeSearchParams.updated}
        error={safeSearchParams.error}
        messages={{
          updated: t("updated"),
          portal_unavailable: t("portalUnavailable"),
          database_unconfigured: t("databaseUnconfigured"),
          forbidden_billing: t("forbiddenBilling"),
          invalid_profile: t("invalidProfile"),
        }}
      />

      <section className="xsolt-account-grid">
        <Card
          id="profile"
          className="xsolt-account-card xsolt-account-card--profile xsolt-account-card--profile-panel"
        >
          <CardHeader className="xsolt-account-card__header">
            <CardTitle className="xsolt-account-card__title">{t("profile")}</CardTitle>
            <CardDescription className="xsolt-account-card__description">
              {t("profileDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="xsolt-account-card__content">
            <div className="xsolt-account-profile-layout">
              <div className="xsolt-account-profile-head">
                <div className="xsolt-account-identity">
                  <ProductTemplateAvatarPicker
                    displayName={displayName}
                    initialAvatarUrl={avatarUrl}
                    initials={initials}
                    editLabel={t("updateAvatar")}
                    formId={profileFormId}
                  />
                  <div className="xsolt-account-identity__copy">
                    <strong>{displayName}</strong>
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <form
                id={profileFormId}
                action={updateAccountProfile}
                className="xsolt-account-form"
              >
                <div className="xsolt-account-form__row">
                  <div className="xsolt-account-field">
                    <Label htmlFor="displayName">{t("displayName")}</Label>
                    <Input
                      id="displayName"
                      name="displayName"
                      defaultValue={displayName}
                      maxLength={120}
                      placeholder={t("yourName")}
                      className="xsolt-account-input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="xsolt-account-button xsolt-account-button--gradient"
                  >
                    {t("saveProfile")}
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        <Card
          id="subscription"
          className="xsolt-account-card xsolt-account-card--subscription xsolt-account-card--billing-plan"
        >
          <CardHeader className="xsolt-account-card__header">
            <div className="xsolt-account-card__icon xsolt-account-card__icon--wallet">
              <AccountGlyph name="wallet" />
            </div>
            <CardTitle className="xsolt-account-card__title">{t("planBilling")}</CardTitle>
            <CardDescription className="xsolt-account-card__description">
              {t("planBillingDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="xsolt-account-card__content">
            <div className="xsolt-account-table">
              <div className="xsolt-account-row">
                <span>{t("plan")}</span>
                <strong className="xsolt-account-value xsolt-account-value--brand">
                  {subscriptionLabel}
                </strong>
              </div>
              <div className="xsolt-account-row">
                <span>{t("status")}</span>
                <strong
                  className={`xsolt-account-value xsolt-account-value--${toneForStatus(billingStatus)}`}
                >
                  {billingStatus}
                </strong>
              </div>
              <div className="xsolt-account-row">
                <span>{t("renewal")}</span>
                <strong
                  className={`xsolt-account-value xsolt-account-value--${toneForStatus(renewalLabel)}`}
                >
                  {renewalLabel}
                </strong>
              </div>
              <div className="xsolt-account-row xsolt-account-row--link">
                <span>{t("viewPlanLimits")}</span>
                <strong className="xsolt-account-row__chevron">
                  <AccountGlyph name="chevron" />
                </strong>
              </div>
              <div className="xsolt-account-row">
                <span>{t("billingPortal")}</span>
                <strong
                  className={`xsolt-account-value xsolt-account-value--${toneForStatus(
                    billingPortalLabel,
                  )}`}
                >
                  {billingPortalLabel}
                </strong>
              </div>
            </div>
            <div className="xsolt-account-actions xsolt-account-actions--uniform">
              {billing?.isActive ? (
                <BillingPortalButton />
              ) : (
                <Button asChild className="xsolt-account-button xsolt-account-button--gradient">
                  <Link href={appRoutes.marketing.pricing}>{t("upgradePlan")}</Link>
                </Button>
              )}
              <Button
                asChild
                variant="ghost"
                className="xsolt-account-button xsolt-account-button--ghost"
              >
                <Link href={appRoutes.marketing.pricing}>{t("viewPricing")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card id="security" className="xsolt-account-card xsolt-account-card--security">
          <CardHeader className="xsolt-account-card__header">
            <form action={logOutAccount} className="xsolt-account-card__header-action">
              <Button type="submit" variant="outline" className="xsolt-account-button">
                {t("logout")}
              </Button>
            </form>
            <div className="xsolt-account-card__icon xsolt-account-card__icon--shield">
              <AccountGlyph name="shield" />
            </div>
            <CardTitle className="xsolt-account-card__title">{t("security")}</CardTitle>
            <CardDescription className="xsolt-account-card__description">
              {t("securityDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="xsolt-account-card__content">
            <div className="xsolt-account-table">
              <div className="xsolt-account-row">
                <span>{t("session")}</span>
                <strong className="xsolt-account-status xsolt-account-status--success">
                  <span className="xsolt-account-status__dot" />
                  {t("active")}
                </strong>
              </div>
              <div className="xsolt-account-row">
                <span>{t("emailStatus")}</span>
                <strong className={`xsolt-account-status xsolt-account-status--${toneForStatus(emailStatus)}`}>
                  <span className="xsolt-account-status__dot" />
                  {emailStatus}
                </strong>
              </div>
            </div>

            <div className="xsolt-account-security-block">
              <h3>{t("deleteAccountTitle")}</h3>
              <p>{t("deleteAccountDescription")}</p>
              <div className="xsolt-account-actions xsolt-account-actions--uniform">
                <form action={deleteAccount}>
                  <Button
                    type="submit"
                    variant="destructive"
                    className="xsolt-account-button xsolt-account-button--danger"
                  >
                    {t("deleteAccount")}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
