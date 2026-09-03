import type { CartItem, Product } from "@/lib/store-types";

export const CART_STORAGE_KEY = "tv-house-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("tv-house-cart-change", { detail: items }));
}

export function addProductToCart(product: Product) {
  const cart = readCart();
  const existing = cart.find((item) => item.id === product.id);
  if (existing) existing.quantity = Math.min(existing.quantity + 1, product.stock);
  else cart.push({ id: product.id, sku: product.sku, name: product.name, price: product.price, salePrice: product.salePrice, image: product.image, stock: product.stock, screenSize: product.screenSize, quantity: 1 });
  writeCart(cart);
  return cart;
}
