'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  ImagePlus,
  Pencil,
  Trash2,
  Upload,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import type { HeroBannerItem } from '@/lib/types/database.types';

const DEFAULT_BG = 'from-blue-500 to-blue-700';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    bg_color: DEFAULT_BG,
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 클라이언트에서 Admin 클라이언트 사용 (서버 액션 대신)
  const getSupabase = () =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: true } }
    );

  const fetchBanners = async () => {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/admin';
      return;
    }
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error) setBanners((data as HeroBannerItem[]) || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      bg_color: DEFAULT_BG,
      is_active: true,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const openEdit = (b: HeroBannerItem) => {
    setEditingId(b.id);
    setFormData({
      title: b.title || '',
      subtitle: b.subtitle || '',
      image_url: b.image_url,
      link_url: b.link_url || '',
      bg_color: b.bg_color || DEFAULT_BG,
      is_active: b.is_active,
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) setImageFile(file);
  };

  const saveBanner = async () => {
    setIsSaving(true);
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('로그인이 필요합니다.');
      setIsSaving(false);
      return;
    }

    let imageUrl = formData.image_url;

    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const fileName = `hero-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('hero-banners')
        .upload(fileName, imageFile, { upsert: true });

      if (uploadError) {
        alert('이미지 업로드 실패: ' + uploadError.message);
        setIsSaving(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('hero-banners')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    if (!imageUrl && !editingId) {
      alert('이미지를 선택하거나 URL을 입력하세요.');
      setIsSaving(false);
      return;
    }

    const payload = {
      title: formData.title || null,
      subtitle: formData.subtitle || null,
      image_url: imageUrl,
      link_url: formData.link_url || null,
      bg_color: formData.bg_color || DEFAULT_BG,
      is_active: formData.is_active,
    };

    if (editingId) {
      const { error } = await supabase
        .from('hero_banners')
        .update(payload)
        .eq('id', editingId);
      if (error) alert('수정 실패: ' + error.message);
      else setShowModal(false);
    } else {
      const maxOrder = banners.length ? Math.max(...banners.map((b) => b.sort_order), 0) : 0;
      const { error } = await supabase.from('hero_banners').insert({
        ...payload,
        sort_order: maxOrder + 1,
      });
      if (error) alert('등록 실패: ' + error.message);
      else setShowModal(false);
    }

    fetchBanners();
    setIsSaving(false);
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('이 배너를 삭제할까요?')) return;
    const supabase = getSupabase();
    const { error } = await supabase.from('hero_banners').delete().eq('id', id);
    if (error) alert('삭제 실패: ' + error.message);
    else fetchBanners();
  };

  const moveOrder = async (index: number, direction: 'up' | 'down') => {
    const newOrder = [...banners];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newOrder.length) return;

    [newOrder[index].sort_order, newOrder[target].sort_order] = [
      newOrder[target].sort_order,
      newOrder[index].sort_order,
    ];
    setBanners(newOrder);

    const supabase = getSupabase();
    await supabase
      .from('hero_banners')
      .update({ sort_order: newOrder[index].sort_order })
      .eq('id', newOrder[index].id);
    await supabase
      .from('hero_banners')
      .update({ sort_order: newOrder[target].sort_order })
      .eq('id', newOrder[target].id);
    fetchBanners();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">히어로 배너 관리</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <ImagePlus className="w-5 h-5" />
                배너 추가
              </button>
              <Link
                href="/admin/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                대시보드
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">로딩 중...</div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <ImagePlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">등록된 배너가 없습니다.</p>
            <button
              onClick={openAdd}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
            >
              첫 배너 추가
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className="bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveOrder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => moveOrder(index, 'down')}
                    disabled={index === banners.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative w-32 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={banner.image_url}
                    alt={banner.title || '배너'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {banner.title || '(제목 없음)'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {banner.subtitle || '(부제목 없음)'}
                  </div>
                  {!banner.is_active && (
                    <span className="inline-block mt-1 text-xs text-amber-600 font-medium">
                      비노출
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(banner)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="수정"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteBanner(banner.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 모달: 추가/수정 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? '배너 수정' : '배너 추가'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지 <span className="text-red-500">*</span>
                </label>
                {imageFile ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={URL.createObjectURL(imageFile)}
                      alt="미리보기"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFile(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">이미지 선택</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  또는 이미지 URL 입력 (수정 시 기존 유지)
                </p>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="일본 가서 사면 비행기 값 뽑습니다"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="관부가세, 배송비 포함해도 최대 30% 저렴"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL</label>
                <input
                  type="url"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배경 그라데이션 (Tailwind 클래스)
                </label>
                <select
                  value={formData.bg_color}
                  onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  <option value="from-blue-500 to-blue-700">파랑</option>
                  <option value="from-green-500 to-green-700">초록</option>
                  <option value="from-purple-500 to-purple-700">보라</option>
                  <option value="from-amber-500 to-amber-700">주황</option>
                  <option value="from-red-500 to-red-700">빨강</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  노출
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={saveBanner}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
