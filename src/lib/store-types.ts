export type Product = {
  id: number;
  sku: string;
  name: string;
  brand: string;
  category: string;
  screenSize: number;
  resolution: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string;
  description: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = Pick<
  Product,
  "id" | "sku" | "name" | "price" | "salePrice" | "image" | "stock" | "screenSize"
> & {
  quantity: number;
};

export type OrderItem = {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: "COD" | "BANK";
  status: "Mới" | "Đang xử lý" | "Đang giao" | "Hoàn thành" | "Đã hủy";
  total: number;
  createdAt: string;
  items?: OrderItem[];
};

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

