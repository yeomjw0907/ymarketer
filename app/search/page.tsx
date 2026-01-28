import { Search } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice } from '@/lib/utils/calculator';
import ProductCard from '@/components/product/ProductCard';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; brand?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  
  const params = await searchParams;
  const query = params.q || '';
  const brand = params.brand || '';
  const settings = await getGlobalSettings();

  let products = [];
  if (query.trim() || brand.trim()) {
    let dbQuery = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (query.trim()) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (brand.trim()) {
      dbQuery = dbQuery.eq('brand', brand);
    }

    const { data } = await dbQuery.order('created_at', { ascending: false });
    products = data || [];
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 검색 헤더 */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">
            SEARCH RESULTS
          </h1>
          {(query || brand) ? (
            <div className="flex items-center gap-2">
              {query && (
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-black">"{query}"</span> 검색 결과
                </p>
              )}
              {brand && (
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-black">{brand}</span> 브랜드
                </p>
              )}
              <span className="text-gray-400">•</span>
              <p className="text-sm text-gray-500">{products.length}개 상품</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">상품명, 브랜드로 검색하세요</p>
          )}
        </div>

        {!query && !brand ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-black font-bold text-lg mb-1">검색어를 입력해주세요</p>
            <p className="text-sm text-gray-500">상단 검색바를 이용해보세요</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-black font-bold text-lg mb-2">검색 결과가 없습니다</p>
            <p className="text-sm text-gray-500 mb-6">다른 키워드로 검색해보세요</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => {
              const calc = calculatePrice(product.jp_price, product.kr_price, product.weight, settings);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  calculation={calc}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
