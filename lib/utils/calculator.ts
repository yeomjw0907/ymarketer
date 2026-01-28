import { GlobalSettings, PriceCalculation } from '@/lib/types/database.types';

/**
 * 가격 계산기 - 일본 직구 최종 가격 계산
 * 
 * @param jp_price - 일본 현지 가격 (엔화)
 * @param kr_price - 한국 최저가 (원화)
 * @param weight - 상품 무게 (kg)
 * @param settings - 전역 설정 (환율, 세율 등)
 * @returns PriceCalculation - 계산 결과
 */
export function calculatePrice(
  jp_price: number,
  kr_price: number,
  weight: number,
  settings: GlobalSettings
): PriceCalculation {
  // 1. 상품 원화 환산
  const item_krw = Math.round(jp_price * settings.yen_rate);

  // 2. 관부가세 계산 (과세 기준 초과 시)
  const tax = item_krw > settings.tax_threshold 
    ? Math.round(item_krw * settings.tax_rate)
    : 0;

  // 3. 배송비 계산
  // 기본 배송비 (1kg 이하) + 0.5kg당 추가 배송비
  let shipping = settings.shipping_base;
  if (weight > 1) {
    const extraWeight = weight - 1;
    const halfKgUnits = Math.ceil(extraWeight * 2); // 0.5kg 단위로 올림
    shipping += halfKgUnits * settings.shipping_per_half_kg;
  }

  // 4. 구매대행 수수료 (10%)
  const fee = Math.round(item_krw * settings.fee_rate);

  // 5. 최종 직구 가격
  const final_price = item_krw + tax + shipping + fee;

  // 6. 절약 금액 (한국 가격 - 직구 가격)
  const saved_amount = kr_price - final_price;

  return {
    item_krw,
    tax,
    shipping,
    fee,
    final_price,
    saved_amount,
  };
}

/**
 * 숫자를 천 단위 구분자를 포함한 원화 문자열로 변환
 * 
 * @param amount - 금액
 * @returns 포맷된 문자열 (예: "380,000원")
 */
export function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/**
 * 숫자를 천 단위 구분자를 포함한 엔화 문자열로 변환
 * 
 * @param amount - 금액
 * @returns 포맷된 문자열 (예: "50,000엔")
 */
export function formatJPY(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}엔`;
}

/**
 * 절약 비율 계산
 * 
 * @param saved_amount - 절약 금액
 * @param kr_price - 한국 최저가
 * @returns 절약 비율 (예: 26.9)
 */
export function calculateSavingRate(saved_amount: number, kr_price: number): number {
  if (kr_price === 0) return 0;
  return Math.round((saved_amount / kr_price) * 1000) / 10; // 소수점 1자리
}

/**
 * 무게에 따른 예상 배송비 계산
 * 
 * @param weight - 무게 (kg)
 * @param settings - 전역 설정
 * @returns 배송비 (원)
 */
export function calculateShipping(weight: number, settings: GlobalSettings): number {
  let shipping = settings.shipping_base;
  if (weight > 1) {
    const extraWeight = weight - 1;
    const halfKgUnits = Math.ceil(extraWeight * 2);
    shipping += halfKgUnits * settings.shipping_per_half_kg;
  }
  return shipping;
}
