'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqData: FAQItem[];
  categories: string[];
}

export default function FAQAccordion({ faqData, categories }: FAQAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [openId, setOpenId] = useState<number | null>(null);

  const filteredFAQ = selectedCategory === '전체'
    ? faqData
    : faqData.filter((faq) => faq.category === selectedCategory);

  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FAQ 목록 */}
      <div className="space-y-2">
        {filteredFAQ.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 pr-4">
                <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1">
                  {faq.category}
                </span>
                <p className="font-medium text-gray-900">{faq.question}</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${
                  openId === faq.id ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openId === faq.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredFAQ.length === 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
          <p className="text-gray-500">해당 카테고리의 FAQ가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
