'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, MapPin } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';
import type { Product } from '@/lib/types/database.types';
import type { PriceCalculation } from '@/lib/types/database.types';
import ShippingAddressModal from './ShippingAddressModal';
import TossPaymentButton from './TossPaymentButton';

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

  const totalPrice = calculation.final_price * quantity;
  const krTotal = product.kr_price * quantity;

  const onAddressSave = useCallback(
    (data: { name: string; phone: string; address: string }) => {
      setShipping(data);
      setAddressModalOpen(false);
    },
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link
          href={`/product/${product.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">상품으로 돌아가기</span>
        </Link>

        <h1 className="text-xl font-bold text-gray-900 mb-6">주문/결제</h1>

        {/* 배송지 정보 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>배송지</span>
              </div>
              <p className="font-semibold text-gray-900">{shipping.name || '—'}</p>
              <p className="text-sm text-gray-600 mt-0.5">{shipping.phone || '—'}</p>
              <p className="text-sm text-gray-600 mt-1 break-words">{shipping.address || '배송지를 입력해주세요'}</p>
            </div>
            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700 py-1 px-3 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              배송지 변경
            </button>
          </div>
        </section>

        {/* 주문 상품 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">주문 상품</h2>
          <div className="flex gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {product.image_url ? (
                <Image src={product.image_url} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                수량{' '}
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="inline-flex items-center justify-center w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  −
                </button>
                <span className="mx-2 font-medium text-gray-900">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="inline-flex items-center justify-center w-6 h-6 rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </p>
              <p className="text-xs text-gray-400 mt-2">예상 도착: 결제 후 7~14일 소요</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-semibold text-gray-900">{formatKRW(calculation.final_price * quantity)}</p>
            </div>
          </div>
        </section>

        {/* 결제 금액 / 적립 혜택 */}
        <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">결제 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">결제금액</span>
              <span className="font-semibold text-gray-900">{formatKRW(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>적립 혜택</span>
              <span>결제 금액의 1% 적립 예정 (약 {formatKRW(Math.round(totalPrice * 0.01))})</span>
            </div>
          </div>
        </section>

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
