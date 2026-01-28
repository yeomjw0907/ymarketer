import { redirect } from 'next/navigation';
import { Heart, ShoppingCart, Settings, HelpCircle, Bell, Gift } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import UserSummaryCard from '@/components/mypage/UserSummaryCard';
import QuickActions from '@/components/mypage/QuickActions';
import RecentOrders from '@/components/mypage/RecentOrders';
import MenuGroup from '@/components/mypage/MenuGroup';
import LogoutButton from '@/components/mypage/LogoutButton';
import DeleteAccountButton from '@/components/mypage/DeleteAccountButton';

export default async function MyPage() {
  const supabase = await createSupabaseServerClient();
  
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
  const [ordersResult, favoritesResult, recentOrdersResult] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact' }).eq('customer_phone', profile?.phone || ''),
    supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', user.id),
    supabase
      .from('orders')
      .select('id, product_name, total_amount, status, created_at')
      .eq('customer_phone', profile?.phone || '')
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const orderCount = ordersResult.count || 0;
  const favoriteCount = favoritesResult.count || 0;
  const recentOrders = recentOrdersResult.data || [];

  const SHOPPING_MENU = [
    { href: '/mypage/orders', label: '주문 내역', icon: ShoppingCart, description: `${orderCount}건` },
    { href: '/favorites', label: '찜한 상품', icon: Heart, description: `${favoriteCount}개` },
  ];

  const SUPPORT_MENU = [
    { href: '/mypage/notice', label: '공지사항', icon: Bell, description: '새로운 소식' },
    { href: '/mypage/faq', label: 'FAQ', icon: HelpCircle, description: '자주 묻는 질문' },
    { href: '/mypage/events', label: '이벤트', icon: Gift, description: '진행 중인 이벤트' },
  ];

  const ACCOUNT_MENU = [
    { href: '/mypage/settings', label: '설정', icon: Settings, description: '프로필 수정' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <h1 className="text-3xl font-black text-black mb-8 tracking-tight">MY PAGE</h1>

        {/* 사용자 요약 카드 */}
        <UserSummaryCard
          name={profile?.name || '사용자'}
          email={user.email || ''}
          orderCount={orderCount}
          favoriteCount={favoriteCount}
          points={1500}
        />

        {/* 빠른 액션 */}
        <QuickActions />

        {/* 최근 주문 */}
        <RecentOrders orders={recentOrders} />

        {/* 메뉴 그룹 */}
        <MenuGroup title="쇼핑 정보" items={SHOPPING_MENU} />
        <MenuGroup title="고객 지원" items={SUPPORT_MENU} />
        <MenuGroup title="계정" items={ACCOUNT_MENU} />

        {/* 로그아웃 & 회원탈퇴 */}
        <div className="space-y-2 mt-6">
          <LogoutButton />
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
