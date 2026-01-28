'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const MAGAZINE_ITEMS = [
  {
    id: 1,
    category: 'CAMPING',
    title: '2024 봄 캠핑 시즌 필수템',
    subtitle: '캠핑 전문가가 추천하는 베스트 아이템',
    description: '스노우피크, 콜맨, 로고스 등 일본 캠핑 브랜드의 신상품을 한국보다 최대 30% 저렴하게 만나보세요.',
    link: '/search?category=camping',
    image: '/images/magazine-camping.jpg',
  },
  {
    id: 2,
    category: 'GOLF',
    title: '골프 시즌 준비 완벽 가이드',
    subtitle: '프로 골퍼가 알려주는 장비 선택법',
    description: '타이틀리스트, 테일러메이드, 캘러웨이 등 프리미엄 골프 용품을 합리적인 가격에 구매하세요.',
    link: '/search?category=golf',
    image: '/images/magazine-golf.jpg',
  },
  {
    id: 3,
    category: 'FASHION',
    title: '일본 패션 트렌드 2024',
    subtitle: '도쿄에서 핫한 브랜드 총정리',
    description: '아크테릭스, 유니클로, 무지 등 일본에서만 구매 가능한 한정 상품과 독점 컬렉션을 만나보세요.',
    link: '/search?category=fashion',
    image: '/images/magazine-fashion.jpg',
  },
];

export default function MagazineSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        {/* 헤더 */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-black mb-1.5 sm:mb-2 tracking-tight">
            MAGAZINE
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            전문가의 큐레이션과 트렌드를 만나보세요
          </p>
        </div>

        {/* 횡스크롤 컨테이너 */}
        <div 
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {MAGAZINE_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="flex-shrink-0 w-[70vw] sm:w-[280px] snap-start"
            >
              <div className="border border-gray-200 hover:border-black transition-all group h-full">
                {/* 이미지 */}
                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                  {/* 이미지 플레이스홀더 (추후 실제 이미지 교체) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-6xl font-black text-white/20">
                      {item.category}
                    </div>
                  </div>
                  
                  {/* 카테고리 태그 */}
                  <div className="absolute top-0 left-0 bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-wide">
                    {item.category}
                  </div>

                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* 콘텐츠 */}
                <div className="p-4 bg-white">
                  {/* 서브타이틀 */}
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                    {item.subtitle}
                  </div>

                  {/* 타이틀 */}
                  <h3 className="text-sm font-black text-black mb-2 leading-tight line-clamp-2">
                    {item.title}
                  </h3>

                  {/* 설명 */}
                  <p className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-black font-bold text-xs group-hover:gap-2 transition-all">
                    <span>상품 보러가기</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 스크롤 힌트 (모바일) */}
        <div className="mt-4 text-center sm:hidden">
          <p className="text-xs text-gray-400 font-medium">← 좌우로 스크롤하세요 →</p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
