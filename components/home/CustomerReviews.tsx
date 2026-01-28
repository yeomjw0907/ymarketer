'use client';

import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: '김**',
    category: '캠핑용품',
    rating: 5,
    comment: '일본 직구가 이렇게 쉬울 줄 몰랐어요! 가격도 저렴하고 배송도 빨라요.',
  },
  {
    id: 2,
    name: '이**',
    category: '골프용품',
    rating: 5,
    comment: '한국에서 사는 것보다 훨씬 저렴해서 놀랐습니다. 정품 보장도 좋고요!',
  },
  {
    id: 3,
    name: '박**',
    category: '패션',
    rating: 4,
    comment: '배송은 조금 걸리지만 가격을 생각하면 충분히 기다릴 만해요.',
  },
  {
    id: 4,
    name: '최**',
    category: '전자기기',
    rating: 5,
    comment: '정품이고 AS도 가능하다니 믿고 구매할 수 있어요.',
  },
];

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const currentReview = REVIEWS[currentIndex];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-1.5 sm:mb-3 tracking-tight">
            CUSTOMER REVIEWS
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">고객님들의 생생한 후기</p>
        </div>

        {/* 리뷰 슬라이더 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-gray-300 p-5 sm:p-8 md:p-12 relative">
            {/* 인용 부호 */}
            <div className="text-4xl sm:text-6xl font-black text-gray-200 absolute top-3 left-3 sm:top-4 sm:left-4">
              "
            </div>

            {/* 리뷰 내용 */}
            <div className="relative z-10">
              {/* 별점 */}
              <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-3 sm:mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 sm:w-6 sm:h-6 ${
                      i < currentReview.rating
                        ? 'fill-black text-black'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* 코멘트 */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black text-center mb-4 sm:mb-6 leading-relaxed">
                {currentReview.comment}
              </p>

              {/* 작성자 정보 */}
              <div className="text-center">
                <div className="font-black text-black text-sm sm:text-base mb-0.5 sm:mb-1">
                  {currentReview.name}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">
                  {currentReview.category} 구매
                </div>
              </div>
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <button
                onClick={handlePrev}
                className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-black hover:bg-black hover:text-white text-black flex items-center justify-center transition-colors"
                aria-label="이전"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* 인디케이터 */}
              <div className="flex gap-1.5 sm:gap-2">
                {REVIEWS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlay(false);
                      setCurrentIndex(index);
                    }}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 transition-colors ${
                      index === currentIndex ? 'bg-black' : 'bg-gray-300'
                    }`}
                    aria-label={`리뷰 ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-black hover:bg-black hover:text-white text-black flex items-center justify-center transition-colors"
                aria-label="다음"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* 전체 평점 */}
          <div className="text-center mt-4 sm:mt-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-black text-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
              <span className="font-black">4.8</span>
              <span className="font-medium opacity-80 text-xs sm:text-sm">
                / 5.0 (1,234개 리뷰)
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
