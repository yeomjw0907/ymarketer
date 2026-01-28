import Link from 'next/link';
import Image from 'next/image';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice, formatKRW } from '@/lib/utils/calculator';
import { Product } from '@/lib/types/database.types';

export default async function HotDealsPage() {
  const supabase = createSupabaseServerClient();
  const settings = await getGlobalSettings();

  // 모든 활성 상품 가져오기
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // 각 상품의 절약 금액 계산 후 정렬
  const productsWithSavings = (products || []).map((product) => {
    const calc = calculatePrice(product.jp_price, product.kr_price, product.weight, settings);
    return {
      ...product,
      savedAmount: calc.saved_amount,
      savingRate: calc.saved_amount > 0 ? Math.round((calc.saved_amount / product.kr_price) * 100) : 0,
    };
  });

  // 절약 금액 큰 순으로 정렬
  const hotDeals = productsWithSavings
    .filter((p) => p.savedAmount > 0)
    .sort((a, b) => b.savedAmount - a.savedAmount);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">⚡ 핫딜</h1>
          <p className="text-sm text-gray-600">지금 가장 많이 아낄 수 있는 상품들</p>
        </div>

        {hotDeals.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-500">현재 핫딜 상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {hotDeals.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all group relative"
              >
                {/* 순위 배지 */}
                {index < 3 && (
                  <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {index + 1}위
                  </div>
                )}

                {/* 이미지 */}
                <div className="relative aspect-square bg-gray-100">
                  {product.image_url && (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>

                {/* 정보 */}
                <div className="p-3">
                  <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  {/* 절약 금액 강조 */}
                  <div className="bg-red-50 rounded-lg p-2 mb-2">
                    <div className="text-red-600 font-bold text-sm">
                      {formatKRW(product.savedAmount)} 절약
                    </div>
                    <div className="text-red-500 text-xs">({product.savingRate}% 할인)</div>
                  </div>

                  <div className="text-xs text-gray-400 line-through mb-1">
                    국내 {formatKRW(product.kr_price)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
