'use client';

import { useState } from 'react';
import { Search, Package, Truck, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // TODO: 실제 배송 조회 API 연동
    setTimeout(() => setIsSearching(false), 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-black mb-3 tracking-tight">배송 조회</h1>
          <p className="text-sm text-gray-500">주문번호로 배송 현황을 확인하세요</p>
        </div>

        {/* 검색 폼 */}
        <div className="bg-white border border-gray-200 p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="orderNumber" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                주문번호
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="orderNumber"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 border border-gray-200 focus:border-black transition-colors text-black placeholder:text-gray-400"
                  placeholder="주문번호를 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 transition-colors"
            >
              {isSearching ? '조회 중...' : '배송 조회'}
            </button>
          </form>
        </div>

        {/* 안내 */}
        <div className="bg-gray-50 border border-gray-200 p-6">
          <h3 className="font-bold text-black mb-4">배송 조회 안내</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>주문번호는 주문 완료 시 이메일로 전송됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>일본 현지 배송 후 국내 배송까지 약 7-14일 소요됩니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-black">•</span>
              <span>배송 상태는 실시간으로 업데이트됩니다.</span>
            </li>
          </ul>
        </div>

        {/* 배송 단계 안내 */}
        <div className="mt-8 bg-white border border-gray-200 p-6">
          <h3 className="font-bold text-black mb-4">배송 프로세스</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-black text-sm mb-1">1. 주문 접수</div>
                <div className="text-xs text-gray-600">입금 확인 후 일본 현지에서 상품 구매</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-black text-sm mb-1">2. 국제 배송</div>
                <div className="text-xs text-gray-600">일본에서 한국으로 배송 (5-10일)</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-bold text-black text-sm mb-1">3. 국내 배송</div>
                <div className="text-xs text-gray-600">고객님 주소로 최종 배송 (2-3일)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
