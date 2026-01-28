import Link from 'next/link';

const BRANDS = [
  { name: '스노우피크', nameEn: 'Snow Peak' },
  { name: '아크테릭스', nameEn: "Arc'teryx" },
  { name: '나이키', nameEn: 'Nike' },
  { name: '샤넬', nameEn: 'Chanel' },
  { name: '디올', nameEn: 'Dior' },
  { name: '애플', nameEn: 'Apple' },
  { name: '소니', nameEn: 'Sony' },
  { name: '무지', nameEn: 'MUJI' },
  { name: '유니클로', nameEn: 'Uniqlo' },
  { name: '타이틀리스트', nameEn: 'Titleist' },
  { name: '콜맨', nameEn: 'Coleman' },
  { name: '로고스', nameEn: 'Logos' },
];

export default function BrandShowcase() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-b border-gray-200">
      <div className="container mx-auto px-3 sm:px-4">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black mb-1.5 sm:mb-3 tracking-tight">
            FEATURED BRANDS
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            인기 브랜드 상품을 저렴하게 만나보세요
          </p>
        </div>

        {/* 브랜드 그리드 */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 max-w-6xl mx-auto">
          {BRANDS.map((brand) => (
            <Link
              key={brand.nameEn}
              href={`/search?brand=${encodeURIComponent(brand.name)}`}
              className="aspect-square border-2 border-gray-200 hover:border-black hover:shadow-lg transition-all flex items-center justify-center group"
            >
              <div className="text-center px-1 sm:px-2">
                <div className="text-xs sm:text-sm font-black text-black group-hover:scale-110 transition-transform">
                  {brand.nameEn}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">
                  {brand.name}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 전체보기 */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/brands"
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold text-sm sm:text-base px-5 py-2.5 sm:px-8 sm:py-3 transition-colors"
          >
            전체 브랜드 보기
          </Link>
        </div>
      </div>
    </section>
  );
}
