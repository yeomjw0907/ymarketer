'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AddressSearchModal from '@/components/signup/AddressSearchModal';
import { useToast } from '@/components/common/Toast';

export default function SettingsPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    addressDetail: '',
  });

  useEffect(() => {
    loadProfile();
    
    // 다음 주소 검색 API 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login?redirect=/mypage/settings');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        const addressParts = profile.default_address?.split(' ') || [];
        const detail = addressParts.pop() || '';
        const mainAddress = addressParts.join(' ');

        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          address: mainAddress,
          addressDetail: detail,
        });
      }
    } catch (error) {
      console.error('Load profile error:', error);
      toast.error('프로필 불러오기 실패');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setAddressModalOpen(false);
    setTimeout(() => {
      const addressDetailInput = document.getElementById('addressDetail');
      if (addressDetailInput) {
        addressDetailInput.focus();
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('로그인 정보를 찾을 수 없습니다.');
        return;
      }

      const fullAddress = formData.address && formData.addressDetail
        ? `${formData.address} ${formData.addressDetail}`
        : formData.address || null;

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name.trim() || null,
          phone: formData.phone.trim() || null,
          default_address: fullAddress,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('프로필이 저장되었습니다');
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('저장 중 오류가 발생했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">설정</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                placeholder="홍길동"
              />
            </div>
          </div>

          {/* 전화번호 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          {/* 주소 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              배송지 주소
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    readOnly
                    value={formData.address}
                    placeholder="주소 검색"
                    onClick={() => {
                      if (typeof window !== 'undefined' && window.daum) {
                        setAddressModalOpen(true);
                      } else {
                        toast.warning('주소 검색 API를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
                      }
                    }}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-pointer"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(true)}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                >
                  주소 검색
                </button>
              </div>
              {formData.address && (
                <input
                  type="text"
                  id="addressDetail"
                  value={formData.addressDetail}
                  onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                  placeholder="상세주소를 입력해주세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </button>
        </form>

        <AddressSearchModal
          isOpen={addressModalOpen}
          onClose={() => setAddressModalOpen(false)}
          onSelect={handleAddressSelect}
        />
      </div>
    </div>
  );
}
