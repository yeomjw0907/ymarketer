'use client';

import { useState } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import Image from 'next/image';

interface ReviewFormProps {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.type.startsWith('image/')).slice(0, 5 - images.length);

    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
      
      // 미리보기 생성
      validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 현재 사용자 확인
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('로그인이 필요합니다.');
        return;
      }

      // 이미지 업로드
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(fileName, image);

        if (uploadError) {
          console.error('Image upload error:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('review-images')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // 리뷰 저장
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          title,
          content,
          images: imageUrls.length > 0 ? imageUrls : null,
        });

      if (reviewError) {
        throw reviewError;
      }

      alert('리뷰가 등록되었습니다!');
      setRating(5);
      setTitle('');
      setContent('');
      setImages([]);
      setImagePreviews([]);
      onSuccess();
    } catch (error) {
      console.error('Review submission error:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-bold text-gray-900">리뷰 작성하기</h3>

      {/* 별점 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          별점 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600 self-center">
            {rating}점
          </span>
        </div>
      </div>

      {/* 제목 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          리뷰 제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
          placeholder="리뷰 제목을 입력하세요"
        />
      </div>

      {/* 내용 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          리뷰 내용 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          required
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
          placeholder="상품에 대한 솔직한 후기를 작성해주세요"
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사진 첨부 (최대 5장)
        </label>
        
        {/* 미리보기 */}
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 업로드 버튼 */}
        {images.length < 5 && (
          <label className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">사진 추가 ({images.length}/5)</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>등록 중...</span>
          </>
        ) : (
          '리뷰 등록'
        )}
      </button>
    </form>
  );
}
