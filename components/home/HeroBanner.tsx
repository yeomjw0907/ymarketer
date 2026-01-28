'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string;
  link_url: string | null;
  button_text: string | null;
}

interface HeroBannerProps {
  banners?: Banner[];
}

const DEFAULT_BANNERS = [
  {
    id: 'default-1',
    title: '한국보다 최대 40% 저렴하게',
    subtitle: '일본 직구의 새로운 기준',
    description: '정품 보장 + 빠른 배송 + 투명한 가격',
    image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop',
    link_url: '/hot-deals',
    button_text: '핫딜 보러가기',
  },
  {
    id: 'default-2',
    title: '평균 배송기간 7-14일',
    subtitle: '빠르고 안전한 배송',
    description: '일본 현지 → 한국 배송까지 원스톱',
    image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1920&h=800&fit=crop',
    link_url: '/track-order',
    button_text: '배송 조회',
  },
];

export default function HeroBanner({ banners }: HeroBannerProps) {
  const slides = banners && banners.length > 0 ? banners : DEFAULT_BANNERS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section 
      className="relative w-full bg-black overflow-hidden min-h-[180px] sm:min-h-0"
      style={{ aspectRatio: '4 / 1.5' }}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src={currentSlide.image_url}
          alt={currentSlide.title}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
      </div>

      {/* 컨텐츠 */}
      <div className="relative h-full container mx-auto px-3 sm:px-4 flex items-center py-6 sm:py-0">
        <div className="max-w-2xl text-white">
          {/* 서브타이틀 */}
          {currentSlide.subtitle && (
            <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider mb-1 sm:mb-2 md:mb-3 text-gray-300">
              {currentSlide.subtitle}
            </div>
          )}

          {/* 메인 타이틀 */}
          <h1 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-1.5 sm:mb-3 md:mb-4 leading-tight tracking-tight">
            {currentSlide.title}
          </h1>

          {/* 설명 */}
          {currentSlide.description && (
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              {currentSlide.description}
            </p>
          )}

          {/* CTA 버튼 */}
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Link
              href={currentSlide.link_url || '/hot-deals'}
              className="bg-white hover:bg-gray-100 text-black font-bold px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-xs sm:text-sm md:text-lg transition-colors"
            >
              {currentSlide.button_text || '쇼핑 시작하기'}
            </Link>
            <Link
              href="/customer-service"
              className="bg-transparent hover:bg-white/10 border-2 border-white text-white font-bold px-3 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-xs sm:text-sm md:text-lg transition-colors"
            >
              더 알아보기
            </Link>
          </div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-colors z-10"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </>
      )}

      {/* 인디케이터 */}
      {slides.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlaying(false);
              }}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 transition-all ${
                index === currentIndex
                  ? 'bg-white w-6 sm:w-8'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
