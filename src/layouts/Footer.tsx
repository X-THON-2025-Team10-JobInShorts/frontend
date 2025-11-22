'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Search, CirclePlus, MessageCircleMore, UserRound } from 'lucide-react';
import { cn } from '@/lib/utils'; // cn 유틸리티 사용 권장 (없다면 일반 템플릿 리터럴로 대체 가능)

const ICON_ITEMS = [
  { title: '숏폼', icon: Play, href: '/shorts' },
  { title: '검색', icon: Search, href: '/search' },
  { title: '업로드', icon: CirclePlus, href: '/upload' },
  { title: '메시지', icon: MessageCircleMore, href: '/messages' },
  { title: '프로필', icon: UserRound, href: '/profile' },
];

const DONT_SHOW_FOOTER_PATHS = ['/login', '/upload', '/onboarding'];

export default function Footer() {
  const pathname = usePathname();

  // 1. 숨김 처리
  if (DONT_SHOW_FOOTER_PATHS.includes(pathname)) {
    return null;
  }

  // 2. 숏츠 페이지 여부 확인
  const isShorts = pathname === '/shorts';

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
      {ICON_ITEMS.map(({ title, icon: Icon, href }) => {
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
