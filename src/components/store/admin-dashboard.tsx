"use client";

import { Boxes, ChevronRight, CircleDollarSign, ClipboardList, Edit3, Eye, PackagePlus, Plus, Search, Trash2, TriangleAlert, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import type { Order, Product, ProductInput } from "@/lib/store-types";

const money = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
const emptyProduct: ProductInput = { sku: "", name: "", brand: "Samsung", category: "LED", screenSize: 55, resolution: "4K Ultra HD", price: 0, salePrice: null, stock: 0, image: "/images/tv-hero.png", description: "", featured: false };
const statuses: Order["status"][] = ["Mới", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"];

export function AdminDashboard({ initialProducts, initialOrders, initialStats }: { initialProducts: Product[]; initialOrders: Order[]; initialStats: { productCount: number; orderCount: number; revenue: number; lowStock: number } }) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => { if (new URLSearchParams(window.location.search).get("tab") === "orders") setTab("orders"); }, []);
  const visibleProducts = useMemo(() => products.filter((item) => `${item.name} ${item.sku} ${item.brand}`.toLowerCase().includes(query.toLowerCase())), [products, query]);
  const visibleOrders = useMemo(() => orders.filter((item) => `${item.code} ${item.customerName} ${item.phone}`.toLowerCase().includes(query.toLowerCase())), [orders, query]);
  const stats = { productCount: products.length, orderCount: orders.length, revenue: orders.filter((item) => item.status !== "Đã hủy").reduce((sum, item) => sum + item.total, 0) || initialStats.revenue, lowStock: products.filter((item) => item.stock < 8).length };

  async function refreshProducts() { const response = await fetch("/api/products"); const data = await response.json() as { products: Product[] }; setProducts(data.products); }
  async function refreshOrders() { const response = await fetch("/api/orders"); const data = await response.json() as { orders: Order[] }; setOrders(data.orders); }
  async function removeProduct(product: Product) {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”?`)) return;
    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (response.ok) { await refreshProducts(); setMessage("Đã xóa sản phẩm."); } else setMessage("Không thể xóa sản phẩm.");
  }
  async function openOrder(order: Order) { const response = await fetch(`/api/orders/${order.id}`); const data = await response.json() as { order: Order }; setSelectedOrder(data.order); }
  async function changeStatus(order: Order, status: Order["status"]) {
    const response = await fetch(`/api/orders/${order.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status }) });
    if (response.ok) { await refreshOrders(); if (selectedOrder?.id === order.id) setSelectedOrder({ ...selectedOrder, status }); }
  }

  return (
    <div className="store-admin-page">
      <div className="store-container">
        <div className="store-admin-heading"><div><p className="store-eyebrow">Hệ thống nội bộ</p><h1>Quản trị cửa hàng</h1><p>Theo dõi sản phẩm, tồn kho và hóa đơn trên cùng một màn hình.</p></div><button className="store-button store-button--primary" onClick={() => setEditing("new")}><Plus size={18} /> Thêm sản phẩm</button></div>
        <div className="store-stat-grid">
          <Stat icon={<Boxes />} label="Sản phẩm" value={String(stats.productCount)} note="Mặt hàng đang kinh doanh" />
          <Stat icon={<ClipboardList />} label="Hóa đơn" value={String(stats.orderCount)} note="Tổng đơn đã tiếp nhận" />
          <Stat icon={<CircleDollarSign />} label="Doanh thu" value={money.format(stats.revenue)} note="Không tính đơn đã hủy" />
          <Stat icon={<TriangleAlert />} label="Sắp hết hàng" value={String(stats.lowStock)} note="Tồn kho dưới 8 sản phẩm" warning />
        </div>
        <div className="store-admin-panel">
          <div className="store-admin-toolbar">
            <div className="store-tabs"><button className={tab === "products" ? "is-active" : ""} onClick={() => { setTab("products"); setQuery(""); }}>Sản phẩm <span>{products.length}</span></button><button className={tab === "orders" ? "is-active" : ""} onClick={() => { setTab("orders"); setQuery(""); }}>Hóa đơn <span>{orders.length}</span></button></div>
            <label className="store-search store-search--small"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={tab === "products" ? "Tìm sản phẩm..." : "Tìm hóa đơn..."} /></label>
          </div>
          {message ? <div className="store-admin-message">{message}<button onClick={() => setMessage("")}><X size={15} /></button></div> : null}
          {tab === "products" ? <ProductTable products={visibleProducts} onEdit={setEditing} onDelete={removeProduct} /> : <OrderTable orders={visibleOrders} onOpen={openOrder} onStatus={changeStatus} />}
        </div>
      </div>
      {editing ? <ProductModal product={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={async () => { await refreshProducts(); setEditing(null); setMessage("Đã lưu thông tin sản phẩm."); }} /> : null}
      {selectedOrder ? <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} /> : null}
    </div>
  );
}

function Stat({ icon, label, value, note, warning = false }: { icon: React.ReactNode; label: string; value: string; note: string; warning?: boolean }) {
  return <article className={`store-stat${warning ? " store-stat--warning" : ""}`}><span>{icon}</span><div><p>{label}</p><strong>{value}</strong><small>{note}</small></div></article>;
}

function ProductTable({ products, onEdit, onDelete }: { products: Product[]; onEdit: (product: Product) => void; onDelete: (product: Product) => void }) {
  return <div className="store-table-wrap"><table className="store-table"><thead><tr><th>Sản phẩm</th><th>Phân loại</th><th>Giá bán</th><th>Tồn kho</th><th><span className="sr-only">Thao tác</span></th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="store-table-product"><Image src={product.image} alt="" width={68} height={50} /><div><strong>{product.name}</strong><span>{product.sku} · {product.brand}</span></div></div></td><td>{product.screenSize}&quot; · {product.category}<small>{product.resolution}</small></td><td><strong>{money.format(product.salePrice ?? product.price)}</strong>{product.salePrice ? <del>{money.format(product.price)}</del> : null}</td><td><span className={`store-stock${product.stock < 8 ? " is-low" : ""}`}>{product.stock}</span></td><td><div className="store-table-actions"><button onClick={() => onEdit(product)} title="Sửa"><Edit3 size={17} /></button><button onClick={() => onDelete(product)} title="Xóa"><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div>;
}

function OrderTable({ orders, onOpen, onStatus }: { orders: Order[]; onOpen: (order: Order) => void; onStatus: (order: Order, status: Order["status"]) => void }) {
  return <div className="store-table-wrap"><table className="store-table"><thead><tr><th>Mã hóa đơn</th><th>Khách hàng</th><th>Ngày tạo</th><th>Tổng tiền</th><th>Trạng thái</th><th><span className="sr-only">Chi tiết</span></th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.code}</strong></td><td><strong>{order.customerName}</strong><small>{order.phone}</small></td><td>{new Date(`${order.createdAt}Z`).toLocaleString("vi-VN")}</td><td><strong>{money.format(order.total)}</strong></td><td><select className={`store-status store-status--${order.status.replaceAll(" ", "-").toLowerCase()}`} value={order.status} onChange={(event) => onStatus(order, event.target.value as Order["status"])}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td><button className="store-view-button" onClick={() => onOpen(order)}><Eye size={17} /> Xem <ChevronRight size={15} /></button></td></tr>)}</tbody></table>{!orders.length ? <div className="store-empty"><ClipboardList size={36} /><p>Chưa có hóa đơn nào. Hãy đặt thử một đơn hàng ở trang giỏ hàng.</p></div> : null}</div>;
}

function ProductModal({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<ProductInput>(product ? { sku: product.sku, name: product.name, brand: product.brand, category: product.category, screenSize: product.screenSize, resolution: product.resolution, price: product.price, salePrice: product.salePrice, stock: product.stock, image: product.image, description: product.description, featured: product.featured } : emptyProduct);
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((current) => ({ ...current, [key]: value }));
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(""); const response = await fetch(product ? `/api/products/${product.id}` : "/api/products", { method: product ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) }); const payload = await response.json() as { error?: string }; if (!response.ok) { setError(payload.error ?? "Không thể lưu sản phẩm."); setSaving(false); return; } onSaved(); }
  return <div className="store-modal-backdrop" role="presentation"><section className="store-modal store-product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title"><div className="store-modal__header"><div><p className="store-eyebrow">Danh mục sản phẩm</p><h2 id="product-modal-title">{product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h2></div><button className="store-icon-button" onClick={onClose} aria-label="Đóng"><X /></button></div><form onSubmit={submit} className="store-product-form"><label>Mã sản phẩm<input required value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="SS-QLED-55Q80" /></label><label className="store-form-span-2">Tên sản phẩm<input required value={form.name} onChange={(e) => set("name", e.target.value)} /></label><label>Thương hiệu<select value={form.brand} onChange={(e) => set("brand", e.target.value)}><option>Samsung</option><option>LG</option><option>Sony</option><option>TCL</option><option>Khác</option></select></label><label>Công nghệ<select value={form.category} onChange={(e) => set("category", e.target.value)}><option>LED</option><option>QLED</option><option>OLED</option><option>Mini LED</option><option>NanoCell</option></select></label><label>Kích thước (inch)<input type="number" min="1" required value={form.screenSize} onChange={(e) => set("screenSize", Number(e.target.value))} /></label><label>Độ phân giải<input required value={form.resolution} onChange={(e) => set("resolution", e.target.value)} /></label><label>Giá niêm yết<input type="number" min="0" required value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></label><label>Giá khuyến mãi<input type="number" min="0" value={form.salePrice ?? ""} onChange={(e) => set("salePrice", e.target.value ? Number(e.target.value) : null)} /></label><label>Tồn kho<input type="number" min="0" required value={form.stock} onChange={(e) => set("stock", Number(e.target.value))} /></label><label className="store-form-span-2">Đường dẫn ảnh<input required value={form.image} onChange={(e) => set("image", e.target.value)} /></label><label className="store-form-span-3">Mô tả<textarea rows={3} required value={form.description} onChange={(e) => set("description", e.target.value)} /></label><label className="store-checkbox store-form-span-3"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Đánh dấu là sản phẩm nổi bật</label>{error ? <p className="store-form-error store-form-span-3">{error}</p> : null}<div className="store-modal__actions store-form-span-3"><button type="button" className="store-button store-button--outline" onClick={onClose}>Hủy</button><button className="store-button store-button--primary" disabled={saving}><PackagePlus size={18} /> {saving ? "Đang lưu..." : "Lưu sản phẩm"}</button></div></form></section></div>;
}

function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return <div className="store-modal-backdrop"><section className="store-modal store-order-modal" role="dialog" aria-modal="true"><div className="store-modal__header"><div><p className="store-eyebrow">Chi tiết hóa đơn</p><h2>{order.code}</h2></div><button className="store-icon-button" onClick={onClose} aria-label="Đóng"><X /></button></div><div className="store-order-customer"><div><span>Khách hàng</span><strong>{order.customerName}</strong><small>{order.phone}</small></div><div><span>Địa chỉ giao hàng</span><strong>{order.address}</strong></div><div><span>Thanh toán</span><strong>{order.paymentMethod === "COD" ? "Khi nhận hàng" : "Chuyển khoản"}</strong></div></div><div className="store-order-items">{order.items?.map((item) => <div key={item.id}><div><strong>{item.productName}</strong><span>{item.quantity} × {money.format(item.unitPrice)}</span></div><strong>{money.format(item.subtotal)}</strong></div>)}</div><div className="store-order-total"><span>Tổng hóa đơn</span><strong>{money.format(order.total)}</strong></div></section></div>;
}
