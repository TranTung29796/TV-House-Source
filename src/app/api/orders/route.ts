import { NextResponse } from "next/server";

import { createOrder, getOrders } from "@/lib/store-db";
import type { Order } from "@/lib/store-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ orders: getOrders() });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const customerName = String(payload.customerName ?? "").trim();
    const phone = String(payload.phone ?? "").trim();
    const address = String(payload.address ?? "").trim();
    const paymentMethod = payload.paymentMethod === "BANK" ? "BANK" : "COD";
    const items = Array.isArray(payload.items)
      ? payload.items.map((item: { productId?: unknown; quantity?: unknown }) => ({
          productId: Number(item.productId),
          quantity: Math.round(Number(item.quantity)),
        }))
      : [];

    if (customerName.length < 2) throw new Error("Vui lòng nhập họ tên người nhận.");
    if (!/^(0|\+84)[0-9]{9,10}$/.test(phone.replaceAll(" ", ""))) throw new Error("Số điện thoại không hợp lệ.");
    if (address.length < 10) throw new Error("Vui lòng nhập địa chỉ giao hàng đầy đủ.");
    if (!items.length) throw new Error("Giỏ hàng đang trống.");

    const order = createOrder({ customerName, phone, address, paymentMethod: paymentMethod as Order["paymentMethod"], items });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể tạo hóa đơn.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

