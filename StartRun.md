# Cách chạy dự án TV House

Dùng được trên Windows, macOS và Linux.

## Yêu cầu

- Node.js đúng phiên bản 22.23.2.
- Internet trong lần cài thư viện đầu tiên.

Kiểm tra phiên bản:

```bash
node --version
```

## Cài thư viện và chạy

Mở Terminal hoặc PowerShell tại thư mục chứa `package.json`:

```bash
corepack enable
corepack prepare pnpm@9.12.0 --activate
pnpm install --frozen-lockfile
pnpm run dev
```

Mở http://localhost:3005. Trang giỏ hàng ở `/cart`, trang quản trị ở `/admin`.

## Build production

Kiểm tra đầy đủ rồi build:

```bash
pnpm run typecheck
pnpm run lint
pnpm run test
pnpm run build
pnpm run start
```

Mở http://localhost:3004.

Chỉ build và chạy nhanh:

```bash
pnpm run build
pnpm run start
```

## Chuyển sang máy khác

1. Giải nén `TV-House-Source.zip`.
2. Cài đúng Node.js 22.23.2.
3. Chạy lại phần "Cài thư viện và chạy" ở trên.

Không chép `node_modules`, `.next` hoặc `.turbo`. SQLite tự tạo tại `data/tv-store.db`; chép theo file này nếu muốn giữ sản phẩm và hóa đơn.

Nếu cổng 3005 đang bận:

```bash
node --no-warnings ./node_modules/next/dist/bin/next dev --port 3010
```
