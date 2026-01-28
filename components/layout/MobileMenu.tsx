'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  X, 
  User,
  Heart,
  Package,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/hooks/useAuth';
import { CATEGORIES, MENU_ITEMS } from '@/lib/constants/navigation';

export default function MobileMenu() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // 메뉴 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/auth');
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 햄버거 버튼 (모바일만) */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-black hover:text-gray-600 transition-colors"
        aria-label="메뉴 열기"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드 메뉴 */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-[70] lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-black text-black tracking-tight">MENU</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-black transition-colors"
            aria-label="메뉴 닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-full font-bold">
                {user.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-black truncate">{user.email}</p>
                <p className="text-xs text-gray-500">환영합니다!</p>
              </div>
            </div>
          ) : (
            <Link
              href="/auth"
              onClick={handleLinkClick}
              className="flex items-center justify-center gap-2 py-3 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
            >
              <User className="w-5 h-5" />
              로그인 / 회원가입
            </Link>
          )}
        </div>

        {/* 마이 메뉴 (로그인 시) */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/mypage/orders"
                onClick={handleLinkClick}
                className="flex flex-col items-center gap-2 py-3 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <Package className="w-6 h-6 text-black" />
                <span className="text-xs font-medium text-black">주문내역</span>
              </Link>
              <Link
                href="/favorites"
                onClick={handleLinkClick}
                className="flex flex-col items-center gap-2 py-3 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <Heart className="w-6 h-6 text-black" />
                <span className="text-xs font-medium text-black">찜</span>
              </Link>
              <Link
                href="/mypage/settings"
                onClick={handleLinkClick}
                className="flex flex-col items-center gap-2 py-3 hover:bg-gray-50 transition-colors rounded-lg"
              >
                <Settings className="w-6 h-6 text-black" />
                <span className="text-xs font-medium text-black">설정</span>
              </Link>
            </div>
          </div>
        )}

        {/* 카테고리 */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">카테고리</h3>
          <div className="space-y-1">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <Icon className="w-5 h-5 text-black" />
                  <span className="font-medium text-black">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 메뉴 */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">쇼핑</h3>
          <div className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-black" />
                    <span className="font-medium text-black">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* 고객지원 */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">고객지원</h3>
          <div className="space-y-1">
            <Link
              href="/mypage/notice"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors rounded-lg"
            >
              <Bell className="w-5 h-5 text-black" />
              <span className="font-medium text-black">공지사항</span>
            </Link>
            <Link
              href="/mypage/faq"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors rounded-lg"
            >
              <HelpCircle className="w-5 h-5 text-black" />
              <span className="font-medium text-black">FAQ</span>
            </Link>
            <Link
              href="/customer-service"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors rounded-lg"
            >
              <HelpCircle className="w-5 h-5 text-black" />
              <span className="font-medium text-black">고객센터</span>
            </Link>
          </div>
        </div>

        {/* 로그아웃 (로그인 시) */}
        {user && (
          <div className="p-4">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 w-full hover:bg-gray-50 transition-colors rounded-lg text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">로그아웃</span>
            </button>
          </div>
        )}

        {/* 하단 여백 */}
        <div className="h-20" />
      </div>
    </>
  );
}
