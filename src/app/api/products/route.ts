import { NextResponse } from "next/server";

import { createProduct, getProducts } from "@/lib/store-db";
import { parseProductInput } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ products: getProducts() });
}

export async function POST(request: Request) {
  try {
    const product = createProduct(parseProductInput(await request.json()));
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể thêm sản phẩm.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

