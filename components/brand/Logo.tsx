'use client';

import Link from 'next/link';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <div className={`font-black tracking-tighter ${sizeClasses[size]} select-none`}>
        <span className="text-black">YMARKETER</span>
      </div>
    </Link>
  );
}

// 심플 버전 (아이콘용)
export function LogoIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`font-black text-black tracking-tighter ${className}`}>
      Y
    </div>
  );
}
