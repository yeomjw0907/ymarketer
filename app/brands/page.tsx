import { createSupabaseServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Building2 } from 'lucide-react';

export default async function BrandsPage() {
  const supabase = await createSupabaseServerClient();

  // 브랜드별 상품 개수 집계
  const { data: products } = await supabase
    .from('products')
    .select('brand')
    .eq('is_active', true);

  const brandCounts = products?.reduce((acc, product) => {
    const brand = product.brand || '기타';
    acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const brands = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">BRANDS</h1>
          <p className="text-sm text-gray-500 font-medium">{brands.length}개 브랜드</p>
        </div>

        {/* 브랜드 그리드 */}
        {brands.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-black font-bold text-lg mb-1">NO BRANDS</p>
            <p className="text-gray-500 text-sm">등록된 브랜드가 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/search?brand=${encodeURIComponent(brand.name)}`}
                className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 mx-auto mb-4 flex items-center justify-center group-hover:bg-black transition-colors">
                    <Building2 className="w-8 h-8 text-gray-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-black mb-1 text-sm">{brand.name}</h3>
                  <p className="text-xs text-gray-500">{brand.count}개 상품</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
