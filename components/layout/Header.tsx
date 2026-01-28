import { Suspense } from 'react';
import Link from 'next/link';
import AuthButtons from '@/components/layout/AuthButtons';
import MobileSearchBar from '@/components/layout/MobileSearchBar';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            ymarketer
          </h1>
        </Link>

        {/* 우측 - 로그인/회원가입 또는 사용자 메뉴 */}
        <AuthButtons />
      </div>

      {/* 모바일 검색창 */}
      <Suspense fallback={<div className="sm:hidden h-12" />}>
        <MobileSearchBar />
      </Suspense>
    </header>
  );
}
