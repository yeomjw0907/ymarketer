'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    // 1.5초 후 인증 페이지로 자동 이동
    const timer = setTimeout(() => {
      router.push('/auth');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      {/* 로고 애니메이션 */}
      <div className="text-center animate-fade-in">
        <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
          YMARKETER
        </h1>
        <p className="text-xl text-gray-400 font-light tracking-wider">
          일본 직구, 더 똑똑하게
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
