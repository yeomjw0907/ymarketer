import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

interface QuickStatsProps {
  totalOrders?: number;
  avgSavings?: number;
  deliveryDays?: string;
}

export default function QuickStats({
  totalOrders = 1234,
  avgSavings = 35,
  deliveryDays = '7-14일',
}: QuickStatsProps) {
  return (
    <section className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Stat 1 */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-red" />
              <div className="text-sm font-bold uppercase tracking-wide text-gray-400">
                평균 절감율
              </div>
            </div>
            <div className="text-5xl font-black mb-1">
              {avgSavings}
              <span className="text-red">%</span>
            </div>
            <div className="text-sm text-gray-400">한국 가격 대비</div>
          </div>

          {/* Stat 2 */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="text-sm font-bold uppercase tracking-wide text-gray-400">
                이번 달 주문
              </div>
            </div>
            <div className="text-5xl font-black mb-1">
              {totalOrders.toLocaleString()}
              <span className="text-red">건</span>
            </div>
            <div className="text-sm text-gray-400">실시간 업데이트</div>
          </div>

          {/* Stat 3 */}
          <div className="text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
              <div className="text-sm font-bold uppercase tracking-wide text-gray-400">
                평균 배송 기간
              </div>
            </div>
            <div className="text-5xl font-black mb-1">
              <span className="text-white">{deliveryDays}</span>
            </div>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>배송 조회</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
