'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

declare global {
  interface Window {
    daum: any;
  }
}

interface AddressSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
}

export default function AddressSearchModal({
  isOpen,
  onClose,
  onSelect,
}: AddressSearchModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current || !window.daum) return;

    const el = containerRef.current;
    el.innerHTML = '';

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          if (data.buildingName !== '') {
            extraAddress +=
              extraAddress !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        onSelect(fullAddress);
        onClose();
      },
    }).embed(el);
  }, [isOpen]); // onSelect, onClose are stable from parent

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">주소 검색</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div
          ref={containerRef}
          className="min-h-[400px] w-full"
          style={{ minHeight: '400px' }}
        />
      </div>
    </div>
  );
}
