import { ShoppingCart, MessageSquare, AlertCircle, Package } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';

interface Order {
  id: string;
  product_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface RecentActivityProps {
  recentOrders: Order[];
  pendingOrders: number;
}

export default function RecentActivity({
  recentOrders,
  pendingOrders,
}: RecentActivityProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* 최근 주문 */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="w-5 h-5 text-black" />
          <h3 className="font-black text-black">최근 주문</h3>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">주문이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 hover:border-black transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-black text-sm truncate">
                    {order.product_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleString('ko-KR')}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold text-black">
                    {formatKRW(order.total_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 미처리 알림 */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-black" />
          <h3 className="font-black text-black">미처리 알림</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-bold text-black text-sm">입금 대기</div>
                <div className="text-xs text-gray-600">확인 필요</div>
              </div>
            </div>
            <div className="text-xl font-black text-orange-600">{pendingOrders}</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-bold text-black text-sm">신규 리뷰</div>
                <div className="text-xs text-gray-600">답변 대기</div>
              </div>
            </div>
            <div className="text-xl font-black text-gray-600">0</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-gray-600" />
              <div>
                <div className="font-bold text-black text-sm">재고 부족</div>
                <div className="text-xs text-gray-600">확인 필요</div>
              </div>
            </div>
            <div className="text-xl font-black text-gray-600">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
