-- ================================================
-- 좋아요(찜) 기능 테이블
-- Supabase SQL Editor에서 실행
-- ================================================

-- favorites (좋아요/찜 테이블)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 사용자 및 상품
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- 중복 방지 (한 사용자가 같은 상품을 한 번만 찜)
  UNIQUE(user_id, product_id)
);

-- 인덱스
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_product_id ON favorites(product_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- RLS 정책
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 찜 목록만 조회
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 찜 추가 가능
CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 찜 삭제 가능
CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
