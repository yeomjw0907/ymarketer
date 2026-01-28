'use client';

import { TrendingDown, ShieldCheck } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';

interface PriceSummaryProps {
  productPrice: number;
  quantity: number;
  totalPrice: number;
  kr_total: number;
  saved_amount: number;
  onCheckout: () => void;
  isLoading?: boolean;
}

export default function PriceSummary({
  productPrice,
  quantity,
  totalPrice,
  kr_total,
  saved_amount,
  onCheckout,
  isLoading = false,
}: PriceSummaryProps) {
  const savingsPercent = kr_total > 0 ? Math.round((saved_amount / kr_total) * 100) : 0;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="bg-white border-2 border-gray-300 p-6">
        <h3 className="text-lg font-black text-black mb-4 tracking-tight">
          결제 금액
        </h3>

        {/* 가격 내역 */}
        <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">상품 금액</span>
            <span className="font-medium text-black">{formatKRW(productPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">수량</span>
            <span className="font-medium text-black">x {quantity}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">배송비</span>
            <span className="font-medium text-green-600">무료</span>
          </div>
        </div>

        {/* 총 금액 */}
        <div className="mb-4 pb-4 border-b-2 border-gray-300">
          <div className="flex justify-between items-center">
            <span className="font-bold text-black">총 결제 금액</span>
            <span className="text-2xl font-black text-black">
              {formatKRW(totalPrice)}
            </span>
          </div>
        </div>

        {/* 절약 금액 강조 */}
        {saved_amount > 0 && (
          <div className="bg-red text-white p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5" />
              <span className="font-bold text-sm">한국 가격 대비</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">절약 금액</span>
              <span className="text-xl font-black">
                {formatKRW(saved_amount)} ({savingsPercent}%)
              </span>
            </div>
          </div>
        )}

        {/* 결제 버튼 */}
        <button
          onClick={onCheckout}
          disabled={isLoading}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 text-lg transition-colors mb-4"
        >
          {isLoading ? '처리 중...' : '결제하기'}
        </button>

        {/* 보안 배지 */}
        <div className="flex items-center justify-center gap-2 text-xs text-gray-600 py-3 bg-gray-50 border border-gray-200">
          <ShieldCheck className="w-4 h-4" />
          <span>안전한 결제 (SSL 보안)</span>
        </div>

        {/* 주의사항 */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1">
          <p>• 입금 확인 후 일본에서 상품 구매</p>
          <p>• 평균 배송 기간: 7-14일</p>
          <p>• 관세 및 수수료 포함 가격</p>
        </div>
      </div>
    </div>
  );
}
