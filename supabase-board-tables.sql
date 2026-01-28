-- ================================================
-- 게시판 테이블 추가 (공지사항, FAQ, 이벤트)
-- Supabase SQL Editor에서 실행
-- ================================================

-- ================================================
-- 1. notices (공지사항 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_new BOOLEAN DEFAULT true, -- NEW 배지 표시 여부
  is_visible BOOLEAN DEFAULT true, -- 노출 여부
  sort_order INTEGER DEFAULT 0 -- 정렬 순서 (높을수록 상단)
);

-- 인덱스
CREATE INDEX idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX idx_notices_sort_order ON notices(sort_order DESC);
CREATE INDEX idx_notices_visible ON notices(is_visible) WHERE is_visible = true;

-- ================================================
-- 2. faqs (FAQ 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  category TEXT NOT NULL, -- 카테고리 (배송, 주문/결제, 환불, 회원, 기타)
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true, -- 노출 여부
  sort_order INTEGER DEFAULT 0 -- 정렬 순서
);

-- 인덱스
CREATE INDEX idx_faqs_category ON faqs(category);
CREATE INDEX idx_faqs_sort_order ON faqs(sort_order DESC);
CREATE INDEX idx_faqs_visible ON faqs(is_visible) WHERE is_visible = true;

-- ================================================
-- 3. events (이벤트 테이블)
-- ================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  period_start DATE NOT NULL, -- 시작일
  period_end DATE NOT NULL, -- 종료일
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'upcoming', 'ended')),
  image_url TEXT, -- 이벤트 이미지 (선택)
  is_visible BOOLEAN DEFAULT true, -- 노출 여부
  sort_order INTEGER DEFAULT 0 -- 정렬 순서
);

-- 인덱스
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_period ON events(period_start, period_end);
CREATE INDEX idx_events_sort_order ON events(sort_order DESC);
CREATE INDEX idx_events_visible ON events(is_visible) WHERE is_visible = true;

-- ================================================
-- 4. RLS (Row Level Security) 정책
-- ================================================

-- notices 테이블
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible notices"
  ON notices FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage notices"
  ON notices FOR ALL
  USING (auth.role() = 'authenticated');

-- faqs 테이블
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible faqs"
  ON faqs FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage faqs"
  ON faqs FOR ALL
  USING (auth.role() = 'authenticated');

-- events 테이블
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible events"
  ON events FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage events"
  ON events FOR ALL
  USING (auth.role() = 'authenticated');

-- ================================================
-- 5. Triggers
-- ================================================

-- updated_at 자동 업데이트
CREATE TRIGGER update_notices_updated_at
  BEFORE UPDATE ON notices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON faqs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 6. 샘플 데이터 삽입 (선택)
-- ================================================

-- 공지사항 샘플
INSERT INTO notices (title, content, is_new, sort_order) VALUES
  ('설 연휴 배송 일정 안내', '설 연휴 기간 (1/28 ~ 2/2) 동안 일본 현지 구매 및 배송이 지연될 수 있습니다.

해당 기간 주문 건은 휴일 이후 순차적으로 처리됩니다.

양해 부탁드립니다.', true, 100),
  ('ymarketer 오픈 안내', 'ymarketer가 정식 오픈했습니다!

일본 직구를 더욱 쉽고 저렴하게 이용하실 수 있습니다.

많은 이용 부탁드립니다.', true, 90),
  ('신규 카테고리 추가 안내', '뷰티, 전자기기 카테고리가 새롭게 추가되었습니다.

다양한 상품을 만나보세요!', false, 80);

-- FAQ 샘플
INSERT INTO faqs (category, question, answer, sort_order) VALUES
  ('배송', '배송 기간은 얼마나 걸리나요?', '일본 현지 구매 및 한국 배송까지 평균 7~14일 정도 소요됩니다.

1. 주문 접수 및 결제 확인: 1~2일
2. 일본 현지 구매: 2~3일
3. 한국 배송: 4~7일
4. 통관 및 국내 배송: 1~2일', 100),
  ('배송', '배송비는 얼마인가요?', '배송비는 상품 무게에 따라 다릅니다.

- 1kg 이하: 15,000원
- 1kg 초과 시 0.5kg당 5,000원 추가

예시:
- 1.5kg 상품: 20,000원
- 2.0kg 상품: 25,000원', 90),
  ('주문/결제', '주문 후 취소가 가능한가요?', '결제 완료 후 일본 현지 구매 전까지는 취소가 가능합니다.

이미 구매가 진행된 경우에는 취소가 어려우며, 상품 수령 후 반품 절차를 진행해야 합니다.

취소 문의: support@ymarketer.kr', 80);

-- 이벤트 샘플
INSERT INTO events (title, description, period_start, period_end, status, sort_order) VALUES
  ('🎉 신규 가입 첫 구매 10% 할인', '신규 가입 회원님께 첫 구매 시 10% 할인 쿠폰을 드립니다!

쿠폰 코드: WELCOME10
최대 할인 금액: 50,000원', '2026-01-20', '2026-02-28', 'ongoing', 100),
  ('💰 친구 추천 이벤트', '친구를 초대하고 포인트를 받으세요!

추천인과 가입자 모두에게 5,000원 포인트 지급

마이페이지 > 친구 초대하기', '2026-01-15', '2026-12-31', 'ongoing', 90),
  ('🎁 설 맞이 무료 배송 이벤트', '설 연휴 특별 이벤트!

100,000원 이상 구매 시 배송비 무료

이벤트 기간 동안 자동 적용됩니다.', '2026-01-28', '2026-02-02', 'upcoming', 80);

-- ================================================
-- 완료!
-- ================================================
-- SELECT COUNT(*) FROM notices;
-- SELECT COUNT(*) FROM faqs;
-- SELECT COUNT(*) FROM events;
