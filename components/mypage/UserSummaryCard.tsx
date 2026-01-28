import { User, Heart, ShoppingCart, Award } from 'lucide-react';

interface UserSummaryCardProps {
  name: string;
  email: string;
  orderCount: number;
  favoriteCount: number;
  points?: number;
}

export default function UserSummaryCard({
  name,
  email,
  orderCount,
  favoriteCount,
  points = 0,
}: UserSummaryCardProps) {
  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-black flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-black">{name || '사용자'}</h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>
      </div>

      {/* 퀵 스탯 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 border border-gray-200">
          <ShoppingCart className="w-5 h-5 text-black mx-auto mb-2" />
          <div className="text-2xl font-black text-black mb-1">{orderCount}</div>
          <div className="text-xs text-gray-600">주문</div>
        </div>
        <div className="text-center p-4 bg-gray-50 border border-gray-200">
          <Heart className="w-5 h-5 text-red mx-auto mb-2" />
          <div className="text-2xl font-black text-red mb-1">{favoriteCount}</div>
          <div className="text-xs text-gray-600">찜</div>
        </div>
        <div className="text-center p-4 bg-gray-50 border border-gray-200">
          <Award className="w-5 h-5 text-black mx-auto mb-2" />
          <div className="text-2xl font-black text-black mb-1">{points.toLocaleString()}</div>
          <div className="text-xs text-gray-600">포인트</div>
        </div>
      </div>
    </div>
  );
}
