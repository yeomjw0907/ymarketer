'use client';

import { useState } from 'react';
import { Info, TrendingDown, Star, Truck, Package, Shield, CreditCard } from 'lucide-react';
import ReviewSection from './ReviewSection';
import { formatKRW } from '@/lib/utils/calculator';

interface ProductTabsProps {
  productId: string;
  description: string | null;
  kr_price: number;
  jp_price: number;
  calculation: any;
  yen_rate: number;
}

type TabId = 'details' | 'price' | 'reviews' | 'shipping';

const TABS = [
  { id: 'details' as TabId, label: '상세정보', icon: Info },
  { id: 'price' as TabId, label: '가격 비교', icon: TrendingDown },
  { id: 'reviews' as TabId, label: '리뷰', icon: Star },
  { id: 'shipping' as TabId, label: '배송/반품', icon: Truck },
];

export default function ProductTabs({
  productId,
  description,
  kr_price,
  jp_price,
  calculation,
  yen_rate,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('details');

  return (
    <div className="mt-20">
      {/* 탭 헤더 */}
      <div className="border-b-2 border-gray-200 mb-8">
        <div className="flex gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="min-h-[400px]">
        {/* 상세정보 */}
        {activeTab === 'details' && (
          <div className="prose prose-gray max-w-none">
            <h3 className="text-2xl font-black text-black mb-6 tracking-tight">
              PRODUCT DETAILS
            </h3>
            {description ? (
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {description}
              </p>
            ) : (
              <p className="text-gray-500 text-sm">상품 상세 정보가 없습니다.</p>
            )}
          </div>
        )}

        {/* 가격 비교 */}
        {activeTab === 'price' && (
          <div>
            <h3 className="text-2xl font-black text-black mb-6 tracking-tight">
              PRICE COMPARISON
            </h3>
            
            {/* 가격 비교 테이블 */}
            <div className="bg-white border-2 border-gray-300 mb-8">
              <div className="grid grid-cols-3 border-b-2 border-gray-300">
                <div className="p-4 border-r border-gray-300 bg-gray-50">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">항목</div>
                </div>
                <div className="p-4 border-r border-gray-300 bg-gray-50">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">한국</div>
                </div>
                <div className="p-4 bg-gray-50">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">YMARKETER</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 border-b border-gray-300">
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm font-bold text-black">상품 가격</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-lg font-black text-black">{formatKRW(kr_price)}</div>
                </div>
                <div className="p-4">
                  <div className="text-lg font-black text-black">{formatKRW(calculation.final_price)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 border-b border-gray-300">
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm font-bold text-black">일본 가격</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm text-gray-500">-</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-700">¥{jp_price.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 border-b border-gray-300">
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm font-bold text-black">환율</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm text-gray-500">-</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-700">{yen_rate.toFixed(2)}원/엔</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 border-b border-gray-300">
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm font-bold text-black">배송비</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm text-gray-700">무료~3,000원</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-gray-700">포함됨</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 bg-gray-50">
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm font-black text-black">절약 금액</div>
                </div>
                <div className="p-4 border-r border-gray-300">
                  <div className="text-sm text-gray-500">-</div>
                </div>
                <div className="p-4">
                  <div className="text-xl font-black text-red">
                    {formatKRW(calculation.saved_amount)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    약 {Math.round((calculation.saved_amount / kr_price) * 100)}% 절약
                  </div>
                </div>
              </div>
            </div>
            
            {/* 추가 설명 */}
            <div className="bg-gray-50 border border-gray-200 p-6">
              <h4 className="font-bold text-black mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                왜 저렴한가요?
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
                  <span>일본 현지 가격으로 직접 구매</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
                  <span>중간 유통 마진 제거</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
                  <span>투명한 배송비 및 관세 책정</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1 h-1 bg-black rounded-full mt-2 shrink-0"></span>
                  <span>환율 변동에 따른 실시간 가격 반영</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* 리뷰 */}
        {activeTab === 'reviews' && (
          <div>
            <ReviewSection productId={productId} />
          </div>
        )}

        {/* 배송/반품 */}
        {activeTab === 'shipping' && (
          <div>
            <h3 className="text-2xl font-black text-black mb-6 tracking-tight">
              SHIPPING & RETURNS
            </h3>
            
            <div className="space-y-6">
              {/* 배송 정보 */}
              <div className="bg-white border border-gray-200 p-6">
                <h4 className="font-bold text-black mb-4">📦 배송 안내</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-black w-24">배송 기간:</span>
                    <span>평균 7-14일 (일본 현지 → 한국)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-black w-24">배송비:</span>
                    <span>상품 가격에 포함</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-black w-24">배송 조회:</span>
                    <span>주문 후 이메일로 전송된 주문번호로 조회 가능</span>
                  </div>
                </div>
              </div>

              {/* 반품/교환 */}
              <div className="bg-white border border-gray-200 p-6">
                <h4 className="font-bold text-black mb-4">🔄 교환/반품 안내</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-black w-24">교환/반품:</span>
                    <span>상품 수령 후 7일 이내 가능</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-black w-24">불가 사유:</span>
                    <span>단순 변심, 포장 훼손, 사용 흔적 있는 경우</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-black w-24">문의:</span>
                    <span>고객센터 1234-5678 또는 support@ymarketer.com</span>
                  </div>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="bg-gray-50 border border-gray-200 p-6">
                <h4 className="font-bold text-black mb-4">⚠️ 주의사항</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-black">•</span>
                    <span>일본 직구 특성상 배송 기간이 다소 소요될 수 있습니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black">•</span>
                    <span>관세는 상품 가격에 포함되어 있습니다.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black">•</span>
                    <span>파손/오배송 시 즉시 고객센터로 연락 주세요.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
