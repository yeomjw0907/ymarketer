'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin, ChevronDown } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';
import type { Product } from '@/lib/types/database.types';
import type { PriceCalculation } from '@/lib/types/database.types';
import ShippingAddressModal from './ShippingAddressModal';
import TossPaymentButton from './TossPaymentButton';
import ProgressBar from './ProgressBar';
import PriceSummary from './PriceSummary';

interface OrderCheckoutProps {
  product: Product;
  calculation: PriceCalculation;
  profile: { name: string; phone: string; address: string };
  userId: string;
  userEmail: string;
}

export default function OrderCheckout({
  product,
  calculation,
  profile,
  userId,
  userEmail,
}: OrderCheckoutProps) {
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState(profile);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [orderInfoCollapsed, setOrderInfoCollapsed] = useState(true);

  const totalPrice = calculation.final_price * quantity;
  const krTotal = product.kr_price * quantity;
  const savedAmount = krTotal - totalPrice;

  const onAddressSave = useCallback(
    (data: { name: string; phone: string; address: string }) => {
      setShipping(data);
      setAddressModalOpen(false);
    },
    []
  );

  return (
    <div className="min-h-screen bg-white pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <Link
          href={`/product/${product.id}`}
          className="inline-flex items-center gap-2 text-black hover:text-gray-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">상품으로 돌아가기</span>
        </Link>

        {/* 제목 */}
        <h1 className="text-3xl font-black text-black mb-3 tracking-tight">ORDER & PAYMENT</h1>
        <p className="text-sm text-gray-500 mb-8">주문 정보를 확인하고 결제를 진행하세요</p>

        {/* 진행 단계 */}
        <ProgressBar currentStep={2} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 좌측: 주문 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. 주문자 정보 (접기 가능) */}
            <section className="bg-white border border-gray-200">
              <button
                type="button"
                onClick={() => setOrderInfoCollapsed(!orderInfoCollapsed)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h2 className="font-bold text-black">주문자 정보</h2>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    orderInfoCollapsed ? '' : 'rotate-180'
                  }`}
                />
              </button>
              {!orderInfoCollapsed && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이름</span>
                      <span className="font-medium text-black">{shipping.name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이메일</span>
                      <span className="font-medium text-black">{userEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전화번호</span>
                      <span className="font-medium text-black">{shipping.phone || '—'}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 2. 배송지 정보 */}
            <section className="bg-white border border-gray-200">
              <div className="flex items-center gap-3 p-6">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h2 className="font-bold text-black">배송 정보</h2>
              </div>
              <div className="px-6 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>배송지 주소</span>
                    </div>
                    <p className="font-semibold text-black mb-1">{shipping.name || '—'}</p>
                    <p className="text-sm text-gray-600 mb-1">{shipping.phone || '—'}</p>
                    <p className="text-sm text-gray-700 break-words">
                      {shipping.address || '배송지를 입력해주세요'}
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                      📦 예상 도착: 주문 후 7-14일
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(true)}
                    className="shrink-0 bg-white hover:bg-gray-50 border border-gray-300 hover:border-black text-black font-semibold py-2 px-4 text-sm transition-colors"
                  >
                    변경
                  </button>
                </div>
              </div>
            </section>

            {/* 3. 주문 상품 */}
            <section className="bg-white border border-gray-200">
              <div className="flex items-center gap-3 p-6 border-b border-gray-200">
                <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h2 className="font-bold text-black">주문 상품</h2>
              </div>
              <div className="p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 bg-gray-100 border border-gray-200 shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <p className="font-bold text-black mb-2">{product.name}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-600">수량</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-black">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="w-7 h-7 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-lg font-black text-black">
                      {formatKRW(calculation.final_price * quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 우측: Sticky 가격 요약 */}
          <div>
            <PriceSummary
              productPrice={calculation.final_price}
              quantity={quantity}
              totalPrice={totalPrice}
              kr_total={krTotal}
              saved_amount={savedAmount}
              onCheckout={() => {}}
              isLoading={false}
            />
          </div>
        </div>

        {/* 배송지 변경 모달 */}
        <ShippingAddressModal
          isOpen={addressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          initialData={shipping}
          onSave={onAddressSave}
          userId={userId}
        />
      </div>

      {/* 하단 고정: 한국가(취소선) | 결제금액 | 결제하기 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="container mx-auto max-w-2xl flex items-center justify-between gap-4">
          <div className="flex flex-col items-start min-w-0">
            <span className="text-xs text-gray-500 line-through">{formatKRW(krTotal)}</span>
            <span className="font-bold text-lg text-gray-900">{formatKRW(totalPrice)}</span>
          </div>
          <TossPaymentButton
            amount={totalPrice}
            orderName={product.name}
            productId={product.id}
            quantity={quantity}
            shipping={shipping}
            userId={userId}
            userEmail={userEmail}
          />
        </div>
      </div>
    </div>
  );
}
