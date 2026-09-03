import Link from "next/link";
import { Store } from "lucide-react";

export function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-container store-footer__grid">
        <div><Link href="/" className="store-brand store-brand--footer"><span className="store-brand__mark"><Store size={20} /></span><span><strong>TV</strong> House</span></Link><p>Giải pháp mua sắm TV chính hãng, minh bạch và thuận tiện cho mọi gia đình.</p></div>
        <div><strong>Liên hệ</strong><span>1900 6868</span><span>support@tvhouse.vn</span></div>
        <div><strong>Địa chỉ</strong><span>123 Nguyễn Văn Linh</span><span>Đà Nẵng, Việt Nam</span></div>
        <div><strong>Hệ thống</strong><Link href="/admin">Quản trị sản phẩm</Link><Link href="/admin?tab=orders">Quản lý hóa đơn</Link></div>
      </div>
      <div className="store-container store-footer__bottom">© 2026 TV House. Đồ án giữa kỳ môn Lập trình Web.</div>
    </footer>
  );
}
