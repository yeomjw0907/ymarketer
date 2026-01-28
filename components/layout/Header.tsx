import { Suspense } from 'react';
import AuthButtons from '@/components/layout/AuthButtons';
import MobileSearchBar from '@/components/layout/MobileSearchBar';
import Logo from '@/components/brand/Logo';
import TopBar from '@/components/layout/TopBar';
import Navigation from '@/components/layout/Navigation';
import UserActions from '@/components/layout/UserActions';
import MobileMenu from '@/components/layout/MobileMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* 상단바 (데스크톱만) */}
      <TopBar />

      {/* 메인 헤더 */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-8">
            {/* 로고 */}
            <Logo size="md" />

            {/* 네비게이션 (데스크톱) */}
            <Navigation />

            {/* 우측 액션 */}
            <div className="flex items-center gap-4">
              <UserActions />
              <AuthButtons />
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 검색창 */}
      <Suspense fallback={<div className="lg:hidden h-12" />}>
        <MobileSearchBar />
      </Suspense>
    </header>
  );
}
