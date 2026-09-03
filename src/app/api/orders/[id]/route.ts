import { NextResponse } from "next/server";

import { getOrder, updateOrderStatus } from "@/lib/store-db";
import type { Order } from "@/lib/store-types";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const order = getOrder(Number((await context.params).id));
  return order
    ? NextResponse.json({ order })
    : NextResponse.json({ error: "Không tìm thấy hóa đơn." }, { status: 404 });
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { status } = await request.json() as { status: Order["status"] };
    const order = updateOrderStatus(Number((await context.params).id), status);
    return order
      ? NextResponse.json({ order })
      : NextResponse.json({ error: "Không tìm thấy hóa đơn." }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật hóa đơn.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
