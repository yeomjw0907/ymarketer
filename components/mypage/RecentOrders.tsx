import Link from 'next/link';
import { Package, Truck, CheckCircle } from 'lucide-react';

interface Order {
  id: string;
  product_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface RecentOrdersProps {
  orders: Order[];
}

const STATUS_CONFIG = {
  pending: { label: '입금 대기', color: 'text-gray-600', icon: Package },
  confirmed: { label: '주문 확인', color: 'text-blue-600', icon: CheckCircle },
  shipping: { label: '배송 중', color: 'text-orange-600', icon: Truck },
  delivered: { label: '배송 완료', color: 'text-green-600', icon: CheckCircle },
  cancelled: { label: '취소됨', color: 'text-red-600', icon: Package },
};

export default function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-6 mb-8">
        <h3 className="font-black text-black mb-4">최근 주문</h3>
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">주문 내역이 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-black">최근 주문</h3>
        <Link href="/mypage/orders" className="text-xs font-medium text-gray-600 hover:text-black">
          전체보기 →
        </Link>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 3).map((order) => {
          const status = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
          const Icon = status.icon;

          return (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 hover:border-black transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className={`w-5 h-5 ${status.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black text-sm truncate">{order.product_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className={`text-xs font-bold ${status.color} mb-1`}>{status.label}</p>
                <p className="text-sm font-bold text-black">{order.total_amount.toLocaleString()}원</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
