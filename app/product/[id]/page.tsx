import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Package, Truck, Shield } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice, formatKRW, formatJPY } from '@/lib/utils/calculator';
import PriceComparisonPanel from '@/components/product/PriceComparisonPanel';
import OrderForm from '@/components/product/OrderForm';
import ReviewSection from '@/components/product/ReviewSection';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = createSupabaseServerClient();
  
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

  // 스크롤 이동 함수를 위한 클라이언트 컴포넌트는 별도로 분리
  const scrollToOrder = () => {
    const element = document.getElementById('order-form');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">상품 목록으로</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 좌측: 상품 이미지 */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-lg">
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
              
              {/* HOT 배지 */}
              {product.is_hot && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  🔥 HOT
                </div>
              )}
            </div>

            {/* 혜택 안내 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-700">빠른 배송</div>
                <div className="text-xs text-gray-500">7-14일</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-700">정품 보증</div>
                <div className="text-xs text-gray-500">100%</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-xs font-medium text-gray-700">안전 포장</div>
                <div className="text-xs text-gray-500">파손 방지</div>
              </div>
            </div>
          </div>

          {/* 우측: 상품 정보 */}
          <div className="space-y-6">
            {/* 브랜드 & 상품명 */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
                {product.brand}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
                {product.name}
              </h1>
              
              {/* 기본 정보 */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <div className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
                  🏷️ {product.category === 'camping' && '캠핑'}
                  {product.category === 'golf' && '골프'}
                  {product.category === 'fashion' && '패션'}
                  {product.category === 'beauty' && '뷰티'}
                  {product.category === 'electronics' && '전자기기'}
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
                  📦 무게: {product.weight}kg
                </div>
                <div className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600">
                  🇯🇵 일본 현지가: {formatJPY(product.jp_price)}
                </div>
              </div>
            </div>

            {/* 가격 비교 패널 */}
            <PriceComparisonPanel
              kr_price={product.kr_price}
              jp_price={product.jp_price}
              calculation={calculation}
              yen_rate={settings.yen_rate}
            />

            {/* CTA 버튼 (스크롤 이동) */}
            <a
              href="#order-form"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg text-center shadow-lg active:scale-95 transition-all"
            >
              🛒 구매대행 신청하기
            </a>
          </div>
        </div>

        {/* 상품 상세 설명 */}
        {product.description && (
          <div className="mt-12 bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">상품 상세 정보</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* 주문 폼 */}
        <div className="mt-12">
          <OrderForm
            productId={product.id}
            productName={product.name}
            finalPrice={calculation.final_price}
          />
        </div>

        {/* 리뷰 섹션 */}
        <ReviewSection productId={product.id} />

        {/* 하단 Sticky CTA (모바일) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-gray-200 z-50">
          <a
            href="#order-form"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-lg text-center shadow-lg active:scale-95 transition-all"
          >
            🛒 {formatKRW(calculation.final_price)} 신청하기
          </a>
        </div>
      </div>
    </div>
  );
}
