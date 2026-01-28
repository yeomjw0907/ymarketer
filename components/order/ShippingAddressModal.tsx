'use client';

import { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AddressSearchModal from '@/components/signup/AddressSearchModal';

declare global {
  interface Window {
    daum: any;
  }
}

interface ShippingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: { name: string; phone: string; address: string };
  onSave: (data: { name: string; phone: string; address: string }) => void;
  userId: string;
}

export default function ShippingAddressModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  userId,
}: ShippingAddressModalProps) {
  const [formData, setFormData] = useState(initialData);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) setFormData(initialData);
  }, [isOpen, initialData]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handleAddressSelect = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setAddressModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 세션 확인
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
        window.location.href = '/login';
        return;
      }

      const fullAddress = formData.address.trim();
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim() || null,
          phone: formData.phone.trim() || null,
          default_address: fullAddress || null,
        })
        .eq('id', userId);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      onSave(formData);
      onClose();
    } catch (err: any) {
      console.error('ShippingAddressModal error:', err);
      alert(err.message || '저장 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h3 className="text-lg font-semibold text-gray-900">배송지 변경</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="홍길동"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="010-1234-5678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">배송지 주소</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={formData.address}
                    placeholder="주소 검색"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-pointer"
                    onClick={() => window.daum && setAddressModalOpen(true)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => window.daum && setAddressModalOpen(true)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium rounded-lg whitespace-nowrap"
                >
                  주소 검색
                </button>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <AddressSearchModal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onSelect={handleAddressSelect}
      />
    </>
  );
}
