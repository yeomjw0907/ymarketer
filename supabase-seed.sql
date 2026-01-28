-- ================================================
-- Price Check (와이마케터) 더미 상품 데이터
-- Supabase SQL Editor에서 실행하세요.
-- ================================================

-- 기존 더미 데이터가 있다면 삭제 (선택사항, 처음 한 번만 실행 시 생략 가능)
-- DELETE FROM products WHERE name LIKE '%[더미]%';

-- ================================================
-- 캠핑 카테고리
-- ================================================
INSERT INTO products (name, brand, category, kr_price, jp_price, weight, image_url, description, is_hot, is_active) VALUES
(
  '스노우피크 랜드락 미니멀 디렉터 체어',
  'Snow Peak',
  'camping',
  189000,
  18500,
  2.8,
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=800&fit=crop',
  '일본 캠핑 브랜드 스노우피크의 대표 체어. 접이식 디자인으로 휴대가 편리하며, 내구성과 디자인을 모두 갖춘 프리미엄 캠핑 체어입니다.',
  true,
  true
),
(
  '유니플로우 알루미늄 프라이팬 26cm',
  'UNIFLAME',
  'camping',
  78000,
  7200,
  0.65,
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop',
  '가벼운 알루미늄 소재의 캠핑용 프라이팬. 열전도가 뛰어나고 세척이 쉬우며, 캠핑·트레킹에 최적화된 사이즈입니다.',
  true,
  true
),
(
  '코레코 트리트먼트 테이블 M',
  'Coleman',
  'camping',
  125000,
  11800,
  3.2,
  'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&h=800&fit=crop',
  '접이식 캠핑 테이블. 넓은 상판과 안정적인 프레임으로 식사·취미 활동에 적합합니다.',
  false,
  true
),
(
  '몽벨 다운 재킷 800',
  'Montbell',
  'camping',
  298000,
  26800,
  0.45,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
  '800필파워 고품질 다운 재킷. 초경량 패킹 가능하며, 등산·캠핑·일상 겸용으로 인기입니다.',
  true,
  true
);

-- ================================================
-- 골프 카테고리
-- ================================================
INSERT INTO products (name, brand, category, kr_price, jp_price, weight, image_url, description, is_hot, is_active) VALUES
(
  '테일러메이드 스텔스 2 드라이버',
  'TaylorMade',
  'golf',
  650000,
  59800,
  0.32,
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=800&fit=crop',
  '2024년형 스텔스 2 드라이버. 카본 페이스로 비거리와 안정성을 동시에 확보한 인기 모델입니다.',
  true,
  true
),
(
  '캘러웨이 패러다임 아이언 6개 세트',
  'Callaway',
  'golf',
  1200000,
  108000,
  4.5,
  'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&h=800&fit=crop',
  '퍼포먼스 아이언 세트. 초보부터 중급자까지 추천하는 포기빈이 높은 세트입니다.',
  false,
  true
),
(
  '풀튼 우먼스 골프화 스파이크리스',
  'FootJoy',
  'golf',
  189000,
  16500,
  0.6,
  'https://images.unsplash.com/photo-1593111774240-d529f12bb4fa?w=800&h=800&fit=crop',
  '여성용 스파이크리스 골프화. 가벼운 착용감과 방수 소재로 라운드에 최적화되었습니다.',
  false,
  true
);

-- ================================================
-- 패션 카테고리
-- ================================================
INSERT INTO products (name, brand, category, kr_price, jp_price, weight, image_url, description, is_hot, is_active) VALUES
(
  '유니클로 울 블렌드 코트',
  'UNIQLO',
  'fashion',
  129000,
  9900,
  0.8,
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&h=800&fit=crop',
  '울 블렌드 소재의 클래식 코트. 가벼우면서 보온성이 뛰어나 가을·겨울 필수 아이템입니다.',
  true,
  true
),
(
  '베이직 cocoon 파카',
  'BEAMS',
  'fashion',
  198000,
  17800,
  0.55,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
  '일본 베이직 인기 파카. 심플한 디자인과 실용적인 수납으로 데일리로 착용하기 좋습니다.',
  false,
  true
),
(
  '노스페이스 눕시 패딩 점퍼',
  'The North Face',
  'fashion',
  259000,
  22800,
  0.9,
  'https://images.unsplash.com/photo-1544923246-4ae6480c472c?w=800&h=800&fit=crop',
  '눕시 라인 대표 패딩. 가벼운 무게와 뛰어난 보온성으로 국내외에서 스테디셀러입니다.',
  true,
  true
);

-- ================================================
-- 뷰티 카테고리
-- ================================================
INSERT INTO products (name, brand, category, kr_price, jp_price, weight, image_url, description, is_hot, is_active) VALUES
(
  '스킨아쿠아 수퍼 모이스처 젤',
  'Skin Aqua',
  'beauty',
  18500,
  1580,
  0.14,
  'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop',
  '일본 대표 선크림. 촉촉한 젤 타입으로 피부 밀착이 좋고, 백탁 없이 사용 가능합니다.',
  false,
  true
),
(
  'DHC 립 크림',
  'DHC',
  'beauty',
  12000,
  980,
  0.04,
  'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=800&h=800&fit=crop',
  '올리브 오일 함유 립 케어. 건조한 입술을 케어하며 장기간 인기 제품입니다.',
  false,
  true
),
(
  '쿠레쥬 UV 쿠션',
  'KUREHA',
  'beauty',
  32000,
  2680,
  0.25,
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=800&fit=crop',
  'SPF50+ PA++++ 쿠션 선크림. 톤업·선크림 겸용으로 일본 현지에서 선호도가 높습니다.',
  true,
  true
);

-- ================================================
-- 전자기기 카테고리
-- ================================================
INSERT INTO products (name, brand, category, kr_price, jp_price, weight, image_url, description, is_hot, is_active) VALUES
(
  '소니 WH-1000XM5 헤드폰',
  'Sony',
  'electronics',
  499000,
  42800,
  0.25,
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
  '노이즈캔슬링 무선 헤드폰. 업계 최고 수준의 소음 제거와 음질로 일본 직구 인기 1위입니다.',
  true,
  true
),
(
  '엔비디아 실드 TV 프로',
  'NVIDIA',
  'electronics',
  258000,
  22800,
  0.27,
  'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop',
  '4K 스트리밍 미디어 플레이어. 게임·영상 시청 겸용으로 해외 직구 인기 제품입니다.',
  false,
  true
),
(
  '아니프로 블루투스 스피커 X1',
  'Anker',
  'electronics',
  89000,
  7800,
  0.68,
  'https://images.unsplash.com/photo-1545454670-2c83fc8bc6ac?w=800&h=800&fit=crop',
  '휴대용 블루투스 스피커. 방수·내구성 우수하며 캠핑·아웃도어용으로 인기입니다.',
  false,
  true
);

-- ================================================
-- 확인: 삽입된 상품 수
-- ================================================
-- SELECT COUNT(*) AS total_products FROM products;
