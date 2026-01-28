'use client';

import { useState } from 'react';
import { UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useToast } from '@/components/common/Toast';

export default function DeleteAccountButton() {
  const router = useRouter();
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('로그인 정보를 찾을 수 없습니다.');
        return;
      }

      // 서버 API로 회원 탈퇴 요청
      const response = await fetch('/api/user/delete', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('회원 탈퇴 실패');
      }

      toast.success('회원 탈퇴가 완료되었습니다.');
      
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('회원 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="w-full bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center gap-4 hover:border-red-400 hover:shadow-md transition-all disabled:opacity-50"
      >
        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
          <UserX className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1 text-left">
          <div className="font-medium text-gray-900">회원 탈퇴</div>
          <div className="text-xs text-gray-500">계정을 삭제합니다</div>
        </div>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="회원 탈퇴"
        message="정말 탈퇴하시겠습니까?&#10;&#10;탈퇴 시 모든 정보가 삭제되며&#10;복구할 수 없습니다."
        confirmText="탈퇴하기"
        cancelText="취소"
        type="danger"
      />
    </>
  );
}
