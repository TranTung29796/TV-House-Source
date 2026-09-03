"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { signOut } from "@datbuilds/auth/actions";
import { getUser } from "@datbuilds/auth/client/server";

import { appRoutes } from "@/config/routes";
import { backendRequest, isBackendConfigured } from "@/features/core/server/backend-api";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const avatarUrlSchema = z.union([
  z.string().trim().url(),
  z.string().trim().regex(/^data:image\/[a-zA-Z0-9.+-]+;base64,/),
  z.literal(""),
]);

const profileUpdateSchema = z.object({
  displayName: z.string().trim().max(120).optional(),
  avatarUrl: avatarUrlSchema.optional(),
});

async function requireUser() {
  const user = await getUser();
  if (!user) redirect(appRoutes.auth.login);
  return user;
}

export async function updateAccountProfile(formData: FormData) {
  await requireUser();
  if (!isBackendConfigured()) {
    redirect(`${appRoutes.product.account}?error=database_unconfigured`);
  }

  const parsed = profileUpdateSchema.safeParse({
    displayName: getString(formData, "displayName"),
    avatarUrl: getString(formData, "avatarUrl"),
  });

  if (!parsed.success) {
    redirect(`${appRoutes.product.account}?error=invalid_profile`);
  }

  const result = await backendRequest("/api/v1/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      name: parsed.data.displayName || undefined,
      avatar_url: parsed.data.avatarUrl,
    }),
    requireUser: true,
  });
  if (!result.ok) {
    redirect(`${appRoutes.product.account}?error=invalid_profile`);
  }

  revalidatePath(appRoutes.product.account);
  redirect(`${appRoutes.product.account}?updated=profile`);
}

export async function logOutAccount() {
  await requireUser();
  await signOut();
  redirect(appRoutes.marketing.overview);
}

export async function deleteAccount() {
  await requireUser();
  if (!isBackendConfigured()) {
    redirect(`${appRoutes.product.account}?error=database_unconfigured`);
  }

  const result = await backendRequest("/api/v1/users/me", {
    method: "DELETE",
    requireUser: true,
  });
  if (!result.ok) {
    redirect(`${appRoutes.product.account}?error=database_unconfigured`);
  }
  await signOut();

  revalidatePath(appRoutes.product.account);
  redirect(`${appRoutes.marketing.overview}?account=deleted`);
}
