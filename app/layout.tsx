import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import { ToastProvider } from "@/components/common/Toast";

export const metadata: Metadata = {
  title: "ymarketer | 일본 직구 가격 비교",
  description: "일본 현지 가격과 한국 최저가를 비교하여 합리적인 직구를 도와드립니다. 관부가세, 배송비, 수수료까지 모두 포함한 실제 가격을 확인하세요.",
  keywords: "ymarketer, 일본 직구, 가격 비교, 구매대행, 캠핑용품, 골프용품, 패션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased min-h-screen flex flex-col">
        <ToastProvider>
          <Header />
          <main className="flex-1 pb-16 lg:pb-0">
            {children}
          </main>
          <Footer />
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
        </ToastProvider>
      </body>
    </html>
  );
}
