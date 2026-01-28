'use client';

import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  const handleReviewSuccess = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="mt-12 bg-white border border-gray-200 p-6 sm:p-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-black" />
          <h2 className="text-2xl font-black text-black tracking-tight">REVIEWS</h2>
        </div>
        
        {!showForm && (
          <button
            onClick={() => {
              if (!isLoggedIn) {
                alert('로그인 후 리뷰를 작성할 수 있습니다.');
                window.location.href = '/login';
                return;
              }
              setShowForm(true);
            }}
            className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 transition-colors text-sm"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {/* 리뷰 작성 폼 */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
          <button
            onClick={() => setShowForm(false)}
            className="mt-3 text-sm text-gray-600 hover:text-gray-900"
          >
            취소
          </button>
        </div>
      )}

      {/* 리뷰 목록 */}
      <ReviewList productId={productId} refreshTrigger={refreshTrigger} />
    </div>
  );
}
