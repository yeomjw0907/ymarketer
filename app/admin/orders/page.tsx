'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { OrderWithProduct } from '@/lib/types/database.types';
import { formatKRW } from '@/lib/utils/calculator';

const STATUS_LABELS = {
  pending: { label: '접수대기', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
  paid: { label: '입금완료', color: 'bg-blue-100 text-blue-700 border-blue-300' },
  shipped: { label: '배송중', color: 'bg-purple-100 text-purple-700 border-purple-300' },
  completed: { label: '완료', color: 'bg-green-100 text-green-700 border-green-300' },
  cancelled: { label: '취소', color: 'bg-gray-100 text-gray-700 border-gray-300' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithProduct | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        product:products(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as any);
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      alert('주문 상태가 변경되었습니다.');
      fetchOrders();
    } else {
      alert('상태 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">주문 관리</h1>
          </div>
        </div>
      </header>

      {/* 주문 목록 */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">주문 목록을 불러오는 중...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">접수된 주문이 없습니다.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문일
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상품명
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문자
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      연락처
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {order.product?.name || '상품 정보 없음'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {order.customer_phone}
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-900 text-right">
                        {formatKRW(order.final_price)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-medium px-3 py-1 rounded-full border ${
                            STATUS_LABELS[order.status].color
                          } cursor-pointer`}
                        >
                          <option value="pending">접수대기</option>
                          <option value="paid">입금완료</option>
                          <option value="shipped">배송중</option>
                          <option value="completed">완료</option>
                          <option value="cancelled">취소</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          <Eye className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 상세 정보 모달 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">주문 상세 정보</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 주문 정보 */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">주문 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문번호</span>
                    <span className="font-mono text-gray-900">{selectedOrder.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">주문일</span>
                    <span className="text-gray-900">
                      {new Date(selectedOrder.created_at).toLocaleString('ko-KR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">상태</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      STATUS_LABELS[selectedOrder.status].color
                    }`}>
                      {STATUS_LABELS[selectedOrder.status].label}
                    </span>
                  </div>
                </div>
              </div>

              {/* 상품 정보 */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">상품 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상품명</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.product?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">브랜드</span>
                    <span className="text-gray-900">{selectedOrder.product?.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">최종 금액</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatKRW(selectedOrder.final_price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 고객 정보 */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">고객 정보</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름</span>
                    <span className="text-gray-900">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">연락처</span>
                    <span className="text-gray-900">{selectedOrder.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block mb-1">배송지 주소</span>
                    <span className="text-gray-900 block bg-white p-2 rounded border border-gray-200">
                      {selectedOrder.address}
                    </span>
                  </div>
                  {selectedOrder.customer_memo && (
                    <div>
                      <span className="text-gray-600 block mb-1">요청사항</span>
                      <span className="text-gray-900 block bg-white p-2 rounded border border-gray-200">
                        {selectedOrder.customer_memo}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
