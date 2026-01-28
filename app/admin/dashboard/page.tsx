import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
} from 'lucide-react';
import { supabaseServer } from '@/lib/supabase/server';
import { getGlobalSettings, getYenRate } from '@/lib/utils/settings';
import { formatKRW } from '@/lib/utils/calculator';

export default async function AdminDashboardPage() {
  // 인증 확인
  const { data: { user } } = await supabaseServer.auth.getUser();
  
  if (!user) {
    redirect('/admin');
  }

  // 대시보드 통계 가져오기
  const [productsResult, ordersResult] = await Promise.all([
    supabaseServer.from('products').select('id', { count: 'exact' }),
    supabaseServer.from('orders').select('id, status, final_price', { count: 'exact' }),
  ]);

  const totalProducts = productsResult.count || 0;
  const totalOrders = ordersResult.count || 0;
  const pendingOrders = ordersResult.data?.filter((o) => o.status === 'pending').length || 0;
  const totalRevenue = ordersResult.data?.reduce((sum, o) => sum + o.final_price, 0) || 0;

  const yenRate = await getYenRate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              메인으로
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 총 상품 수 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Package className="w-10 h-10 text-blue-600" />
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                상품
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalProducts}</div>
            <div className="text-sm text-gray-500">총 등록 상품</div>
          </div>

          {/* 총 주문 수 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <ShoppingCart className="w-10 h-10 text-green-600" />
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                주문
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalOrders}</div>
            <div className="text-sm text-gray-500">총 주문 건수</div>
          </div>

          {/* 대기 중인 주문 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                대기
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{pendingOrders}</div>
            <div className="text-sm text-gray-500">처리 대기 중</div>
          </div>

          {/* 총 매출 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-10 h-10 text-purple-600" />
              <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                매출
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatKRW(totalRevenue)}
            </div>
            <div className="text-sm text-gray-500">누적 주문 금액</div>
          </div>
        </div>

        {/* 현재 환율 설정 */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium opacity-90 mb-1">🇯🇵 현재 엔화 환율</div>
              <div className="text-3xl font-bold">{formatKRW(yenRate * 100)} / 100엔</div>
            </div>
            <Link
              href="/admin/settings"
              className="bg-white/20 hover:bg-white/30 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              환율 수정
            </Link>
          </div>
        </div>

        {/* 빠른 메뉴 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 상품 관리 */}
          <Link
            href="/admin/products"
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">상품 관리</h3>
            </div>
            <p className="text-sm text-gray-600">
              상품 등록, 수정, 삭제 및 이미지 업로드
            </p>
          </Link>

          {/* 주문 관리 */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-green-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">주문 관리</h3>
            </div>
            <p className="text-sm text-gray-600">
              주문 내역 확인 및 상태 변경
            </p>
          </Link>

          {/* 설정 */}
          <Link
            href="/admin/settings"
            className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-purple-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">전역 설정</h3>
            </div>
            <p className="text-sm text-gray-600">
              환율, 배송비, 수수료율 등 설정
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
