'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogIn, UserPlus, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import OrderForm from './OrderForm';

interface OrderSectionProps {
  productId: string;
  productName: string;
  finalPrice: number;
}

export default function OrderSection({
  productId,
  productName,
  finalPrice,
}: OrderSectionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // 로딩 중
  if (isLoggedIn === null) {
    return (
      <div id="order-form" className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        <div className="flex items-center justify-center py-12 text-gray-500">
          <span className="animate-pulse">주문 정보를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // 비로그인: 로그인 유도
  if (!isLoggedIn) {
    return (
      <div id="order-form" className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-gray-100 to-gray-50 px-6 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3 text-gray-700">
            <ShoppingCart className="w-6 h-6 text-gray-500" />
            <h2 className="text-xl font-bold text-gray-900">구매대행 신청하기</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-700 mb-2 font-medium">
            주문은 <span className="text-blue-600 font-bold">로그인한 회원</span>만 가능합니다.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            로그인 또는 회원가입 후 주문해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/login?redirect=/product/${productId}`}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <LogIn className="w-5 h-5" />
              로그인
            </Link>
            <Link
              href={`/signup?redirect=/product/${productId}`}
              className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              회원가입
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 로그인: 주문 폼
  return (
    <OrderForm
      productId={productId}
      productName={productName}
      finalPrice={finalPrice}
    />
  );
}
