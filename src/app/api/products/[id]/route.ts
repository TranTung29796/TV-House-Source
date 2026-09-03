import { NextResponse } from "next/server";

import { deleteProduct, getProduct, updateProduct } from "@/lib/store-db";
import { parseProductInput } from "@/lib/validation";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const product = getProduct(Number((await context.params).id));
  return product
    ? NextResponse.json({ product })
    : NextResponse.json({ error: "Không tìm thấy sản phẩm." }, { status: 404 });
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const product = updateProduct(Number((await context.params).id), parseProductInput(await request.json()));
    return product
      ? NextResponse.json({ product })
      : NextResponse.json({ error: "Không tìm thấy sản phẩm." }, { status: 404 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể cập nhật sản phẩm.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const deleted = deleteProduct(Number((await context.params).id));
  return deleted
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ error: "Không tìm thấy sản phẩm." }, { status: 404 });
}

