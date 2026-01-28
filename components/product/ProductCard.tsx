'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/common/Toast';
import { Product } from '@/lib/types/database.types';
import { formatKRW } from '@/lib/utils/calculator';

interface ProductCardProps {
  product: Product;
  calculation: {
    final_price: number;
    saved_amount: number;
  };
}

export default function ProductCard({ product, calculation }: ProductCardProps) {
  const toast = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFavorite();
  }, [product.id]);

  const checkFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // 조용히 실패 (로그인 안 한 경우 등)
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 클릭 방지
    e.stopPropagation();

    if (isLoading) return;

    // 햅틱 피드백 (진동)
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50ms 진동
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.warning('로그인이 필요합니다');
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1000);
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // 찜 제거
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', product.id);

        if (error) throw error;

        setIsFavorite(false);
        toast.success('찜 목록에서 제거되었습니다');
      } else {
        // 찜 추가
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: product.id,
          });

        if (error) throw error;

        setIsFavorite(true);
        toast.success('찜 목록에 추가되었습니다');
      }
    } catch (error) {
      console.error('Favorite toggle error:', error);
      toast.error('오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block bg-white overflow-hidden hover:opacity-80 transition-opacity"
    >
      {/* 이미지 (1:1 비율) */}
      <div className="relative aspect-square bg-gray-100 mb-2 border border-gray-200 group-hover:border-black transition-colors">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
        
        {/* 할인율 배지 (좌측 상단) - 각진 스타일 */}
        {calculation.saved_amount > 0 && (
          <div className="absolute top-2 left-2 bg-red text-white text-[10px] font-bold px-2 py-1">
            {Math.round((calculation.saved_amount / product.kr_price) * 100)}%
          </div>
        )}

        {/* HOT 배지 - 각진 스타일 */}
        {product.is_hot && (
          <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-1">
            HOT
          </div>
        )}

        {/* 찜하기 버튼 (우측 하단) - 각진 스타일 */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className="absolute bottom-2 right-2 w-7 h-7 flex items-center justify-center transition-all disabled:opacity-50 bg-white border border-gray-300 hover:bg-black hover:border-black group/btn"
          aria-label={isFavorite ? '찜 해제' : '찜하기'}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-all ${
              isFavorite ? 'fill-red text-red' : 'text-black group-hover/btn:text-white'
            }`}
          />
        </button>
      </div>

      {/* 상품 정보 */}
      <div className="px-0.5">
        <div className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide truncate font-medium">
          {product.brand}
        </div>
        <h3 className="text-xs font-medium text-black line-clamp-2 mb-1.5 leading-tight">
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-black">
            {formatKRW(calculation.final_price)}
          </span>
          {calculation.saved_amount > 0 && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatKRW(product.kr_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
