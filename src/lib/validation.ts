import type { ProductInput } from "@/lib/store-types";

function requiredString(value: unknown, label: string) {
  const result = String(value ?? "").trim();
  if (!result) throw new Error(`${label} không được để trống.`);
  return result;
}

function nonNegativeNumber(value: unknown, label: string) {
  const result = Number(value);
  if (!Number.isFinite(result) || result < 0) throw new Error(`${label} không hợp lệ.`);
  return Math.round(result);
}

export function parseProductInput(payload: Record<string, unknown>): ProductInput {
  const salePrice = payload.salePrice === null || payload.salePrice === "" ? null : nonNegativeNumber(payload.salePrice, "Giá khuyến mãi");
  return {
    sku: requiredString(payload.sku, "Mã sản phẩm").toUpperCase(),
    name: requiredString(payload.name, "Tên sản phẩm"),
    brand: requiredString(payload.brand, "Thương hiệu"),
    category: requiredString(payload.category, "Công nghệ màn hình"),
    screenSize: nonNegativeNumber(payload.screenSize, "Kích thước"),
    resolution: requiredString(payload.resolution, "Độ phân giải"),
    price: nonNegativeNumber(payload.price, "Giá bán"),
    salePrice,
    stock: nonNegativeNumber(payload.stock, "Tồn kho"),
    image: requiredString(payload.image || "/images/tv-hero.png", "Ảnh"),
    description: requiredString(payload.description, "Mô tả"),
    featured: Boolean(payload.featured),
  };
}

