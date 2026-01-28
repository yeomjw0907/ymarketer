'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';
import { useSearchHistory } from '@/lib/hooks/useSearchHistory';
import { POPULAR_SEARCHES } from '@/lib/constants/navigation';

export default function MobileSearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { recentSearches, addSearch, clearHistory } = useSearchHistory();
  const searchRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;

    addSearch(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div ref={searchRef} className="lg:hidden border-t border-gray-100 bg-white px-4 py-2 relative">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="상품을 검색하세요"
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </form>

      {/* 검색 드롭다운 */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wide">
                    최근 검색어
                  </h4>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="block w-full text-left px-3 py-2 text-sm text-black hover:bg-gray-50 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 인기 검색어 */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="w-3 h-3 text-red-500" />
                <h4 className="text-xs font-bold text-black uppercase tracking-wide">
                  인기 검색어
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-xs font-medium text-black transition-colors rounded-full"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
