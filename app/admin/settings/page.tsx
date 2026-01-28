'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { GlobalSettings } from '@/lib/types/database.types';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings>({
    yen_rate: 9.1,
    shipping_base: 15000,
    shipping_per_half_kg: 5000,
    tax_threshold: 200000,
    tax_rate: 0.18,
    fee_rate: 0.10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('global_settings')
      .select('key, value');

    if (!error && data) {
      const settingsObj: any = {};
      data.forEach((item) => {
        settingsObj[item.key] = item.value;
      });
      setSettings(settingsObj);
    }
    setIsLoading(false);
  };

  const handleSave = async (key: string, value: number) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('global_settings')
      .update({ value })
      .eq('key', key);

    if (!error) {
      alert('설정이 저장되었습니다.');
    } else {
      alert('저장 중 오류가 발생했습니다.');
    }
    setIsSaving(false);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase
        .from('global_settings')
        .update({ value })
        .eq('key', key)
    );

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    if (!hasError) {
      alert('모든 설정이 저장되었습니다.');
    } else {
      alert('일부 설정 저장 중 오류가 발생했습니다.');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">전역 설정</h1>
            </div>
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>{isSaving ? '저장 중...' : '모두 저장'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 설정 폼 */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* 환율 설정 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🇯🇵 환율 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  엔화 환율 (1엔 = N원)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.01"
                    value={settings.yen_rate}
                    onChange={(e) =>
                      setSettings({ ...settings, yen_rate: Number(e.target.value) })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold text-gray-900"
                  />
                  <button
                    onClick={() => handleSave('yen_rate', settings.yen_rate)}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                  >
                    저장
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 현재 설정: 100엔 = {(settings.yen_rate * 100).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          {/* 배송비 설정 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📦 배송비 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 배송비 (1kg 이하)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={settings.shipping_base}
                    onChange={(e) =>
                      setSettings({ ...settings, shipping_base: Number(e.target.value) })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <span className="flex items-center text-gray-600">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  추가 배송비 (0.5kg당)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={settings.shipping_per_half_kg}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shipping_per_half_kg: Number(e.target.value),
                      })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <span className="flex items-center text-gray-600">원</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 예시: 2.5kg 상품 = 기본 {settings.shipping_base.toLocaleString()}원 + 추가{' '}
                  {(Math.ceil((2.5 - 1) * 2) * settings.shipping_per_half_kg).toLocaleString()}원
                  = 총 {(settings.shipping_base + Math.ceil((2.5 - 1) * 2) * settings.shipping_per_half_kg).toLocaleString()}원
                </p>
              </div>
            </div>
          </div>

          {/* 관세 설정 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">💰 관부가세 설정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  과세 기준 금액 (원화 환산 기준)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={settings.tax_threshold}
                    onChange={(e) =>
                      setSettings({ ...settings, tax_threshold: Number(e.target.value) })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <span className="flex items-center text-gray-600">원</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 이 금액 이하는 면세 (일반적으로 $150 약 200,000원)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  간이세율 (과세 기준 초과 시)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.01"
                    value={settings.tax_rate}
                    onChange={(e) =>
                      setSettings({ ...settings, tax_rate: Number(e.target.value) })
                    }
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                  <span className="flex items-center text-gray-600">
                    ({(settings.tax_rate * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * 일반적으로 18% 적용 (0.18)
                </p>
              </div>
            </div>
          </div>

          {/* 수수료 설정 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🏢 구매대행 수수료</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                수수료율 (상품가 기준)
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  step="0.01"
                  value={settings.fee_rate}
                  onChange={(e) =>
                    setSettings({ ...settings, fee_rate: Number(e.target.value) })
                  }
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <span className="flex items-center text-gray-600">
                  ({(settings.fee_rate * 100).toFixed(0)}%)
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * 예시: 상품가 380,000원 × {(settings.fee_rate * 100).toFixed(0)}% ={' '}
                {(380000 * settings.fee_rate).toLocaleString()}원
              </p>
            </div>
          </div>

          {/* 안내 문구 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
            <p className="font-medium mb-2">💡 설정 변경 안내</p>
            <ul className="space-y-1 list-disc list-inside text-blue-800">
              <li>환율은 실시간으로 메인 페이지에 반영됩니다.</li>
              <li>배송비와 세율은 모든 가격 계산에 즉시 적용됩니다.</li>
              <li>설정을 변경하면 기존 주문의 가격은 변경되지 않습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
