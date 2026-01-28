'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

type AuthMode = 'select' | 'login';

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('select');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      if (data.user) {
        window.location.href = '/home';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 선택 화면
  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-black mb-4 tracking-tight">
              YMARKETER
            </h1>
            <p className="text-gray-600 text-sm">
              일본 직구, 더 똑똑하게
            </p>
          </div>

          <div className="space-y-3">
            {/* 로그인 버튼 */}
            <button
              onClick={() => setMode('login')}
              className="w-full bg-black text-white font-bold py-4 px-6 hover:bg-gray-800 transition-colors text-lg"
            >
              로그인
            </button>

            {/* 회원가입 버튼 */}
            <Link
              href="/signup"
              className="block w-full border-2 border-black text-black font-bold py-4 px-6 hover:bg-black hover:text-white transition-colors text-center text-lg"
            >
              회원가입
            </Link>

            {/* 구분선 */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 소셜 로그인 버튼들 */}
            <SocialLoginButtons />

            {/* 로그인 없이 둘러보기 */}
            <div className="pt-6">
              <Link
                href="/home"
                className="block w-full text-center text-gray-600 hover:text-gray-900 font-medium py-3 underline transition-colors"
              >
                로그인 없이 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 화면
  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <button
              onClick={() => setMode('select')}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
            >
              ← 뒤로가기
            </button>
            <h1 className="text-4xl font-black text-black mb-3 tracking-tight">LOGIN</h1>
            <p className="text-sm text-gray-500">YMARKETER 계정으로 로그인</p>
          </div>

          <div className="bg-white border border-gray-200 p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                  이메일
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

              {/* 비밀번호 */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-black mb-2 uppercase tracking-wide">
                  비밀번호
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-4 border border-gray-200 focus:border-black transition-colors text-black placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 transition-colors"
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            {/* 회원가입 링크 */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm">
              <p className="text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link href="/signup" className="text-black font-bold hover:text-gray-600 underline">
                  회원가입
                </Link>
              </p>
            </div>
          </div>

          {/* 로그인 없이 둘러보기 */}
          <div className="text-center mt-6">
            <Link href="/home" className="text-sm text-gray-600 hover:text-gray-900 transition-colors underline">
              로그인 없이 둘러보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
