'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

const TRENDING = [
  { rank: 1, keyword: '스노우피크 텐트', change: 'up' },
  { rank: 2, keyword: '타이틀리스트 골프공', change: 'up' },
  { rank: 3, keyword: '아크테릭스 재킷', change: 'new' },
  { rank: 4, keyword: '샤넬 립스틱', change: 'same' },
  { rank: 5, keyword: '소니 헤드폰', change: 'up' },
  { rank: 6, keyword: '무지 수납박스', change: 'down' },
  { rank: 7, keyword: '나이키 운동화', change: 'up' },
  { rank: 8, keyword: '디올 향수', change: 'new' },
];

export default function TrendingSearches() {
  return (
    <div className="bg-white border-2 border-gray-300 p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-black">
        <TrendingUp className="w-6 h-6 text-black" />
        <h3 className="text-lg font-black text-black uppercase tracking-tight">
          Trending
        </h3>
      </div>

      {/* 검색어 리스트 */}
      <div className="space-y-3">
        {TRENDING.map((item) => (
          <Link
            key={item.rank}
            href={`/search?q=${encodeURIComponent(item.keyword)}`}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 transition-colors group"
          >
            {/* 순위 */}
            <div className="w-6 h-6 bg-black text-white flex items-center justify-center text-xs font-black">
              {item.rank}
            </div>

            {/* 키워드 */}
            <div className="flex-1 min-w-0">
              <span className="text-sm font-bold text-black group-hover:text-gray-600 transition-colors truncate block">
                {item.keyword}
              </span>
            </div>

            {/* 변동 표시 */}
            <div className="shrink-0">
              {item.change === 'up' && (
                <span className="text-red text-xs font-bold">▲</span>
              )}
              {item.change === 'down' && (
                <span className="text-blue-600 text-xs font-bold">▼</span>
              )}
              {item.change === 'new' && (
                <span className="bg-red text-white text-[10px] font-bold px-1.5 py-0.5">
                  NEW
                </span>
              )}
              {item.change === 'same' && (
                <span className="text-gray-400 text-xs font-bold">-</span>
              )}
            </div>

            {/* 화살표 */}
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
          </Link>
        ))}
      </div>

      {/* 더보기 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link
          href="/search"
          className="block text-center text-xs font-bold text-gray-600 hover:text-black transition-colors uppercase tracking-wide"
        >
          View All →
        </Link>
      </div>
    </div>
  );
}
