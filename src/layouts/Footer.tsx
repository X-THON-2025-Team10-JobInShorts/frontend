'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Play, Search, CirclePlus, MessageCircleMore, UserRound } from 'lucide-react';

const ICON_ITEMS = [
  {
    title: '숏폼',
    icon: Play,
    href: '/shorts',
  },
  {
    title: '검색',
    icon: Search,
    href: '/search',
  },
  {
    title: '업로드',
    icon: CirclePlus,
    href: '/upload',
  },
  {
    title: '메시지',
    icon: MessageCircleMore,
    href: '/messages',
  },
  {
    title: '프로필',
    icon: UserRound,
    href: '/profile',
  },
];

const DONT_SHOW_FOOTER_PATHS = ['/login', '/upload'];

export default function Footer() {
  const pathname = usePathname();
  if (DONT_SHOW_FOOTER_PATHS.includes(pathname)) {
    return null;
  }

  return (
    <footer className="w-full h-12 flex justify-between items-center px-8 py-4">
      {ICON_ITEMS.map(({ title, icon: Icon, href }) => (
        <Link
          key={title}
          href={href}
          className="flex flex-col items-center justify-center text-gray-600 hover:text-black"
        >
          <Icon size={24} className="font-bold" />
          <span className="text-xs pt-1">{title}</span>
        </Link>
      ))}
    </footer>
  );
}
