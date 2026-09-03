"use client";

import Link from "next/link";
import { Menu, ShoppingCart, Store, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { readCart } from "@/lib/cart";
import { rememberStoreScroll, restoreStoreScroll } from "@/lib/store-scroll";
import type { CartItem } from "@/lib/store-types";

export function StoreHeader() {
  const pathname = usePathname();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartAnimating, setCartAnimating] = useState(false);

  useEffect(() => {
    let animationTimer: number | undefined;
    const sync = (event?: Event) => {
      setCart((event as CustomEvent<CartItem[]>)?.detail ?? readCart());
      if (event?.type === "tv-house-cart-change") {
        setCartAnimating(false);
        requestAnimationFrame(() => setCartAnimating(true));
        if (animationTimer) window.clearTimeout(animationTimer);
        animationTimer = window.setTimeout(() => setCartAnimating(false), 700);
      }
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("tv-house-cart-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("tv-house-cart-change", sync);
      if (animationTimer) window.clearTimeout(animationTimer);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    restoreStoreScroll(pathname);
  }, [pathname]);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="store-header">
      <div className="store-container store-header__inner">
        <Link href="/" className="store-brand" aria-label="TV House - Trang chủ"><span className="store-brand__mark"><Store size={22} /></span><span><strong>TV</strong> House</span></Link>
        <button className="store-icon-button store-header__menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Đóng menu" : "Mở menu"}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={`store-nav${menuOpen ? " is-open" : ""}`} aria-label="Điều hướng chính">
          <Link className={pathname === "/" ? "is-active" : ""} href="/">Trang chủ</Link>
          <Link href="/#san-pham">Sản phẩm</Link>
          <Link className={pathname.startsWith("/admin") ? "is-active" : ""} href="/admin">Quản trị</Link>
        </nav>
        <Link className={`store-cart-link${cartAnimating ? " is-updated" : ""}`} href="/cart" onClick={() => rememberStoreScroll(pathname)} aria-label={`Giỏ hàng có ${count} sản phẩm`}><ShoppingCart size={21} /><span>Giỏ hàng</span>{count > 0 ? <b>{count}</b> : null}</Link>
      </div>
    </header>
  );
}
