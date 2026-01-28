'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/common/Toast';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function FavoriteButton({ productId, className = '', size = 'md' }: FavoriteButtonProps) {
  const toast = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  useEffect(() => {
    checkFavorite();
  }, [productId]);

  const checkFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setUserId(null);
        return;
      }

      setUserId(user.id);

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();

      setIsFavorite(!!data);
    } catch (error) {
      // 조용히 실패 (로그인 안 한 경우 등)
    }
  };

  const handleToggle = async () => {
    if (isLoading) return;

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
          .eq('product_id', productId);

        if (error) throw error;

        setIsFavorite(false);
        toast.success('찜 목록에서 제거되었습니다');
      } else {
        // 찜 추가
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            product_id: productId,
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
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${sizeClasses[size]} flex items-center justify-center transition-all disabled:opacity-50 ${
        isFavorite
          ? 'bg-red text-white hover:bg-red-deep'
          : 'bg-white border-2 border-gray-300 text-black hover:border-black'
      } ${className}`}
      aria-label={isFavorite ? '찜 해제' : '찜하기'}
    >
      <Heart
        className={`${iconSizes[size]} transition-all ${isFavorite ? 'fill-current' : ''}`}
      />
    </button>
  );
}
