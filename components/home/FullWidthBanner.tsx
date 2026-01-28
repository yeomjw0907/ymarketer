import Image from 'next/image';

export default function FullWidthBanner() {
  return (
    <section className="relative w-full h-[300px] sm:h-[400px] overflow-hidden">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=1920&h=600&fit=crop"
          alt="특별 프로모션"
          fill
          className="object-cover"
        />
      </div>

      {/* 다크 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />

      {/* 컨텐츠 */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-3">
              Limited Time Offer
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
              신규 회원 특별 혜택
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-6">
              첫 구매 시 즉시 사용 가능한 3만원 쿠폰 증정
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
              자세히 보기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
