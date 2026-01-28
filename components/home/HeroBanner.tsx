'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BANNER_IMAGES = [
  {
    id: 1,
    title: '일본 가서 사면 비행기 값 뽑습니다',
    subtitle: '관부가세, 배송비 포함해도 최대 30% 저렴',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1200&h=500&fit=crop',
    bgColor: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    title: '캠핑용품 특가전',
    subtitle: '일본 프리미엄 브랜드를 합리적인 가격에',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&h=500&fit=crop',
    bgColor: 'from-green-500 to-green-700',
  },
  {
    id: 3,
    title: '골프 시즌 준비',
    subtitle: '일본 골프용품 인기 브랜드 최대 40% 할인',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&h=500&fit=crop',
    bgColor: 'from-purple-500 to-purple-700',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + BANNER_IMAGES.length) % BANNER_IMAGES.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % BANNER_IMAGES.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden bg-gray-900">
      {/* 배너 슬라이드 */}
      <div
        className="flex transition-transform duration-700 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {BANNER_IMAGES.map((banner) => (
          <div key={banner.id} className="relative min-w-full h-full">
            {/* 배경 그라데이션 */}
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-90`} />
            
            {/* 배경 이미지 */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={banner.id === 1}
              />
            </div>

            {/* 텍스트 컨텐츠 */}
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center px-4 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                  {banner.title}
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8">
                  {banner.subtitle}
                </p>
                <button className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
                  지금 쇼핑하기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 이전/다음 버튼 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
        aria-label="이전 슬라이드"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all"
        aria-label="다음 슬라이드"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNER_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
