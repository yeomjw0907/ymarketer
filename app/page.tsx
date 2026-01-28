import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice, formatKRW } from '@/lib/utils/calculator';
import { Product } from '@/lib/types/database.types';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import TrendSection from '@/components/home/TrendSection';
import FullWidthBanner from '@/components/home/FullWidthBanner';

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

  // HOT 상품 (메인 상단 노출)
  const hotProducts = products?.filter((p) => p.is_hot).slice(0, 4) || [];
  
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
      {/* 히어로 배너 (롤링) - DB 데이터 또는 기본 배너 */}
      <HeroBanner banners={heroBanners ?? undefined} />

      {/* 카테고리 섹션 */}
      <CategorySection />

      {/* HOT 신상품 섹션 */}
      {hotProducts.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">🔥 지금 핫한 신상</h2>
                <p className="text-sm text-gray-600">놓치면 후회할 인기 상품</p>
              </div>
              <Link
                href="/?category=all"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                전체보기 →
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {hotProducts.map((product: Product) => {
                const calculation = calculatePrice(
                  product.jp_price,
                  product.kr_price,
                  product.weight,
                  settings
                );

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* 이미지 */}
                    <div className="relative aspect-square bg-gray-100">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {/* 절약 배지 */}
                      {calculation.saved_amount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round((calculation.saved_amount / product.kr_price) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-3">
                      <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatKRW(calculation.final_price)}
                        </span>
                      </div>
                      {calculation.saved_amount > 0 && (
                        <div className="text-xs text-red-600 font-medium mt-1">
                          {formatKRW(calculation.saved_amount)} 절약
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 트렌드 섹션 (매거진 스타일) */}
      <TrendSection />

      {/* 긴 프로모션 배너 */}
      <FullWidthBanner />

      {/* 추천 상품 섹션 */}
      {newProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">✨ 추천 아이템</h2>
                <p className="text-sm text-gray-600">ymarketer가 엄선한 상품</p>
              </div>
              <Link
                href="/?category=all"
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                전체보기 →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {newProducts.map((product: Product) => {
                const calculation = calculatePrice(
                  product.jp_price,
                  product.kr_price,
                  product.weight,
                  settings
                );

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                  >
                    {/* 이미지 */}
                    <div className="relative aspect-square bg-gray-100">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                      
                      {/* 절약 배지 */}
                      {calculation.saved_amount > 0 && (
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round((calculation.saved_amount / product.kr_price) * 100)}% SAVE
                        </div>
                      )}

                      {/* HOT 배지 */}
                      {product.is_hot && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          HOT
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-3">
                      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
                        {product.brand}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight">
                        {product.name}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 line-through">
                            {formatKRW(product.kr_price)}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatKRW(calculation.final_price)}
                        </div>
                        {calculation.saved_amount > 0 && (
                          <div className="text-xs text-green-600 font-medium">
                            {formatKRW(calculation.saved_amount)} 이득
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 상품 없을 때 */}
      {(!products || products.length === 0) && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-500 text-lg mb-4">등록된 상품이 없습니다.</p>
            <p className="text-gray-400 text-sm">관리자 페이지에서 상품을 추가해주세요.</p>
          </div>
        </section>
      )}
    </div>
  );
}
