import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice } from '@/lib/utils/calculator';
import ProductCard from '@/components/product/ProductCard';

export default async function FavoritesPage() {
  const supabase = await createSupabaseServerClient();
  
  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/favorites');
  }

  const settings = await getGlobalSettings();

  // 찜한 상품 목록 가져오기
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      id,
      created_at,
      product_id,
      products (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const favoriteProducts = favorites?.map((fav) => fav.products).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8 border-b border-gray-200 pb-8">
          <h1 className="text-3xl font-black text-black mb-2 tracking-tight">FAVORITES</h1>
          <p className="text-sm text-gray-500 font-medium">{favoriteProducts.length}개 상품</p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-black font-bold text-lg mb-2">NO FAVORITES</p>
            <p className="text-gray-500 text-sm mb-6">찜한 상품이 없습니다</p>
            <Link
              href="/"
              className="inline-block bg-black hover:bg-gray-800 text-white font-semibold px-8 py-3 transition-colors"
            >
              상품 보러가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {favoriteProducts.map((product: any) => {
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
