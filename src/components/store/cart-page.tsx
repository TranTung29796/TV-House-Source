"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { readCart, writeCart } from "@/lib/cart";
import { getStoreReturnPath, markStoreScrollRestore } from "@/lib/store-scroll";
import type { CartItem, Order } from "@/lib/store-types";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [pendingRemoval, setPendingRemoval] = useState<CartItem | null>(null);
  const [removedNotice, setRemovedNotice] = useState("");
  const removalNoticeTimer = useRef<number | null>(null);
  const [form, setForm] = useState({ customerName: "", phone: "", address: "", paymentMethod: "COD" });

  useEffect(() => {
    setItems(readCart()); setReady(true);
    return () => {
      if (removalNoticeTimer.current) window.clearTimeout(removalNoticeTimer.current);
    };
  }, []);
  useEffect(() => {
    const prepareRestore = () => markStoreScrollRestore();
    window.addEventListener("popstate", prepareRestore);
    return () => window.removeEventListener("popstate", prepareRestore);
  }, []);
  useEffect(() => {
    if (!pendingRemoval) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPendingRemoval(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [pendingRemoval]);
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.quantity, 0), [items]);

  function updateQuantity(id: number, quantity: number) {
    const next = items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) } : item);
    setItems(next); writeCart(next);
  }

  function confirmRemoval() {
    if (!pendingRemoval) return;
    const removedProduct = pendingRemoval;
    const next = items.filter((item) => item.id !== removedProduct.id);
    setItems(next); writeCart(next);
    setPendingRemoval(null);
    setRemovedNotice(removedProduct.name);
    if (removalNoticeTimer.current) window.clearTimeout(removalNoticeTimer.current);
    removalNoticeTimer.current = window.setTimeout(() => setRemovedNotice(""), 3000);
  }

  function returnToShopping() {
    const returnPath = getStoreReturnPath();
    markStoreScrollRestore();
    if (returnPath && window.history.length > 1) router.back();
    else router.push(returnPath ?? "/#san-pham");
  }

  async function checkout(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setError("");
    try {
      const response = await fetch("/api/orders", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...form, items: items.map((item) => ({ productId: item.id, quantity: item.quantity })) }) });
      const payload = await response.json() as { order?: Order; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error ?? "Không thể đặt hàng.");
      setOrder(payload.order); setItems([]); writeCart([]); window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Không thể đặt hàng.");
    } finally { setSubmitting(false); }
  }

  const removalFeedback = (
    <>
      {pendingRemoval ? (
        <div className="store-modal-backdrop" role="presentation" onClick={() => setPendingRemoval(null)}>
          <section className="store-modal store-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="remove-product-title" onClick={(event) => event.stopPropagation()}>
            <span className="store-confirm-modal__icon"><Trash2 size={24} /></span>
            <p className="store-eyebrow">Xác nhận thao tác</p>
            <h2 id="remove-product-title">Xóa khỏi giỏ hàng?</h2>
            <p>Số lượng của <strong>{pendingRemoval.name}</strong> đang là 1. Giảm tiếp sẽ xóa sản phẩm này khỏi giỏ hàng.</p>
            <div className="store-modal__actions">
              <button className="store-button store-button--outline" type="button" onClick={() => setPendingRemoval(null)}>Hủy</button>
              <button className="store-button store-button--danger" type="button" onClick={confirmRemoval}>Xóa sản phẩm</button>
            </div>
          </section>
        </div>
      ) : null}
      {removedNotice ? (
        <div className="store-cart-toast store-remove-toast" role="status" aria-live="polite">
          <span className="store-cart-toast__icon store-cart-toast__icon--danger"><Trash2 size={18} /></span>
          <div><strong>Đã xóa khỏi giỏ hàng</strong><span>{removedNotice}</span></div>
        </div>
      ) : null}
    </>
  );

  if (!ready) return <div className="store-page store-container"><div className="store-loading">Đang tải giỏ hàng...</div></div>;
  if (order) return (
    <div className="store-page store-container">
      <section className="store-success">
        <CheckCircle2 size={58} />
        <p className="store-eyebrow">Đặt hàng thành công</p>
        <h1>Cảm ơn bạn đã mua hàng</h1>
        <p>Mã hóa đơn của bạn là <strong>{order.code}</strong>. Nhân viên TV House sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
        <div className="store-success__total"><span>Tổng thanh toán</span><strong>{money.format(order.total)}</strong></div>
        <div className="store-success__actions"><Link className="store-button store-button--primary" href="/">Tiếp tục mua sắm</Link><Link className="store-button store-button--outline" href="/admin?tab=orders">Xem hóa đơn</Link></div>
      </section>
    </div>
  );
  if (!items.length) return (
    <div className="store-page store-container"><section className="store-empty-cart"><ShoppingBag size={56} /><h1>Giỏ hàng đang trống</h1><p>Hãy chọn chiếc TV phù hợp với không gian giải trí của bạn.</p><Link className="store-button store-button--primary" href="/#san-pham">Khám phá sản phẩm</Link></section>{removalFeedback}</div>
  );

  return (
    <div className="store-page store-container">
      <button className="store-back-link" type="button" onClick={returnToShopping}><ArrowLeft size={17} /> Tiếp tục mua sắm</button>
      <div className="store-page-heading"><div><p className="store-eyebrow">Đơn hàng của bạn</p><h1>Giỏ hàng</h1></div><span>{items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span></div>
      <div className="store-checkout-layout">
        <section className="store-cart-list" aria-label="Sản phẩm trong giỏ">
          {items.map((item) => <article className="store-cart-item" key={item.id}>
            <Image src={item.image} alt={item.name} width={150} height={112} />
            <div className="store-cart-item__info"><span>{item.sku}</span><h2>{item.name}</h2><p>{item.screenSize} inch · Chính hãng</p><strong>{money.format(item.salePrice ?? item.price)}</strong></div>
            <div className="store-quantity"><button type="button" onClick={() => item.quantity === 1 ? setPendingRemoval(item) : updateQuantity(item.id, item.quantity - 1)} aria-label={item.quantity === 1 ? "Xóa sản phẩm khỏi giỏ" : "Giảm số lượng"}><Minus size={16} /></button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Tăng số lượng"><Plus size={16} /></button></div>
            <button className="store-icon-button store-icon-button--danger" type="button" onClick={() => setPendingRemoval(item)} title="Xóa khỏi giỏ"><Trash2 size={18} /></button>
          </article>)}
        </section>

        <aside className="store-checkout-panel">
          <h2>Thông tin giao hàng</h2>
          <form onSubmit={checkout}>
            <label>Họ và tên<input required value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Nguyễn Văn An" /></label>
            <label>Số điện thoại<input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="0901234567" /></label>
            <label>Địa chỉ nhận hàng<textarea required rows={3} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Số nhà, đường, phường/xã, tỉnh/thành" /></label>
            <fieldset><legend>Phương thức thanh toán</legend><label className="store-radio"><input type="radio" name="payment" checked={form.paymentMethod === "COD"} onChange={() => setForm({ ...form, paymentMethod: "COD" })} /><span><strong>Thanh toán khi nhận hàng</strong><small>Trả tiền mặt hoặc quét mã khi giao hàng</small></span></label><label className="store-radio"><input type="radio" name="payment" checked={form.paymentMethod === "BANK"} onChange={() => setForm({ ...form, paymentMethod: "BANK" })} /><span><strong>Chuyển khoản ngân hàng</strong><small>Nhân viên sẽ gửi thông tin sau khi xác nhận</small></span></label></fieldset>
            <div className="store-order-summary"><p><span>Tạm tính</span><span>{money.format(total)}</span></p><p><span>Phí vận chuyển</span><strong>Miễn phí</strong></p><div><span>Tổng cộng</span><strong>{money.format(total)}</strong></div></div>
            {error ? <p className="store-form-error">{error}</p> : null}
            <button className="store-button store-button--primary store-button--full" disabled={submitting}>{submitting ? "Đang tạo hóa đơn..." : "Xác nhận đặt hàng"}</button>
          </form>
        </aside>
      </div>
      {removalFeedback}
    </div>
  );
}
