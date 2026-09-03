# TV House - Website bán tivi

Đồ án giữa kỳ xây dựng website bán TV bằng Next.js, React, TypeScript và SQLite.

## Chức năng

- Trang chủ hiển thị danh sách TV, tìm kiếm và lọc theo thương hiệu.
- Giỏ hàng lưu tạm trên trình duyệt, thay đổi số lượng và xóa sản phẩm.
- Đặt hàng tạo đồng thời hóa đơn và chi tiết hóa đơn trong SQLite.
- Quản trị thêm, sửa, xóa sản phẩm và theo dõi tồn kho.
- Xem danh sách, chi tiết hóa đơn và cập nhật trạng thái xử lý.
- Giao diện responsive cho máy tính, máy tính bảng và điện thoại.

## Ba bảng dữ liệu

- `products`: thông tin sản phẩm và tồn kho.
- `orders`: thông tin hóa đơn, khách hàng, trạng thái và tổng tiền.
- `order_items`: từng sản phẩm thuộc hóa đơn, số lượng và giá tại thời điểm mua.

## Yêu cầu môi trường

- Node.js 22.23.2
- pnpm 9.12.0

Không cần cài MySQL, SQL Server hay phần mềm quản lý database. SQLite được tích hợp trong Node.js 22.23.2 và file dữ liệu nằm tại `data/tv-store.db`.

## Chạy lần đầu

```bash
corepack enable
corepack prepare pnpm@9.12.0 --activate
pnpm install --frozen-lockfile
pnpm run dev
```

Mở http://localhost:3005.

Nếu máy chưa có file database, chương trình tự tạo cấu trúc ba bảng và thêm 8 sản phẩm mẫu. Có thể đổi vị trí file SQLite bằng biến môi trường `DATABASE_PATH`.

## Kiểm tra trước khi nộp

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
```

Chạy bản production:

```bash
pnpm run start
```

Mở http://localhost:3004.

## Tài liệu

- Hướng dẫn bắt đầu nhanh bằng tiếng Việt: `StartRun.md`
- Lược đồ SQL tham khảo: `database/schema.sql`

## Cấu trúc chính

```text
src/app/(marketing)/page.tsx        Trang chủ
src/app/cart/page.tsx               Trang giỏ hàng
src/app/admin/page.tsx              Trang quản trị
src/app/api/products/               API CRUD sản phẩm
src/app/api/orders/                 API hóa đơn
src/components/store/               Thành phần giao diện cửa hàng
src/lib/store-db.ts                  Khởi tạo và truy vấn SQLite
src/lib/store-types.ts               Kiểu dữ liệu dùng chung
data/tv-store.db                     File database SQLite
```

## Ghi chú khi chuyển sang máy khác

Không chép thư mục `node_modules` hoặc `.next`. Chỉ cần chép mã nguồn, chạy đúng Node.js 22.23.2 và `pnpm install --frozen-lockfile`.
