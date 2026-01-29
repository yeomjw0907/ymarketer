'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const INTRO_VIEWED_KEY = 'intro_viewed';

export default function IntroPage() {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // 이미 인트로를 본 적이 있는지 확인
    const hasViewedIntro = localStorage.getItem(INTRO_VIEWED_KEY);
    
    if (hasViewedIntro) {
      // 이미 본 경우 바로 auth 페이지로 이동
      router.push('/auth');
    } else {
      // 처음 보는 경우 인트로 표시
      setShowIntro(true);
      
      // 인트로를 봤다고 표시
      localStorage.setItem(INTRO_VIEWED_KEY, 'true');
      
      // 1.5초 후 인증 페이지로 자동 이동
      const timer = setTimeout(() => {
        router.push('/auth');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [router]);

  // 로딩 중이거나 이미 본 경우 빈 화면
  if (!showIntro) {
    return null;
  }

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
