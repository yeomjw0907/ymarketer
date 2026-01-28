-- ================================================
-- Price Check (얼마면 돼?) Database Schema
-- Supabase PostgreSQL Schema
-- ================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. products (상품 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 상품 기본 정보
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('all', 'camping', 'golf', 'fashion', 'beauty', 'electronics')),
  
  -- 가격 정보
  kr_price INTEGER NOT NULL, -- 한국 최저가 (원화)
  jp_price INTEGER NOT NULL, -- 일본 가격 (엔화)
  
  -- 배송 정보
  weight NUMERIC(10, 2) NOT NULL DEFAULT 1.0, -- 무게 (kg)
  
  -- 이미지 및 설명
  image_url TEXT,
  description TEXT,
  
  -- 추가 정보
  is_hot BOOLEAN DEFAULT false, -- 메인 노출 여부
  is_active BOOLEAN DEFAULT true -- 판매 활성 상태
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_hot ON products(is_hot) WHERE is_hot = true;
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- ================================================
-- 2. orders (주문 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 상품 참조
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- 주문자 정보
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  
  -- 주문 상태
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')),
  
  -- 가격 히스토리
  final_price INTEGER NOT NULL, -- 주문 당시 계산된 최종 가격
  
  -- 추가 메모
  admin_memo TEXT,
  customer_memo TEXT
);

-- Create indexes
CREATE INDEX idx_orders_product_id ON orders(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);

-- ================================================
-- 3. global_settings (전역 설정 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS global_settings (
  key TEXT PRIMARY KEY,
  value NUMERIC(10, 4) NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO global_settings (key, value, description) VALUES
  ('yen_rate', 9.1, '엔화 환율 (1엔 = N원)'),
  ('shipping_base', 15000, '기본 배송비 (1kg 이하)'),
  ('shipping_per_half_kg', 5000, '0.5kg당 추가 배송비'),
  ('tax_threshold', 200000, '과세 기준 금액 ($150 약 200,000원)'),
  ('tax_rate', 0.18, '관부가세율 (간이세율 18%)'),
  ('fee_rate', 0.10, '구매대행 수수료율 (10%)')
ON CONFLICT (key) DO NOTHING;

-- ================================================
-- 4. Enable Row Level Security (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 5. RLS Policies
-- ================================================

-- Products: Public can read active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Products: Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can do everything on products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: Anyone can insert (비회원 주문)
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Orders: Only authenticated users can view/update
CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Global Settings: Anyone can read
CREATE POLICY "Anyone can view settings"
  ON global_settings FOR SELECT
  USING (true);

-- Global Settings: Only authenticated can update
CREATE POLICY "Authenticated users can update settings"
  ON global_settings FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================================
-- 6. Functions and Triggers
-- ================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON global_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 7. Storage Bucket Setup (Run this in Supabase Dashboard)
-- ================================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named "product-images"
-- 3. Set it to "Public" for easy access
-- Or run this SQL if you have the storage extension:

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('product-images', 'product-images', true)
-- ON CONFLICT DO NOTHING;

-- Storage policy for product images
-- CREATE POLICY "Public Access for Product Images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');

-- CREATE POLICY "Authenticated users can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
