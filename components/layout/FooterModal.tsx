'use client';

import { X } from 'lucide-react';

interface FooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export default function FooterModal({
  isOpen,
  onClose,
  title,
  content,
}: FooterModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-white border border-gray-300 shadow-xl animate-scale-in max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 shrink-0">
          <h3 className="text-xl font-black text-black">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-black transition-colors"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="px-6 py-8 overflow-y-auto flex-1">
          <div className="prose prose-sm max-w-none">
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {content}
            </p>
          </div>
        </div>

        {/* 푸터 */}
        <div className="border-t border-gray-200 px-6 py-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
