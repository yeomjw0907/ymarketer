-- ================================================
-- 히어로 롤링 배너 테이블 (메인 페이지 상단 배너 관리)
-- Supabase SQL Editor에서 실행
-- ================================================

-- hero_banners 테이블
CREATE TABLE IF NOT EXISTS hero_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 표시 순서 (작을수록 앞)
  sort_order INTEGER NOT NULL DEFAULT 0,

  -- 이미지 URL (Supabase Storage 또는 외부 URL)
  image_url TEXT NOT NULL,

  -- 텍스트 (선택)
  title TEXT,
  subtitle TEXT,

  -- 링크 (선택, 클릭 시 이동)
  link_url TEXT,

  -- 그라데이션 클래스 (예: from-blue-500 to-blue-700)
  bg_color TEXT DEFAULT 'from-blue-500 to-blue-700',

  -- 노출 여부
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_hero_banners_sort ON hero_banners(sort_order);
CREATE INDEX idx_hero_banners_active ON hero_banners(is_active) WHERE is_active = true;

-- updated_at 자동 갱신 (기존 트리거 함수 사용)
CREATE TRIGGER update_hero_banners_updated_at
  BEFORE UPDATE ON hero_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS: 공개 조회만 허용, 수정/삭제는 인증된 사용자(관리자)
ALTER TABLE hero_banners ENABLE ROW LEVEL SECURITY;

-- 메인: 노출 중인 배너만 공개 조회
CREATE POLICY "Anyone can view active hero banners"
  ON hero_banners FOR SELECT
  USING (is_active = true);

-- 관리자: 로그인 시 전체 조회 및 수정/삭제
CREATE POLICY "Authenticated users can select all hero banners"
  ON hero_banners FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert hero banners"
  ON hero_banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update hero banners"
  ON hero_banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete hero banners"
  ON hero_banners FOR DELETE
  TO authenticated
  USING (true);

-- Storage: Supabase Dashboard > Storage > New bucket "hero-banners" (Public)
-- Storage Policy: Allow authenticated upload (Policy: "Authenticated upload", INSERT for authenticated)
