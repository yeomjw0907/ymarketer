-- ================================================
-- orders 테이블에 수량(quantity) 컬럼 추가
-- Supabase SQL Editor에서 실행
-- ================================================

-- quantity 컬럼 추가 (기본값 1)
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- 기존 주문의 수량을 1로 설정
UPDATE orders SET quantity = 1 WHERE quantity IS NULL;
