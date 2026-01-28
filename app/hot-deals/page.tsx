import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice } from '@/lib/utils/calculator';
import ProductCard from '@/components/product/ProductCard';

export default async function HotDealsPage() {
  const supabase = await createSupabaseServerClient();
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">HOT DEALS</h1>
          <p className="text-sm text-gray-500 font-medium">최대 할인 상품</p>
        </div>

        {hotDeals.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-black font-bold text-lg mb-1">NO HOT DEALS</p>
            <p className="text-gray-500 text-sm">현재 핫딜 상품이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {hotDeals.map((product) => {
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
