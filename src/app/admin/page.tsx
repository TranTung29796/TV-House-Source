import type { Metadata } from "next";

import { AdminDashboard } from "@/components/store/admin-dashboard";
import { getDashboardStats, getOrders, getProducts } from "@/lib/store-db";

export const metadata: Metadata = { title: "Quản trị cửa hàng" };
export const dynamic = "force-dynamic";

export default function Page() {
  return <AdminDashboard initialProducts={getProducts()} initialOrders={getOrders()} initialStats={getDashboardStats()} />;
}
