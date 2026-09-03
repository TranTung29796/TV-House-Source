import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";

import type { Order, OrderItem, Product, ProductInput } from "@/lib/store-types";

const databasePath = process.env.DATABASE_PATH ?? join(process.cwd(), "data", "tv-store.db");

type DatabaseGlobal = typeof globalThis & { __tvStoreDatabase?: DatabaseSync };

function openDatabase() {
  mkdirSync(dirname(databasePath), { recursive: true });
  const database = new DatabaseSync(databasePath, {
    enableForeignKeyConstraints: true,
    timeout: 5_000,
  });

  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      screen_size INTEGER NOT NULL CHECK (screen_size > 0),
      resolution TEXT NOT NULL,
      price INTEGER NOT NULL CHECK (price >= 0),
      sale_price INTEGER CHECK (sale_price IS NULL OR sale_price >= 0),
      stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'BANK')),
      status TEXT NOT NULL DEFAULT 'Mới' CHECK (status IN ('Mới', 'Đang xử lý', 'Đang giao', 'Hoàn thành', 'Đã hủy')),
      total INTEGER NOT NULL CHECK (total >= 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) STRICT;

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    ) STRICT;

    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
    CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
  `);

  seedProducts(database);
  database.exec("PRAGMA optimize;");
  return database;
}

function seedProducts(database: DatabaseSync) {
  const row = database.prepare("SELECT COUNT(*) AS total FROM products").get() as { total: number };
  if (row.total > 0) return;

  const products: ProductInput[] = [
    {
      sku: "SS-QLED-55Q80",
      name: "Smart TV QLED Vision Q80 55 inch",
      brand: "Samsung",
      category: "QLED",
      screenSize: 55,
      resolution: "4K Ultra HD",
      price: 21990000,
      salePrice: 18490000,
      stock: 12,
      image: "/images/tv-hero.png",
      description: "Quantum HDR, tần số quét 120 Hz và hệ điều hành thông minh cho trải nghiệm thể thao mượt mà.",
      featured: true,
    },
    {
      sku: "LG-OLED-65C4",
      name: "Smart TV OLED Cinema C4 65 inch",
      brand: "LG",
      category: "OLED",
      screenSize: 65,
      resolution: "4K Ultra HD",
      price: 42990000,
      salePrice: 38990000,
      stock: 7,
      image: "/images/tv-hero.png",
      description: "Điểm ảnh tự phát sáng, màu đen tuyệt đối, Dolby Vision và bộ xử lý AI thế hệ mới.",
      featured: true,
    },
    {
      sku: "SN-MINI-65X95",
      name: "Google TV Mini LED Master X95 65 inch",
      brand: "Sony",
      category: "Mini LED",
      screenSize: 65,
      resolution: "4K Ultra HD",
      price: 49990000,
      salePrice: 45990000,
      stock: 5,
      image: "/images/tv-hero.png",
      description: "Độ sáng cao, chống chói, âm thanh bám theo hình ảnh và kho ứng dụng Google TV phong phú.",
      featured: true,
    },
    {
      sku: "TCL-QLED-55C655",
      name: "Google TV QLED C655 55 inch",
      brand: "TCL",
      category: "QLED",
      screenSize: 55,
      resolution: "4K Ultra HD",
      price: 13990000,
      salePrice: 11990000,
      stock: 18,
      image: "/images/tv-hero.png",
      description: "Dải màu rộng, Dolby Atmos và thiết kế viền mỏng phù hợp phòng khách hiện đại.",
      featured: false,
    },
    {
      sku: "SS-CRYSTAL-43DU",
      name: "Smart TV Crystal UHD DU8000 43 inch",
      brand: "Samsung",
      category: "LED",
      screenSize: 43,
      resolution: "4K Ultra HD",
      price: 10990000,
      salePrice: 9490000,
      stock: 24,
      image: "/images/tv-hero.png",
      description: "Thiết kế AirSlim, nâng cấp hình ảnh lên chuẩn 4K và điều khiển giọng nói tiếng Việt.",
      featured: false,
    },
    {
      sku: "LG-NANO-50NANO",
      name: "Smart TV NanoCell NANO81 50 inch",
      brand: "LG",
      category: "NanoCell",
      screenSize: 50,
      resolution: "4K Ultra HD",
      price: 14990000,
      salePrice: null,
      stock: 9,
      image: "/images/tv-hero.png",
      description: "Màu sắc tinh khiết, giao diện webOS trực quan và chia sẻ nội dung từ điện thoại nhanh chóng.",
      featured: false,
    },
    {
      sku: "TCL-4K-43P755",
      name: "Google TV P755 43 inch",
      brand: "TCL",
      category: "LED",
      screenSize: 43,
      resolution: "4K Ultra HD",
      price: 8990000,
      salePrice: 7490000,
      stock: 30,
      image: "/images/tv-hero.png",
      description: "Lựa chọn tiết kiệm cho gia đình với HDR10+, Chromecast và tìm kiếm bằng giọng nói.",
      featured: false,
    },
    {
      sku: "SN-OLED-55A80",
      name: "Google TV OLED A80L 55 inch",
      brand: "Sony",
      category: "OLED",
      screenSize: 55,
      resolution: "4K Ultra HD",
      price: 38990000,
      salePrice: 34990000,
      stock: 6,
      image: "/images/tv-hero.png",
      description: "Hình ảnh điện ảnh, âm thanh phát ra từ màn hình và hỗ trợ chơi game 4K 120 fps.",
      featured: true,
    },
  ];

  const insert = database.prepare(`
    INSERT INTO products (
      sku, name, brand, category, screen_size, resolution, price, sale_price,
      stock, image, description, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const product of products) {
    insert.run(
      product.sku,
      product.name,
      product.brand,
      product.category,
      product.screenSize,
      product.resolution,
      product.price,
      product.salePrice,
      product.stock,
      product.image,
      product.description,
      product.featured ? 1 : 0,
    );
  }
}

const databaseGlobal = globalThis as DatabaseGlobal;
const db = databaseGlobal.__tvStoreDatabase ?? openDatabase();
if (process.env.NODE_ENV !== "production") databaseGlobal.__tvStoreDatabase = db;

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    sku: String(row.sku),
    name: String(row.name),
    brand: String(row.brand),
    category: String(row.category),
    screenSize: Number(row.screen_size),
    resolution: String(row.resolution),
    price: Number(row.price),
    salePrice: row.sale_price === null ? null : Number(row.sale_price),
    stock: Number(row.stock),
    image: String(row.image),
    description: String(row.description),
    featured: Boolean(row.featured),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  return {
    id: Number(row.id),
    code: String(row.code),
    customerName: String(row.customer_name),
    phone: String(row.phone),
    address: String(row.address),
    paymentMethod: String(row.payment_method) as Order["paymentMethod"],
    status: String(row.status) as Order["status"],
    total: Number(row.total),
    createdAt: String(row.created_at),
  };
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id: Number(row.id),
    orderId: Number(row.order_id),
    productId: row.product_id === null ? null : Number(row.product_id),
    productName: String(row.product_name),
    unitPrice: Number(row.unit_price),
    quantity: Number(row.quantity),
    subtotal: Number(row.subtotal),
  };
}

export function getProducts() {
  return (db.prepare("SELECT * FROM products ORDER BY featured DESC, id DESC").all() as Record<string, unknown>[]).map(mapProduct);
}

export function getProduct(id: number) {
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  return row ? mapProduct(row) : null;
}

export function createProduct(input: ProductInput) {
  const result = db.prepare(`
    INSERT INTO products (
      sku, name, brand, category, screen_size, resolution, price, sale_price,
      stock, image, description, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.sku, input.name, input.brand, input.category, input.screenSize,
    input.resolution, input.price, input.salePrice, input.stock, input.image,
    input.description, input.featured ? 1 : 0,
  );
  return getProduct(Number(result.lastInsertRowid));
}

export function updateProduct(id: number, input: ProductInput) {
  db.prepare(`
    UPDATE products SET
      sku = ?, name = ?, brand = ?, category = ?, screen_size = ?, resolution = ?,
      price = ?, sale_price = ?, stock = ?, image = ?, description = ?, featured = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    input.sku, input.name, input.brand, input.category, input.screenSize,
    input.resolution, input.price, input.salePrice, input.stock, input.image,
    input.description, input.featured ? 1 : 0, id,
  );
  return getProduct(id);
}

export function deleteProduct(id: number) {
  return db.prepare("DELETE FROM products WHERE id = ?").run(id).changes > 0;
}

export function getOrders() {
  return (db.prepare("SELECT * FROM orders ORDER BY id DESC").all() as Record<string, unknown>[]).map(mapOrder);
}

export function getOrder(id: number) {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  const order = mapOrder(row);
  order.items = (db.prepare("SELECT * FROM order_items WHERE order_id = ? ORDER BY id").all(id) as Record<string, unknown>[]).map(mapOrderItem);
  return order;
}

export function createOrder(input: {
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: Order["paymentMethod"];
  items: Array<{ productId: number; quantity: number }>;
}) {
  const requested = new Map<number, number>();
  for (const item of input.items) requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity);

  const products = Array.from(requested, ([id, quantity]) => {
    const product = getProduct(id);
    if (!product) throw new Error(`Sản phẩm #${id} không tồn tại.`);
    if (quantity < 1 || quantity > product.stock) throw new Error(`Số lượng của ${product.name} không hợp lệ.`);
    const unitPrice = product.salePrice ?? product.price;
    return { product, quantity, unitPrice, subtotal: unitPrice * quantity };
  });
  const total = products.reduce((sum, item) => sum + item.subtotal, 0);
  const code = `HD${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  db.exec("BEGIN IMMEDIATE");
  try {
    const orderResult = db.prepare(`
      INSERT INTO orders (code, customer_name, phone, address, payment_method, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(code, input.customerName, input.phone, input.address, input.paymentMethod, total);
    const orderId = Number(orderResult.lastInsertRowid);
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const decreaseStock = db.prepare("UPDATE products SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock >= ?");

    for (const item of products) {
      const stockResult = decreaseStock.run(item.quantity, item.product.id, item.quantity);
      if (stockResult.changes !== 1) throw new Error(`${item.product.name} vừa hết hàng.`);
      insertItem.run(orderId, item.product.id, item.product.name, item.unitPrice, item.quantity, item.subtotal);
    }
    db.exec("COMMIT");
    return getOrder(orderId);
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function updateOrderStatus(id: number, status: Order["status"]) {
  const allowed: Order["status"][] = ["Mới", "Đang xử lý", "Đang giao", "Hoàn thành", "Đã hủy"];
  if (!allowed.includes(status)) throw new Error("Trạng thái hóa đơn không hợp lệ.");
  db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, id);
  return getOrder(id);
}

export function getDashboardStats() {
  const productCount = (db.prepare("SELECT COUNT(*) AS value FROM products").get() as { value: number }).value;
  const orderCount = (db.prepare("SELECT COUNT(*) AS value FROM orders").get() as { value: number }).value;
  const revenue = (db.prepare("SELECT COALESCE(SUM(total), 0) AS value FROM orders WHERE status != 'Đã hủy'").get() as { value: number }).value;
  const lowStock = (db.prepare("SELECT COUNT(*) AS value FROM products WHERE stock < 8").get() as { value: number }).value;
  return { productCount, orderCount, revenue, lowStock };
}

