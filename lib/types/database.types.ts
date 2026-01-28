// Database Types for Supabase

export type Product = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  brand: string;
  category: 'all' | 'camping' | 'golf' | 'fashion' | 'beauty' | 'electronics';
  kr_price: number;
  jp_price: number;
  weight: number;
  image_url: string | null;
  description: string | null;
  is_hot: boolean;
  is_active: boolean;
};

export type Order = {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  final_price: number;
  admin_memo: string | null;
  customer_memo: string | null;
};

export type OrderWithProduct = Order & {
  product: Product;
};

export type GlobalSetting = {
  key: string;
  value: number;
  description: string | null;
  updated_at: string;
};

export type GlobalSettings = {
  yen_rate: number;
  shipping_base: number;
  shipping_per_half_kg: number;
  tax_threshold: number;
  tax_rate: number;
  fee_rate: number;
};

export type PriceCalculation = {
  item_krw: number;        // 상품 원화 환산가
  tax: number;             // 관부가세
  shipping: number;        // 배송비
  fee: number;             // 수수료
  final_price: number;     // 최종 가격
  saved_amount: number;    // 절약 금액
};

export type HeroBannerItem = {
  id: string;
  created_at: string;
  updated_at: string;
  sort_order: number;
  image_url: string;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  bg_color: string | null;
  is_active: boolean;
};
