'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Zap, Heart, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const NAV_ITEMS = [
  { href: '/categories', label: '카테고리', icon: LayoutGrid },
  { href: '/hot-deals', label: '핫딜', icon: Zap },
  { href: '/', label: '홈', icon: Home },
  { href: '/favorites', label: '좋아요', icon: Heart },
  { href: '/mypage', label: '마이', icon: User, loginLabel: '로그인' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (item: (typeof NAV_ITEMS)[0]) => {
    if (item.href === '/') return pathname === '/';
    return pathname.startsWith(item.href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-gray-200 safe-area-pb"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          const label = item.loginLabel && !isLoggedIn ? item.loginLabel : item.label;
          const href = item.loginLabel && !isLoggedIn ? '/login' : item.href;
          
          return (
            <Link
              key={item.href}
              href={href}
              className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${active ? 'text-blue-600' : ''}`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[9px] font-medium truncate max-w-full ${
                  active ? 'text-blue-600' : ''
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
