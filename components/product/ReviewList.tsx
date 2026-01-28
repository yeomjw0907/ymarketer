'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ThumbsUp, User as UserIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import type { ReviewWithProfile } from '@/lib/types/auth.types';

interface ReviewListProps {
  productId: string;
  refreshTrigger?: number;
}

export default function ReviewList({ productId, refreshTrigger }: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (*)
      `)
      .eq('product_id', productId)
      .eq('is_visible', true)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReviews(data as any);
      
      // 평균 별점 계산
      if (data.length > 0) {
        const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    }
    
    setIsLoading(false);
  };

  const handleHelpful = async (reviewId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 도움됨 추가/제거
    const { error } = await supabase
      .from('review_helpful')
      .insert({ review_id: reviewId, user_id: user.id });

    if (error) {
      // 이미 표시한 경우 제거
      await supabase
        .from('review_helpful')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id', user.id);
    }

    fetchReviews();
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">리뷰를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 리뷰 통계 */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">{averageRating || '0.0'}</div>
            <div className="flex gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="border-l border-gray-300 pl-4">
            <p className="text-sm text-gray-600">
              총 <span className="font-bold text-gray-900">{reviews.length}</span>개의 리뷰
            </p>
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-1">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
              {/* 리뷰 헤더 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    {review.profiles?.avatar_url ? (
                      <Image
                        src={review.profiles.avatar_url}
                        alt={review.profiles.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {review.profiles?.name || '익명'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span>·</span>
                      <span>{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 리뷰 제목 */}
              <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>

              {/* 리뷰 내용 */}
              <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>

              {/* 리뷰 이미지 */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {review.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 도움됨 버튼 */}
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>도움됨 {review.helpful_count}</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
