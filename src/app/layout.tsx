import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { AuthProvider } from "@datbuilds/auth/provider";
import { getInitialAuthUser } from "@datbuilds/auth/client/server";

import { StoreFooter } from "@/components/store/store-footer";
import { StoreHeader } from "@/components/store/store-header";

import "./globals.css";

export const metadata: Metadata = {
  title: { default: "TV House - Siêu thị Smart TV", template: "%s | TV House" },
  description: "Website bán TV, quản lý sản phẩm và hóa đơn sử dụng Next.js và SQLite.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [locale, messages, initialUser] = await Promise.all([
    getLocale(),
    getMessages(),
    getInitialAuthUser(),
  ]);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider initialUser={initialUser}>
            <StoreHeader />
            <main>{children}</main>
            <StoreFooter />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
