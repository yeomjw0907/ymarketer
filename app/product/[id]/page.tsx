import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Star, Truck, Shield } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice, formatJPY } from '@/lib/utils/calculator';
import FavoriteButton from '@/components/product/FavoriteButton';
import EnhancedPriceCard from '@/components/product/EnhancedPriceCard';
import ProductTabs from '@/components/product/ProductTabs';
import TrustBadges from '@/components/product/TrustBadges';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  
  // Next.js 15: params는 Promise로 감싸져 있어서 await 필요
  const { id } = await params;

  // 상품 정보 가져오기
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  // 전역 설정 및 가격 계산
  const settings = await getGlobalSettings();
  const calculation = calculatePrice(
    product.jp_price,
    product.kr_price,
    product.weight,
    settings
  );

  // 리뷰 개수 가져오기
  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('id', { count: 'exact' })
    .eq('product_id', id)
    .eq('is_visible', true);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black hover:text-gray-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">목록</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 좌측: 상품 이미지 */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 border border-gray-200 overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Package className="w-20 h-20" />
                </div>
              )}
              
              {/* HOT 배지 - 각진 스타일 */}
              {product.is_hot && (
                <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-2">
                  HOT
                </div>
              )}
            </div>

            {/* 혜택 안내 - 각진 스타일 */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white border border-gray-200 p-3 text-center">
                <Truck className="w-5 h-5 text-black mx-auto mb-1" />
                <div className="text-[10px] font-bold text-black">빠른 배송</div>
                <div className="text-[9px] text-gray-500">7-14일</div>
              </div>
              <div className="bg-white border border-gray-200 p-3 text-center">
                <Shield className="w-5 h-5 text-black mx-auto mb-1" />
                <div className="text-[10px] font-bold text-black">정품 보증</div>
                <div className="text-[9px] text-gray-500">100%</div>
              </div>
              <div className="bg-white border border-gray-200 p-3 text-center">
                <Package className="w-5 h-5 text-black mx-auto mb-1" />
                <div className="text-[10px] font-bold text-black">안전 포장</div>
                <div className="text-[9px] text-gray-500">파손 방지</div>
              </div>
            </div>
          </div>

          {/* 우측: 상품 정보 (Sticky) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* 브랜드 & 상품명 */}
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                {product.brand}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-black leading-tight mb-4">
                {product.name}
              </h1>
              
              {/* 평점 & 리뷰 */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-black text-black" />
                  <span className="font-bold text-sm">4.8</span>
                </div>
                <span className="text-xs text-gray-500">
                  리뷰 {reviewCount || 0}개
                </span>
              </div>

              {/* 기본 정보 */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 px-2 py-1 text-xs text-black font-medium">
                  {product.category === 'camping' && '캠핑'}
                  {product.category === 'golf' && '골프'}
                  {product.category === 'fashion' && '패션'}
                  {product.category === 'beauty' && '뷰티'}
                  {product.category === 'electronics' && '전자기기'}
                </div>
                <div className="bg-gray-50 px-2 py-1 text-xs text-gray-600">
                  {product.weight}kg
                </div>
              </div>
            </div>

            {/* 가격 비교 카드 (강화) */}
            <EnhancedPriceCard
              kr_price={product.kr_price}
              jp_price={product.jp_price}
              final_price={calculation.final_price}
              saved_amount={calculation.saved_amount}
              yen_rate={settings.yen_rate}
              weight={product.weight}
            />

            {/* 신뢰 배지 */}
            <TrustBadges />

            {/* CTA 버튼 */}
            <div className="flex gap-3">
              <FavoriteButton productId={product.id} size="lg" className="shrink-0" />
              <Link
                href={`/order/new?productId=${product.id}`}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-5 text-lg text-center transition-colors"
              >
                구매하기
              </Link>
            </div>
          </div>
        </div>

        {/* 탭 구조로 정보 정리 */}
        <ProductTabs
          productId={product.id}
          description={product.description}
          kr_price={product.kr_price}
          jp_price={product.jp_price}
          calculation={calculation}
          yen_rate={settings.yen_rate}
        />

        {/* 하단 Sticky CTA (모바일) - 각진 블랙 스타일 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50">
          <div className="flex gap-3">
            <FavoriteButton productId={product.id} size="lg" className="shrink-0" />
            <Link
              href={`/order/new?productId=${product.id}`}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-4 text-lg text-center transition-colors"
            >
              구매하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
