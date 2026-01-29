'use client';

import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // 인트로 페이지와 인증 페이지에서는 Header, Footer, MobileBottomNav 숨김
  const hideLayout = pathname === '/' || pathname === '/auth';
  
  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <MobileBottomNav />
      </Suspense>
    </>
  );
}
