'use client';

import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: {
    category: string;
    sortBy: string;
    priceRange: string;
  }) => void;
}

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'camping', label: '캠핑' },
  { id: 'golf', label: '골프' },
  { id: 'fashion', label: '패션' },
  { id: 'beauty', label: '뷰티' },
  { id: 'electronics', label: '전자기기' },
];

const SORT_OPTIONS = [
  { id: 'recent', label: '최신순' },
  { id: 'price-low', label: '가격 낮은순' },
  { id: 'price-high', label: '가격 높은순' },
  { id: 'savings', label: '절약 많은순' },
];

const PRICE_RANGES = [
  { id: 'all', label: '전체 가격' },
  { id: '0-50000', label: '5만원 이하' },
  { id: '50000-100000', label: '5만원 - 10만원' },
  { id: '100000-200000', label: '10만원 - 20만원' },
  { id: '200000-', label: '20만원 이상' },
];

export default function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [priceRange, setPriceRange] = useState('all');

  const handleApply = () => {
    onFilterChange({ category, sortBy, priceRange });
    setIsOpen(false);
  };

  const handleReset = () => {
    setCategory('all');
    setSortBy('recent');
    setPriceRange('all');
    onFilterChange({ category: 'all', sortBy: 'recent', priceRange: 'all' });
  };

  return (
    <>
      {/* 필터 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 hover:border-black text-black font-semibold px-4 py-2 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm">필터</span>
      </button>

      {/* 필터 패널 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-2xl md:border md:border-gray-300 md:shadow-xl animate-slide-in-top max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-black text-black">필터</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 필터 옵션 */}
            <div className="p-6 space-y-6">
              {/* 카테고리 */}
              <div>
                <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">
                  카테고리
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 text-sm font-medium transition-colors ${
                        category === cat.id
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 */}
              <div>
                <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">
                  정렬
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {SORT_OPTIONS.map((sort) => (
                    <button
                      key={sort.id}
                      onClick={() => setSortBy(sort.id)}
                      className={`py-2 text-sm font-medium transition-colors ${
                        sortBy === sort.id
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 가격대 */}
              <div>
                <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">
                  가격대
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setPriceRange(range.id)}
                      className={`py-2 text-sm font-medium transition-colors ${
                        priceRange === range.id
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-black hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 푸터 */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleReset}
                className="flex-1 bg-white border border-gray-300 hover:border-black text-black font-semibold py-3 transition-colors"
              >
                초기화
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 transition-colors"
              >
                적용
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
