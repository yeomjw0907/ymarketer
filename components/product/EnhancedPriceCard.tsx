'use client';

import { TrendingDown, Info } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';
import { useState } from 'react';

interface EnhancedPriceCardProps {
  kr_price: number;
  jp_price: number;
  final_price: number;
  saved_amount: number;
  yen_rate: number;
  weight: number;
}

export default function EnhancedPriceCard({
  kr_price,
  jp_price,
  final_price,
  saved_amount,
  yen_rate,
  weight,
}: EnhancedPriceCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const savingsPercent = Math.round((saved_amount / kr_price) * 100);

  return (
    <div className="bg-gray-50 border-2 border-gray-300 p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="w-5 h-5 text-red" />
          <h3 className="text-sm font-black text-black uppercase tracking-wide">
            가격 비교
          </h3>
        </div>
        <p className="text-xs text-gray-600">한국 vs 일본 직구 가격</p>
      </div>

      {/* 가격 비교 */}
      <div className="space-y-4 mb-6">
        {/* 일본 가격 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">일본 현지가</span>
          <span className="text-base font-medium text-gray-400 line-through">
            ¥{jp_price.toLocaleString()}
          </span>
        </div>

        {/* 한국 가격 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">한국 판매가</span>
          <span className="text-base font-medium text-gray-400 line-through">
            {formatKRW(kr_price)}
          </span>
        </div>

        {/* 구분선 */}
        <div className="border-t-2 border-gray-300 my-4" />

        {/* 우리 가격 (강조) */}
        <div className="bg-white border-2 border-black p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-black">YMARKETER 가격</span>
            <span className="text-3xl font-black text-black">
              {formatKRW(final_price)}
            </span>
          </div>
          
          {/* 절약 금액 (빨강 강조) */}
          {saved_amount > 0 && (
            <div className="bg-red text-white px-3 py-2 mt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">절약 금액</span>
                <span className="text-xl font-black">
                  {formatKRW(saved_amount)} ({savingsPercent}% ↓)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 가격 상세보기 버튼 */}
      <button
        onClick={() => setShowBreakdown(!showBreakdown)}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-black transition-colors py-2 border-t border-gray-200"
      >
        <Info className="w-4 h-4" />
        <span className="font-medium">
          {showBreakdown ? '상세 숨기기' : '가격 상세보기'}
        </span>
      </button>

      {/* 가격 상세 내역 */}
      {showBreakdown && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>일본 가격 (¥{jp_price.toLocaleString()})</span>
            <span>{formatKRW(Math.round(jp_price * (yen_rate / 100)))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>배송비 ({weight}kg)</span>
            <span>포함</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>관세 및 수수료</span>
            <span>포함</span>
          </div>
          <div className="flex justify-between font-bold text-black pt-2 border-t border-gray-200">
            <span>최종 금액</span>
            <span>{formatKRW(final_price)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
