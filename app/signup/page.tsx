'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import AddressSearchModal from '@/components/signup/AddressSearchModal';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '';
  const loginUrl = redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')
    ? `/login?redirect=${encodeURIComponent(redirectTo)}`
    : '/login';
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
    address: '',
    addressDetail: '',
    agreePrivacy: false,
    agreeMarketing: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressModalOpen, setAddressModalOpen] = useState(false);

  // 다음 우편번호 API 스크립트 로드
  useEffect(() => {
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

  const handleAddressSelect = (address: string) => {
    setFormData((prev) => ({ ...prev, address }));
    setAddressModalOpen(false);
    setTimeout(() => document.getElementById('addressDetail')?.focus(), 100);
  };

  // 휴대폰 번호 하이픈 자동 포맷 (010-XXXX-XXXX 등)
  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.startsWith('02')) {
      // 서울: 02-XXX-XXXX 또는 02-XXXX-XXXX
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
    }
    if (digits.startsWith('01')) {
      // 휴대폰: 010-XXXX-XXXX, 011-XXX-XXXX 등
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
    if (digits.length >= 2 && digits[0] === '0') {
      // 지역번호: 031-XXX-XXXX 등
      if (digits.length <= 3) return digits;
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
    return digits.slice(0, 11);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.agreePrivacy) {
      setError('개인정보 처리방침에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      setError('전화번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!formData.address.trim()) {
      setError('주소를 검색해주세요.');
      setIsLoading(false);
      return;
    }

    if (!formData.addressDetail.trim()) {
      setError('상세 주소를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      // 회원가입
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data.user) {
        // 세션 확인 대기 (쿠키 저장 시간 보장)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 세션 확인
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error('Session not found after signup');
          setError('회원가입에 성공했지만 프로필 저장에 실패했습니다. 로그인 후 마이페이지에서 정보를 입력해주세요.');
          await new Promise((resolve) => setTimeout(resolve, 2000));
          router.push(loginUrl);
          return;
        }

        // 프로필 업데이트
        const fullAddress = formData.address
          ? `${formData.address}${formData.addressDetail ? ' ' + formData.addressDetail : ''}`
          : '';

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: formData.name.trim() || null,
            phone: formData.phone.trim() || null,
            default_address: fullAddress || null,
          })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Profile update error:', profileError);
          setError('프로필 정보 저장에 실패했습니다. 로그인 후 마이페이지에서 정보를 입력해주세요.');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } else {
          alert('회원가입이 완료되었습니다! 로그인해주세요.');
        }

        router.push(loginUrl);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">ymarketer에 오신 것을 환영합니다</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red text-red-deep px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                이메일 <span className="text-red">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-4 border border-gray-200 focus:border-black transition-colors text-black placeholder:text-gray-400"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="홍길동"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                전화번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhoneInput(e.target.value) })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="010-1234-5678"
                />
              </div>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주소 <span className="text-red-500">*</span>
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
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 cursor-pointer"
                      onClick={() => window.daum ? setAddressModalOpen(true) : alert('주소 검색 API를 로드하는 중입니다. 잠시 후 다시 시도해주세요.')}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => window.daum ? setAddressModalOpen(true) : alert('주소 검색 API를 로드하는 중입니다. 잠시 후 다시 시도해주세요.')}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    주소 검색
                  </button>
                </div>
                {formData.address && (
                  <input
                    type="text"
                    id="addressDetail"
                    required
                    value={formData.addressDetail}
                    onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                    placeholder="상세주소를 입력해주세요 (동, 호수 등) *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                )}
              </div>
            </div>

            <AddressSearchModal
              isOpen={addressModalOpen}
              onClose={() => setAddressModalOpen(false)}
              onSelect={handleAddressSelect}
            />

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="최소 6자 이상"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  id="passwordConfirm"
                  required
                  value={formData.passwordConfirm}
                  onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            {/* 개인정보 처리방침 / 마케팅 동의 */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">개인정보 처리방침</span>에 동의합니다. <span className="text-red-500">*</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.agreeMarketing}
                  onChange={(e) => setFormData({ ...formData, agreeMarketing: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">마케팅 수신</span>에 동의합니다. (선택)
                </span>
              </label>
            </div>

            {/* 회원가입 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 transition-colors mt-6"
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="text-black font-bold hover:text-gray-600 underline">
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* 메인으로 돌아가기 */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← 메인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
