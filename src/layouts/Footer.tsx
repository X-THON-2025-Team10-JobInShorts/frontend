'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { FOOTER_ITEMS, DONT_SHOW_FOOTER_PATHS } from '@/constants/footer';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage';

export default function Footer() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);

  // 사용자 역할 가져오기
  useEffect(() => {
    const role = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_ROLE);
    // eslint-disable-next-line
    setUserRole(role);
  }, [pathname]);

  // 1. 숨김 처리
  if (DONT_SHOW_FOOTER_PATHS.includes(pathname)) {
    return null;
  }

  // 2. 숏츠 페이지 여부 확인
  const isShorts = pathname === '/shorts';

  const visibleItems = FOOTER_ITEMS.filter(item => {
    // 기업 회원이면 'Upload' 메뉴 제외
    if (userRole === 'COMPANY' && item.title === '업로드') {
      return false;
    }
    return true;
  });

  return (
    <footer
      className={cn(
        'w-full flex justify-between items-center px-6 py-2 transition-colors duration-200',
        'h-14 fixed bottom-0 left-1/2 -translate-x-1/2 z-50 max-w-md',
        isShorts
          ? 'bg-linear-to-t from-black/80 to-transparent text-white'
          : 'bg-white text-gray-600 border-t border-gray-200',
      )}
    >
      {visibleItems.map(({ title, icon: Icon, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={title}
            href={href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-full h-full',
              // 호버 효과 및 활성화 상태 스타일
              isShorts ? 'hover:text-gray-200' : 'hover:text-black',
            )}
          >
            <Icon
              size={24}
              // 활성화된 탭은 내부를 채우거나 굵게 표시하는 등의 시각적 차이를 줄 수 있음
              className={cn('transition-transform', isActive && 'scale-110')}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className="text-[10px] font-medium">{title}</span>
          </Link>
        );
      })}
    </footer>
  );
}
