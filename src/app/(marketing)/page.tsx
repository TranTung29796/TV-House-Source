import Link from "next/link";
import { ArrowRight, BadgeCheck, Headphones, ShieldCheck, Truck } from "lucide-react";

import { ProductCatalog } from "@/components/store/product-catalog";
import { getProducts } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const products = getProducts();

  return (
    <>
      <section className="store-hero">
        <div className="store-hero__image" aria-hidden="true" />
        <div className="store-container store-hero__content">
          <p className="store-eyebrow">Khuyến mãi giữa năm</p>
          <h1>Nâng tầm giải trí <span>tại gia</span></h1>
          <p>Smart TV chính hãng, hình ảnh sắc nét và giao hàng lắp đặt tận nơi trên toàn quốc.</p>
          <div className="store-hero__actions">
            <a className="store-button store-button--primary" href="#san-pham">Xem sản phẩm <ArrowRight size={18} /></a>
            <Link className="store-button store-button--ghost" href="/admin">Quản lý cửa hàng</Link>
          </div>
          <div className="store-hero__proof">
            <span><BadgeCheck size={18} /> 100% chính hãng</span>
            <span><ShieldCheck size={18} /> Bảo hành 2 năm</span>
          </div>
        </div>
      </section>
      <section className="store-benefits" aria-label="Quyền lợi mua hàng">
        <div className="store-container store-benefits__grid">
          <article><Truck /><div><strong>Giao nhanh miễn phí</strong><span>Đơn hàng từ 10 triệu đồng</span></div></article>
          <article><ShieldCheck /><div><strong>Bảo hành tận nhà</strong><span>Hỗ trợ chính hãng toàn quốc</span></div></article>
          <article><Headphones /><div><strong>Tư vấn chuyên sâu</strong><span>Hotline 1900 6868 mỗi ngày</span></div></article>
        </div>
      </section>
      <section className="store-catalog-section" id="san-pham">
        <div className="store-container">
          <div className="store-section-heading">
            <div><p className="store-eyebrow">Danh mục nổi bật</p><h2>Chọn TV phù hợp không gian của bạn</h2></div>
            <p>{products.length} sản phẩm đang có sẵn</p>
          </div>
          <ProductCatalog products={products} />
        </div>
      </section>
    </>
  );
}
