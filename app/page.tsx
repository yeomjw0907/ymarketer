import Link from 'next/link';
import Image from 'next/image';
import { supabaseServer } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice, formatKRW } from '@/lib/utils/calculator';
import { Product } from '@/lib/types/database.types';

// 카테고리 필터 타입
type Category = 'all' | 'camping' | 'golf' | 'fashion' | 'beauty' | 'electronics';

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'all', label: '전체', emoji: '🏷️' },
  { value: 'camping', label: '캠핑', emoji: '⛺' },
  { value: 'golf', label: '골프', emoji: '⛳' },
  { value: 'fashion', label: '패션', emoji: '👔' },
  { value: 'beauty', label: '뷰티', emoji: '💄' },
  { value: 'electronics', label: '전자기기', emoji: '📱' },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  // Next.js 15: searchParams는 Promise로 감싸져 있어서 await 필요
  const params = await searchParams;
  const category = (params.category as Category) || 'all';
  const settings = await getGlobalSettings();

  // 상품 목록 가져오기
  let query = supabaseServer
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              일본 가서 사면<br />비행기 값 뽑습니다
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
              우리가 대신 사다 드립니다.<br />
              관부가세, 배송비 포함해도 <span className="font-bold text-green-600">최대 30% 저렴</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
                <div className="text-sm text-gray-500">평균 절약 금액</div>
                <div className="text-2xl font-bold text-blue-600">150,000원</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
                <div className="text-sm text-gray-500">누적 주문</div>
                <div className="text-2xl font-bold text-blue-600">1,234건</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-100 bg-white sticky top-16 sm:top-20 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/?category=${cat.value}`}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap
                  transition-all
                  ${
                    category === cat.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {!products || products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">등록된 상품이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">관리자 페이지에서 상품을 추가해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product: Product) => {
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
                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all"
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
                        <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          {Math.round((calculation.saved_amount / product.kr_price) * 100)}% SAVE
                        </div>
                      )}

                      {/* HOT 배지 */}
                      {product.is_hot && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          🔥 HOT
                        </div>
                      )}
                    </div>

                    {/* 상품 정보 */}
                    <div className="p-4 space-y-2">
                      {/* 브랜드 */}
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {product.brand}
                      </div>

                      {/* 상품명 */}
                      <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      {/* 가격 비교 */}
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">
                            {formatKRW(product.kr_price)}
                          </span>
                          <span className="text-xs text-gray-500">국내가</span>
                        </div>
                        <div className="text-2xl font-extrabold text-blue-600">
                          {formatKRW(calculation.final_price)}
                        </div>
                        {calculation.saved_amount > 0 && (
                          <div className="text-sm font-bold text-green-600">
                            {formatKRW(calculation.saved_amount)} 저렴!
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
