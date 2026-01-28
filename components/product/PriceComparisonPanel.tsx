'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PriceCalculation } from '@/lib/types/database.types';
import { formatKRW, formatJPY, calculateSavingRate } from '@/lib/utils/calculator';

interface PriceComparisonPanelProps {
  kr_price: number;
  jp_price: number;
  calculation: PriceCalculation;
  yen_rate: number;
}

export default function PriceComparisonPanel({
  kr_price,
  jp_price,
  calculation,
  yen_rate,
}: PriceComparisonPanelProps) {
  const [showDetails, setShowDetails] = useState(false);
  const savingRate = calculateSavingRate(calculation.saved_amount, kr_price);
  const isSaving = calculation.saved_amount > 0;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* VS 비교 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 text-center">
          💰 실시간 가격 비교
        </h2>
      </div>

      {/* 가격 비교 메인 */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* 좌측: 한국 최저가 */}
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="text-sm text-gray-500 mb-2">🇰🇷 국내 최저가</div>
            <div className="text-xl font-bold text-gray-400 line-through">
              {formatKRW(kr_price)}
            </div>
            <div className="text-xs text-gray-400 mt-1">네이버 최저가 기준</div>
          </div>

          {/* 우측: 직구 예상가 */}
          <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-300">
            <div className="text-sm text-blue-700 font-bold mb-2">🇯🇵 예상 직구가</div>
            <div className="text-2xl font-black text-blue-700">
              {formatKRW(calculation.final_price)}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {formatJPY(jp_price)} × {yen_rate}원
            </div>
          </div>
        </div>

        {/* 절약 금액 배지 (중앙) */}
        {isSaving ? (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl text-center shadow-lg animate-pulse-green mb-4">
            <div className="text-sm font-medium mb-1">🎉 지금 구매하면</div>
            <div className="text-3xl font-black tracking-tight">
              {formatKRW(calculation.saved_amount)} 이득!
            </div>
            <div className="text-sm font-medium mt-1">
              약 {savingRate}% 절약
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl text-center mb-4">
            <div className="text-sm font-medium">
              현재는 국내 구매가 더 저렴합니다
            </div>
          </div>
        )}

        {/* 상세 내역 토글 버튼 */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors border-t border-gray-200 pt-4"
        >
          <span>{showDetails ? '상세 내역 숨기기' : '상세 내역 보기'}</span>
          {showDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* 상세 내역 (토글) */}
        {showDetails && (
          <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">상품 원화 환산</span>
              <span className="font-semibold text-gray-900">
                {formatKRW(calculation.item_krw)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                관부가세 {calculation.tax > 0 ? '(18%)' : '(면세)'}
              </span>
              <span className="font-semibold text-gray-900">
                {calculation.tax > 0 ? `+${formatKRW(calculation.tax)}` : '면세'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">배송비</span>
              <span className="font-semibold text-gray-900">
                +{formatKRW(calculation.shipping)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">구매대행 수수료 (10%)</span>
              <span className="font-semibold text-gray-900">
                +{formatKRW(calculation.fee)}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900">최종 결제 예상액</span>
              <span className="text-xl font-black text-blue-600">
                {formatKRW(calculation.final_price)}
              </span>
            </div>
          </div>
        )}

        {/* 안내 문구 */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-xs text-gray-600 leading-relaxed">
          <p className="font-medium text-blue-900 mb-1">💡 안내사항</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>환율은 실시간으로 변동될 수 있습니다.</li>
            <li>관부가세는 $150 (약 20만원) 초과 시 18% 적용됩니다.</li>
            <li>배송비는 무게(kg)에 따라 산출됩니다.</li>
            <li>최종 금액은 주문 시점 기준으로 확정됩니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
