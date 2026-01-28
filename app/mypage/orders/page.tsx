import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { formatKRW } from '@/lib/utils/calculator';

export default async function OrdersPage() {
  const supabase = await createSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login?redirect=/mypage/orders');
  }

  // 사용자 프로필
  const { data: profile } = await supabase
    .from('profiles')
    .select('phone')
    .eq('id', user.id)
    .single();

  // 주문 내역
  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      products (
        name,
        image_url,
        brand
      )
    `)
    .eq('customer_phone', profile?.phone || '')
    .order('created_at', { ascending: false });

  const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
    pending: { label: '결제 대기', icon: Clock, color: 'text-gray-600' },
    paid: { label: '결제 완료', icon: CheckCircle, color: 'text-blue-600' },
    shipped: { label: '배송 중', icon: Truck, color: 'text-green-600' },
    delivered: { label: '배송 완료', icon: Package, color: 'text-gray-900' },
    cancelled: { label: '취소', icon: Package, color: 'text-red-600' },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">주문 내역</h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">주문 내역이 없습니다</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const Icon = config.icon;
              const product = order.products;

              return (
                <div key={order.id} className="bg-white rounded-xl border-2 border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ko-KR')}
                    </span>
                    <div className={`flex items-center gap-1 ${config.color}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      {product?.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product?.name || '상품명 없음'}</p>
                      <p className="text-xs text-gray-500">{product?.brand || ''}</p>
                      <p className="text-sm text-gray-600 mt-1">수량: {order.quantity}개</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-sm text-gray-600">결제 금액</span>
                    <span className="text-lg font-bold text-gray-900">{formatKRW(order.final_price)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
