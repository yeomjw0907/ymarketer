import Link from 'next/link';
import { TrendingDown, ArrowRight } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';

const SHOWCASE_ITEMS = [
  {
    id: 1,
    name: '스노우피크 텐트',
    category: '캠핑',
    kr_price: 499000,
    jp_price: 467534,
    saved: 31466,
    percent: 6.3,
  },
  {
    id: 2,
    name: '타이틀리스트 프로V1 골프공',
    category: '골프',
    kr_price: 65000,
    jp_price: 52800,
    saved: 12200,
    percent: 18.8,
  },
  {
    id: 3,
    name: '아크테릭스 아톰 재킷',
    category: '패션',
    kr_price: 389000,
    jp_price: 342500,
    saved: 46500,
    percent: 12.0,
  },
];

export default function PriceShowcase() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-50 border-y-2 border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight">PRICE COMPARISON</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">한국 vs 일본, 실제 가격을 비교해보세요</p>
        </div>

        {/* 비교 카드 */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {SHOWCASE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="bg-white border-2 border-gray-300 hover:border-black hover:shadow-xl transition-all group"
            >
              {/* 카테고리 배지 */}
              <div className="bg-black text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1.5 sm:py-2 uppercase tracking-wide">
                {item.category}
              </div>

              {/* 상품명 */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-black text-black mb-4 sm:mb-6 min-h-[2.5rem] sm:min-h-[3rem]">
                  {item.name}
                </h3>

                {/* 가격 비교 */}
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  {/* 한국 가격 */}
                  <div className="flex items-center justify-between pb-2 sm:pb-3 border-b border-gray-200">
                    <span className="text-xs sm:text-sm font-bold text-gray-600">🇰🇷 한국</span>
                    <span className="text-sm sm:text-lg font-bold text-gray-400 line-through">
                      {formatKRW(item.kr_price)}
                    </span>
                  </div>

                  {/* 일본 가격 */}
                  <div className="flex items-center justify-between pb-2 sm:pb-3 border-b-2 border-black">
                    <span className="text-xs sm:text-sm font-bold text-black">🇯🇵 YMARKETER</span>
                    <span className="text-lg sm:text-2xl font-black text-black">
                      {formatKRW(item.jp_price)}
                    </span>
                  </div>
                </div>

                {/* 절약 금액 */}
                <div className="bg-red text-white p-3 sm:p-4 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold">절약 금액</span>
                    <span className="text-base sm:text-xl font-black">{formatKRW(item.saved)}</span>
                  </div>
                  <div className="text-[10px] sm:text-xs mt-1 opacity-90">
                    약 {item.percent}% 저렴
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/search"
                  className="flex items-center justify-center gap-1.5 sm:gap-2 w-full bg-white border-2 border-black hover:bg-black hover:text-white text-black font-bold text-sm sm:text-base py-2.5 sm:py-3 transition-colors group-hover:bg-black group-hover:text-white"
                >
                  <span>상세보기</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 전체보기 링크 */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/hot-deals"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-black hover:text-gray-600 font-bold text-sm sm:text-base transition-colors"
          >
            <span>전체 핫딜 보기</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
