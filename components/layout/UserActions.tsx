'use client';

import Link from 'next/link';
import { Heart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

export default function UserActions() {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (user) {
      // 찜 개수 가져오기
      supabase
        .from('favorites')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)
        .then(({ count }) => setFavoriteCount(count || 0));
    } else {
      setFavoriteCount(0);
    }
  }, [user]);

  return (
    <div className="hidden lg:flex items-center gap-6">
      {/* 찜하기 */}
      <Link
        href="/favorites"
        className="relative flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
      >
        <Heart className="w-5 h-5" />
        <span>찜</span>
        {favoriteCount > 0 && (
          <span className="absolute -top-1 -right-2 bg-red text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center">
            {favoriteCount > 9 ? '9+' : favoriteCount}
          </span>
        )}
      </Link>

      {/* 마이페이지 */}
      <Link
        href={isAuthenticated ? '/mypage' : '/login'}
        className="flex items-center gap-1.5 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
      >
        <User className="w-5 h-5" />
        <span>마이페이지</span>
      </Link>
    </div>
  );
}
