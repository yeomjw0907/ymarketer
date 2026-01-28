'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-white rounded-xl border-2 border-gray-200 p-4 flex items-center gap-4 hover:border-red-300 hover:bg-red-50 transition-all text-left"
    >
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
        <LogOut className="w-5 h-5 text-gray-700" />
      </div>
      <div className="flex-1">
        <div className="font-medium text-gray-900">로그아웃</div>
        <div className="text-xs text-gray-500">계정에서 로그아웃</div>
      </div>
    </button>
  );
}
