"use client";

import { Check, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { addProductToCart } from "@/lib/cart";
import { rememberStoreScroll } from "@/lib/store-scroll";
import type { Product } from "@/lib/store-types";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export function ProductCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("Tất cả");
  const [addedId, setAddedId] = useState<number | null>(null);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const notificationTimer = useRef<number | null>(null);
  const brands = ["Tất cả", ...new Set(products.map((product) => product.brand))];
  const filtered = useMemo(() => products.filter((product) => {
    const matchesBrand = brand === "Tất cả" || product.brand === brand;
    return matchesBrand && `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.toLowerCase());
  }), [brand, products, query]);

  useEffect(() => () => {
    if (notificationTimer.current) window.clearTimeout(notificationTimer.current);
  }, []);

  function add(product: Product) {
    addProductToCart(product);
    setAddedId(product.id);
    setAddedProduct(product);
    if (notificationTimer.current) window.clearTimeout(notificationTimer.current);
    notificationTimer.current = window.setTimeout(() => {
      setAddedId(null);
      setAddedProduct(null);
    }, 3000);
  }

  return (
    <div>
      <div className="store-catalog-toolbar">
        <label className="store-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, hãng, công nghệ..." /></label>
        <label className="store-filter"><SlidersHorizontal size={18} /><span>Thương hiệu</span><select value={brand} onChange={(event) => setBrand(event.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>
      <div className="store-product-grid">
        {filtered.map((product) => {
          const currentPrice = product.salePrice ?? product.price;
          const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
          return (
            <article className="store-product-card" key={product.id}>
              <div className="store-product-card__media">
                {discount ? <span className="store-product-card__sale">-{discount}%</span> : null}
                {product.featured ? <span className="store-product-card__featured">Bán chạy</span> : null}
                <Image src={product.image} alt={product.name} fill sizes="(max-width: 720px) 100vw, (max-width: 980px) 50vw, 25vw" />
              </div>
              <div className="store-product-card__body">
                <div className="store-product-card__meta"><span>{product.brand}</span><span>{product.category}</span></div>
                <h3>{product.name}</h3>
                <p className="store-product-card__spec">{product.screenSize} inch · {product.resolution}</p>
                <p className="store-product-card__description">{product.description}</p>
                <div className="store-product-card__price"><strong>{money.format(currentPrice)}</strong>{product.salePrice ? <del>{money.format(product.price)}</del> : null}</div>
                <div className="store-product-card__footer"><span className={product.stock < 8 ? "is-low" : ""}>{product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Hết hàng"}</span><button type="button" className={`store-icon-button store-icon-button--dark${addedId === product.id ? " is-added" : ""}`} onClick={() => add(product)} disabled={!product.stock} title="Thêm vào giỏ">{addedId === product.id ? <Check size={19} /> : <ShoppingCart size={19} />}</button></div>
              </div>
            </article>
          );
        })}
      </div>
      {!filtered.length ? <div className="store-empty">Không tìm thấy sản phẩm phù hợp.</div> : null}
      {addedProduct ? (
        <div className="store-cart-toast" role="status" aria-live="polite">
          <span className="store-cart-toast__icon"><Check size={18} /></span>
          <div><strong>Đã thêm vào giỏ hàng</strong><span>{addedProduct.name}</span></div>
          <Link href="/cart" onClick={() => rememberStoreScroll(window.location.pathname)}>Xem giỏ</Link>
        </div>
      ) : null}
    </div>
  );
}
