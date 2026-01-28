import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { supabaseServer } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice, formatKRW } from '@/lib/utils/calculator';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const settings = await getGlobalSettings();

  let products = [];
  if (query.trim()) {
    const { data } = await supabaseServer
      .from('products')
      .select('*')
      .eq('is_active', true)
      .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    products = data || [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 검색 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            {query ? `"${query}" 검색 결과` : '검색'}
          </h1>
          {query && (
            <p className="text-sm text-gray-600">총 {products.length}개의 상품</p>
          )}
        </div>

        {!query ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">검색어를 입력해주세요.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-400">다른 키워드로 검색해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => {
              const calc = calculatePrice(product.jp_price, product.kr_price, product.weight, settings);
              
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all group"
                >
                  <div className="relative aspect-square bg-gray-100">
                    {product.image_url && (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    {product.is_hot && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        🔥 HOT
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>

                    {calc.saved_amount > 0 && (
                      <div className="bg-green-50 rounded-lg p-2 mb-2">
                        <div className="text-green-600 font-bold text-xs">
                          {formatKRW(calc.saved_amount)} 저렴
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 line-through">
                      국내 {formatKRW(product.kr_price)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
