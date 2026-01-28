'use client';

import { useState } from 'react';
import { ShoppingCart, CheckCircle } from 'lucide-react';

interface OrderFormProps {
  productId: string;
  productName: string;
  finalPrice: number;
}

export default function OrderForm({ productId, productName, finalPrice }: OrderFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    address: '',
    customerMemo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalPrice = finalPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          address: formData.address,
          customer_memo: formData.customerMemo,
          quantity,
          final_price: totalPrice,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          customerName: '',
          customerPhone: '',
          address: '',
          customerMemo: '',
        });
      } else {
        alert('주문 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('주문 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 text-center shadow-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          신청이 완료되었습니다!
        </h3>
        <p className="text-gray-600 mb-4">
          입금 계좌 정보를 문자로 보내드렸습니다.<br />
          확인 후 입금해주시면 바로 주문이 진행됩니다.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          문의사항은 고객센터(1234-5678)로 연락주세요.
        </p>
        <button
          onClick={() => setShowSuccess(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors"
        >
          추가 주문하기
        </button>
      </div>
    );
  }

  return (
    <div id="order-form" className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-6 h-6 text-white" />
          <h2 className="text-xl font-bold text-white">구매대행 신청하기</h2>
        </div>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* 주문 상품 정보 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-700 font-medium mb-1">주문 상품</div>
          <div className="font-bold text-gray-900 mb-3">{productName}</div>
          
          {/* 수량 선택 */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">수량</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-bold"
              >
                -
              </button>
              <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-8 h-8 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-bold"
              >
                +
              </button>
            </div>
          </div>
          
          {/* 총 금액 */}
          <div className="mt-3 pt-3 border-t border-blue-200 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">총 결제 금액</span>
            <span className="text-lg font-bold text-blue-600">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 이름 */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
            이름 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customerName"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="홍길동"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="customerPhone"
            required
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
            placeholder="010-1234-5678"
          />
        </div>

        {/* 배송지 주소 */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            배송지 주소 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            required
            rows={3}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-400"
            placeholder="서울특별시 강남구 테헤란로 123 (상세주소 포함)"
          />
        </div>

        {/* 요청사항 */}
        <div>
          <label htmlFor="customerMemo" className="block text-sm font-medium text-gray-700 mb-2">
            요청사항 (선택)
          </label>
          <textarea
            id="customerMemo"
            rows={2}
            value={formData.customerMemo}
            onChange={(e) => setFormData({ ...formData, customerMemo: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-400"
            placeholder="배송 시 요청사항이 있으시면 입력해주세요."
          />
        </div>

        {/* 안내 문구 */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 leading-relaxed">
          <p className="font-medium text-gray-900 mb-2">📌 주문 안내</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>신청 후 입금 계좌를 문자로 보내드립니다.</li>
            <li>입금 확인 후 일본 현지에서 상품을 구매합니다.</li>
            <li>배송까지 평균 7~14일 소요됩니다.</li>
            <li>회원가입 없이 주문 가능합니다.</li>
          </ul>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl text-lg shadow-lg active:scale-95 transition-all"
        >
          {isSubmitting ? '신청 중...' : '신청 완료'}
        </button>
      </form>
    </div>
  );
}
