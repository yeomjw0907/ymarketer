import { redirect } from 'next/navigation';
import Link from 'next/link';
import { User, Heart, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import LogoutButton from '@/components/mypage/LogoutButton';

export default async function MyPage() {
  const supabase = createSupabaseServerClient();
  
  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/mypage');
  }

  // 프로필 정보
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // 통계 가져오기
  const [ordersResult, favoritesResult] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }).eq('customer_phone', profile?.phone || ''),
    supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', user.id),
  ]);

  const orderCount = ordersResult.count || 0;
  const favoriteCount = favoritesResult.count || 0;

  const MENU_ITEMS = [
    { href: '/favorites', label: '좋아요', icon: Heart, description: `${favoriteCount}개 상품` },
    { href: '/mypage/orders', label: '주문 내역', icon: ShoppingCart, description: `${orderCount}건` },
    { href: '/mypage/settings', label: '설정', icon: Settings, description: '프로필 수정' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* 프로필 섹션 */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{profile?.name || '사용자'}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{orderCount}</div>
            <div className="text-xs text-gray-600">주문 건수</div>
          </div>
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600 mb-1">{favoriteCount}</div>
            <div className="text-xs text-gray-600">찜한 상품</div>
          </div>
        </div>

        {/* 메뉴 */}
        <div className="space-y-3">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            );
          })}

          {/* 로그아웃 */}
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
