'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';

export default function AuthButtons() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-8 bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="hidden lg:flex items-center gap-4">
        <Link
          href="/mypage"
          className="flex items-center gap-1 text-sm text-black hover:text-gray-600 transition-colors font-medium"
        >
          <User className="w-5 h-5" />
          <span className="hidden sm:inline">마이</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">로그아웃</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-3">
      <Link
        href="/login"
        className="text-sm text-black hover:text-gray-600 font-medium transition-colors"
      >
        로그인
      </Link>
      <Link
        href="/signup"
        className="text-sm bg-black hover:bg-gray-800 text-white font-semibold px-5 py-2.5 transition-colors"
      >
        회원가입
      </Link>
    </div>
  );
}
