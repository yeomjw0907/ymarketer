'use client';

import { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

interface TossPaymentButtonProps {
  amount: number;
  orderName: string;
  productId: string;
  quantity: number;
  shipping: { name: string; phone: string; address: string };
  userId: string;
  userEmail: string;
}

const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? '';

export default function TossPaymentButton({
  amount,
  orderName,
  productId,
  quantity,
  shipping,
  userId,
  userEmail,
}: TossPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!clientKey) {
      alert('결제 모듈이 설정되지 않았습니다. NEXT_PUBLIC_TOSS_CLIENT_KEY를 설정해주세요.');
      return;
    }
    if (!shipping.name?.trim() || !shipping.phone?.trim() || !shipping.address?.trim()) {
      alert('배송지 정보(이름, 전화번호, 주소)를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. 주문 생성 (pending)
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          customer_name: shipping.name,
          customer_phone: shipping.phone,
          address: shipping.address,
          quantity,
          final_price: amount,
        }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.error || '주문 생성 실패');
      }
      const { order } = await orderRes.json();
      const orderId = order.id;

      const successUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/order/success`
        : '';
      const failUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/order/fail`
        : '';

      const tossPayments = await loadTossPayments(clientKey);
      await tossPayments.requestPayment('카드', {
        amount,
        orderId,
        orderName: orderName.length > 100 ? orderName.slice(0, 97) + '…' : orderName,
        successUrl,
        failUrl,
        customerName: shipping.name,
        customerEmail: userEmail || undefined,
      });
    } catch (err: any) {
      if (err?.code !== 'USER_CANCEL' && err?.message?.includes('취소') === false) {
        console.error(err);
        alert(err?.message || '결제 요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={isLoading}
      className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap"
    >
      {isLoading ? '처리 중...' : '결제하기'}
    </button>
  );
}
