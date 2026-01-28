import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice } from '@/lib/utils/calculator';
import { Product } from '@/lib/types/database.types';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import MagazineSection from '@/components/home/MagazineSection';
import BrandShowcase from '@/components/home/BrandShowcase';
import SocialProof from '@/components/home/SocialProof';
import PriceShowcase from '@/components/home/PriceShowcase';
import CustomerReviews from '@/components/home/CustomerReviews';
import FAQMini from '@/components/home/FAQMini';
import ProductCard from '@/components/product/ProductCard';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  
  // Next.js 15: searchParams는 Promise로 감싸져 있어서 await 필요
  const params = await searchParams;
  const category = params.category || 'all';
  const settings = await getGlobalSettings();

  // 상품 목록 가져오기
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('is_hot', { ascending: false })
    .order('created_at', { ascending: false });

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Failed to fetch products:', error);
  }

  // 핫딜 상품 (절약 금액 큰 순)
  const productsWithSavings = (products || []).map((product) => {
    const calc = calculatePrice(product.jp_price, product.kr_price, product.weight, settings);
    return {
      ...product,
      savedAmount: calc.saved_amount,
      calculation: calc,
    };
  });

  const hotDealProducts = productsWithSavings
    .filter((p) => p.savedAmount > 0)
    .sort((a, b) => b.savedAmount - a.savedAmount)
    .slice(0, 10);
  
  // 신상품 (최근 등록순)
  const newProducts = products?.slice(0, 8) || [];

  // 히어로 롤링 배너 (DB에서 노출 중인 것만)
  const { data: heroBanners } = await supabase
    .from('hero_banners')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 배너 */}
      <HeroBanner banners={heroBanners ?? undefined} />

      {/* 카테고리 섹션 */}
      <CategorySection />

      {/* 핫딜 섹션 (절약 금액 큰 순) - 쇼핑의 핵심! */}
      {hotDealProducts.length > 0 && (
        <section className="py-8 sm:py-12 lg:py-20 bg-white border-b border-gray-200">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="mb-6 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black mb-1.5 sm:mb-3 tracking-tight">BEST DEALS</h2>
              <p className="text-sm sm:text-base text-gray-600">
                한국보다 최대 <span className="text-red font-bold text-base sm:text-xl">{Math.round((hotDealProducts[0]?.savedAmount / hotDealProducts[0]?.kr_price) * 100)}%</span> 저렴
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {hotDealProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  calculation={product.calculation}
                />
              ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="mt-8 sm:mt-12 text-center">
              <Link 
                href="/hot-deals"
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-8 sm:py-3 bg-black text-white font-bold text-sm sm:text-base border border-black hover:bg-white hover:text-black transition-colors duration-200"
              >
                더보기
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 브랜드 쇼케이스 (쇼핑 유도) */}
      <BrandShowcase />

      {/* 추천 상품 섹션 */}
      {newProducts.length > 0 && (
        <section className="py-8 sm:py-12 lg:py-16 bg-gray-50">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-1.5 sm:mb-2 tracking-tight">NEW ARRIVALS</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">최신 상품</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {newProducts.map((product: Product) => {
                const calculation = calculatePrice(
                  product.jp_price,
                  product.kr_price,
                  product.weight,
                  settings
                );

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    calculation={calculation}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 상품 없을 때 */}
      {(!products || products.length === 0) && (
        <section className="py-32 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-black text-lg font-bold mb-2">NO PRODUCTS</p>
            <p className="text-gray-500 text-sm">등록된 상품이 없습니다</p>
          </div>
        </section>
      )}

      {/* === 여기서부터 신뢰/설명 섹션 (하단 배치) === */}

      {/* 매거진 섹션 (콘텐츠 + 쇼핑 유도) */}
      <MagazineSection />

      {/* 소셜 프루프 (통계) */}
      <SocialProof />

      {/* 가격 비교 쇼케이스 */}
      <PriceShowcase />

      {/* 고객 후기 슬라이더 */}
      <CustomerReviews />

      {/* FAQ 미니 섹션 */}
      <FAQMini />
    </div>
  );
}
