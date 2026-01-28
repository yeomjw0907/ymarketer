import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatKRW } from '@/lib/utils/calculator';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  prefix?: string;
  suffix?: string;
}

function KPICard({ label, value, change, prefix = '', suffix = '' }: KPICardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {label}
        </div>
        {change !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-bold ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
            {change > 0 && '+'}
            {change}%
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-black">
        {prefix}
        {value}
        {suffix}
      </div>
    </div>
  );
}

interface KPICardsProps {
  todayOrders: number;
  monthSales: number;
  totalProducts: number;
  totalMembers: number;
}

export default function KPICards({
  todayOrders,
  monthSales,
  totalProducts,
  totalMembers,
}: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KPICard
        label="오늘 주문"
        value={todayOrders}
        suffix="건"
        change={12}
      />
      <KPICard
        label="이번 달 매출"
        value={formatKRW(monthSales)}
        change={8}
      />
      <KPICard
        label="총 상품"
        value={totalProducts}
        suffix="개"
      />
      <KPICard
        label="회원 수"
        value={totalMembers}
        suffix="명"
        change={45}
      />
    </div>
  );
}
