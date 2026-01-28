-- ================================================
-- 회원가입 및 리뷰 시스템 추가 스키마
-- supabase-schema.sql 실행 후 이 파일을 실행하세요
-- ================================================

-- ================================================
-- 1. profiles (사용자 프로필 테이블)
-- ================================================
-- Supabase Auth의 users와 연동되는 프로필 테이블
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 기본 정보
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  
  -- 주소 정보 (주문 시 자동 입력용)
  default_address TEXT,
  
  -- 프로필 이미지
  avatar_url TEXT
);

-- 인덱스
CREATE INDEX idx_profiles_email ON profiles(email);

-- ================================================
-- 2. reviews (리뷰 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 연관 정보
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  
  -- 리뷰 내용
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  
  -- 이미지 (최대 5개, JSON 배열)
  images TEXT[], -- 이미지 URL 배열
  
  -- 도움됨 카운트
  helpful_count INTEGER DEFAULT 0,
  
  -- 승인 여부 (관리자 검토)
  is_approved BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true
);

-- 인덱스
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ================================================
-- 3. review_helpful (리뷰 도움됨 기록)
-- ================================================
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  UNIQUE(review_id, user_id) -- 한 사용자가 한 리뷰에 한 번만 도움됨 표시
);

-- 인덱스
CREATE INDEX idx_review_helpful_review_id ON review_helpful(review_id);
CREATE INDEX idx_review_helpful_user_id ON review_helpful(user_id);

-- ================================================
-- 4. RLS (Row Level Security) 정책
-- ================================================

-- profiles 테이블
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- reviews 테이블
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_visible = true AND is_approved = true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can see all reviews"
  ON reviews FOR SELECT
  USING (auth.role() = 'authenticated');

-- review_helpful 테이블
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view helpful counts"
  ON review_helpful FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can mark helpful"
  ON review_helpful FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their helpful mark"
  ON review_helpful FOR DELETE
  USING (auth.uid() = user_id);

-- ================================================
-- 5. Functions and Triggers
-- ================================================

-- 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 새 사용자 가입 시 프로필 자동 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 프로필 updated_at 트리거
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 리뷰 updated_at 트리거
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 리뷰 helpful_count 업데이트 함수
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reviews
    SET helpful_count = helpful_count + 1
    WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reviews
    SET helpful_count = helpful_count - 1
    WHERE id = OLD.review_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 리뷰 helpful 카운트 자동 업데이트
CREATE TRIGGER update_helpful_count_trigger
  AFTER INSERT OR DELETE ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- ================================================
-- 6. Storage Bucket for Review Images (수동 생성 필요)
-- ================================================
-- Supabase Dashboard > Storage에서 수동으로 생성:
-- 1. 버킷 이름: "review-images"
-- 2. Public: ✅ 체크
-- 3. Allowed MIME types: image/jpeg, image/png, image/webp
-- 4. Max file size: 5MB

-- ================================================
-- 완료 확인
-- ================================================
-- SELECT COUNT(*) FROM profiles;
-- SELECT COUNT(*) FROM reviews;
