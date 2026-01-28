import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import KPICards from '@/components/admin/KPICards';
import RecentActivity from '@/components/admin/RecentActivity';
import QuickLinks from '@/components/admin/QuickLinks';

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();
  
  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/admin');
  }

  // 대시보드 통계 가져오기
  const [productsResult, ordersResult, profilesResult, recentOrdersResult] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('orders').select('id, status, total_amount, created_at', { count: 'exact' }),
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase
      .from('orders')
      .select('id, product_name, total_amount, status, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const totalProducts = productsResult.count || 0;
  const totalOrders = ordersResult.count || 0;
  const totalMembers = profilesResult.count || 0;
  const pendingOrders = ordersResult.data?.filter((o) => o.status === 'pending').length || 0;

  // 오늘 주문
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders =
    ordersResult.data?.filter((o) => new Date(o.created_at) >= today).length || 0;

  // 이번 달 매출
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);
  const monthSales =
    ordersResult.data
      ?.filter((o) => new Date(o.created_at) >= thisMonth)
      .reduce((sum, o) => sum + o.total_amount, 0) || 0;

  const recentOrders = recentOrdersResult.data || [];

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="bg-black text-white border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8" />
              <h1 className="text-2xl font-black tracking-tight">ADMIN DASHBOARD</h1>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-300 hover:text-white transition-colors font-medium"
            >
              메인으로 →
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* KPI 카드 */}
        <KPICards
          todayOrders={todayOrders}
          monthSales={monthSales}
          totalProducts={totalProducts}
          totalMembers={totalMembers}
        />

        {/* 최근 활동 */}
        <RecentActivity
          recentOrders={recentOrders}
          pendingOrders={pendingOrders}
        />

        {/* 빠른 링크 */}
        <QuickLinks />
      </div>
    </div>
  );
}
