'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp } from 'lucide-react';

const POPULAR_SEARCHES = [
  '스노우피크',
  '테일러메이드',
  '캠핑 텐트',
  '골프채',
  '아웃도어',
];

export default function DesktopSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 최근 검색어 불러오기
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

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

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // 최근 검색어 저장
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // 검색 페이지로 이동
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setQuery('');
    setIsFocused(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-md">
      {/* 검색 입력 */}
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="상품명, 브랜드 검색"
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 focus:border-black transition-colors text-sm text-black placeholder:text-gray-400"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* 검색 드롭다운 */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-50 animate-slide-in-top">
          <div className="p-4">
            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-black uppercase tracking-wide">
                    최근 검색어
                  </h4>
                  <button
                    onClick={handleClearRecent}
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
                <TrendingUp className="w-3 h-3 text-red" />
                <h4 className="text-xs font-bold text-black uppercase tracking-wide">
                  인기 검색어
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-black hover:text-white text-xs font-medium text-black transition-colors"
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
