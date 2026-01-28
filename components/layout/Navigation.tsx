'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants/navigation';

const NAV_ITEMS = [
  { 
    label: '카테고리', 
    href: '/categories',
    hasDropdown: true,
  },
  { 
    label: '핫딜', 
    href: '/hot-deals',
    badge: 'HOT',
  },
  { 
    label: '신상품', 
    href: '/?sort=new',
  },
  { 
    label: '브랜드', 
    href: '/brands',
  },
];

export default function Navigation() {
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {NAV_ITEMS.map((item) => (
        <div
          key={item.label}
          className="relative"
          onMouseEnter={() => item.hasDropdown && setShowMegaMenu(true)}
          onMouseLeave={() => item.hasDropdown && setShowMegaMenu(false)}
        >
          <Link
            href={item.href}
            className="flex items-center gap-1 text-sm font-semibold text-black hover:text-gray-600 transition-colors py-2"
          >
            <span>{item.label}</span>
            {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
            {item.badge && (
              <span className="bg-red text-white text-[10px] font-bold px-1.5 py-0.5 ml-1">
                {item.badge}
              </span>
            )}
          </Link>

          {/* 메가메뉴 */}
          {item.hasDropdown && showMegaMenu && (
            <div className="absolute top-full left-0 w-screen max-w-xs bg-white border border-gray-200 shadow-lg z-50 animate-slide-in-top">
              <div className="p-6">
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/home?category=all"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-black">전체 상품</div>
                      <div className="text-xs text-gray-500">모든 카테고리 보기</div>
                    </div>
                  </Link>
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Link
                        key={category.id}
                        href={category.href}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-gray-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-black" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-black">{category.name}</div>
                          <div className="text-xs text-gray-500">인기 상품 보기</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
