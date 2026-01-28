'use client';

import Link from 'next/link';
import { Phone, Truck, Bell } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="hidden lg:block bg-black text-white text-xs">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-8">
          {/* 좌측: 서비스 링크 */}
          <div className="flex items-center gap-6">
            <Link 
              href="/customer-service" 
              className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span className="font-medium">고객센터</span>
            </Link>
            <Link 
              href="/track-order" 
              className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"
            >
              <Truck className="w-3 h-3" />
              <span className="font-medium">배송조회</span>
            </Link>
            <Link 
              href="/mypage/notice" 
              className="flex items-center gap-1.5 hover:text-gray-300 transition-colors"
            >
              <Bell className="w-3 h-3" />
              <span className="font-medium">공지사항</span>
            </Link>
          </div>

          {/* 우측: 프로모션 메시지 */}
          <div className="flex items-center gap-4">
            <span className="text-gray-300">🎉 첫 구매 시 추가 5% 할인</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">⚡ 평균 배송기간 7-14일</span>
          </div>
        </div>
      </div>
    </div>
  );
}
