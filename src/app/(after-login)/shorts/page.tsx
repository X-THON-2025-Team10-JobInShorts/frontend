'use client';

import { useCallback, useEffect, useRef, useState, Suspense } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ShortsPlayer, ShortsPlayerRef } from '@/components/shorts/ShortsPlayer';
import { useInfiniteShortsFeed } from '@/apis/shorts/useInfiniteShortsFeed.query';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage';
// import { mockFeed } from '@/apis/shorts/mock.data';

function ShortsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pid, setPid] = useState<string | null>(null);

  useEffect(() => {
    const p = localStorage.getItem(LOCAL_STORAGE_KEYS.PID);
    setPid(p);
  }, []);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteShortsFeed(pid);
  const shorts = data ? data.pages.flatMap(page => page.data) : [];

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const onScroll = () => {
      if (!data || !hasNextPage || isFetchingNextPage) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      // 끝에서 1.5 화면 정도 남았을 때 다음 페이지 로드
      if (scrollHeight - scrollTop - clientHeight < clientHeight * 1.5) {
        fetchNextPage();
      }
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [data, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRefs = useRef<(ShortsPlayerRef | null)[]>([]);

  // 프로그램에 의한 스크롤인지 사용자에 의한 스크롤인지 구분하기 위한 플래그
  const isProgrammaticScroll = useRef(false);
  // 스크롤 디바운싱/쓰로틀링을 위한 타이머
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // URL 업데이트 함수 (스택에 쌓음)
  const updateUrl = useCallback(
    (index: number) => {
      const currentShortId = shorts[index].id.toString();
      const newSearchParams = new URLSearchParams(searchParams);

      // 이미 같은 ID라면 URL 업데이트 건너뜀
      if (newSearchParams.get('shortId') === currentShortId) return;

      newSearchParams.set('shortId', currentShortId);

      // scroll: false 옵션으로 페이지 스크롤이 튀는 것 방지
      router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    // 프로그램적으로 스크롤 중이라면 URL 업데이트 로직을 실행하지 않음
    if (isProgrammaticScroll.current) return;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      const { scrollTop, clientHeight } = containerRef.current!;
      // 정확한 인덱스 계산 (반올림)
      const newIndex = Math.round(scrollTop / clientHeight);

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < shorts.length) {
        setCurrentIndex(newIndex);
        updateUrl(newIndex);
      }
    }, 50); // 50ms 딜레이로 과도한 호출 방지
  }, [currentIndex, updateUrl]);

  const scrollToShort = useCallback((index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
    if (containerRef.current && index >= 0 && index < shorts.length) {
      isProgrammaticScroll.current = true; // 스크롤 시작 전 플래그 설정

      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior,
      });

      setCurrentIndex(index);

      // 스크롤 애니메이션이 끝날 즈음에 플래그 해제 (smooth일 경우 넉넉하게)
      setTimeout(
        () => {
          isProgrammaticScroll.current = false;
        },
        behavior === 'smooth' ? 500 : 50,
      );
    }
  }, []);

  // 초기 로드 및 뒤로가기/앞으로가기 시 URL에 맞춰 스크롤 이동
  useEffect(() => {
    const shortId = searchParams.get('shortId');
    if (shortId) {
      const index = shorts.findIndex(s => s.id === parseInt(shortId, 10));
      // 현재 보고 있는 인덱스와 다를 때만 이동 (스크롤 충돌 방지)
      if (index !== -1 && index !== currentIndex) {
        scrollToShort(index, 'auto');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // currentIndex를 의존성에서 빼서 루프 방지

  return (
    <div className="relative w-full h-full bg-black">
      {/* 메인 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="
          w-full h-full md:h-screen
          overflow-y-scroll 
          snap-y snap-mandatory 
          no-scrollbar 
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
        "
      >
        {shorts.map((short, index) => (
          <div
            key={short.id}
            className="w-full h-full snap-start snap-always flex items-center justify-center bg-black"
          >
            <ShortsPlayer
              short={short}
              isActive={index === currentIndex}
              ref={el => {
                playerRefs.current[index] = el;
              }}
            />
          </div>
        ))}
      </div>

      {/* 네비게이션 버튼 (PC용 혹은 오버레이) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
        <button
          onClick={() => {
            updateUrl(currentIndex - 1); // URL 먼저 변경하여 히스토리 일관성 유지
            scrollToShort(currentIndex - 1);
          }}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all disabled:opacity-0 disabled:pointer-events-none backdrop-blur-sm"
        >
          <FaArrowUp size={20} />
        </button>
        <button
          onClick={() => {
            updateUrl(currentIndex + 1);
            scrollToShort(currentIndex + 1);
          }}
          disabled={currentIndex === shorts.length - 1}
          className="p-3 rounded-full bg-black/40 text-white hover:bg-black/60 transition-all disabled:opacity-0 disabled:pointer-events-none backdrop-blur-sm"
        >
          <FaArrowDown size={20} />
        </button>
      </div>
    </div>
  );
}

export default function ShortsPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-black" />}>
      <ShortsPageInner />
    </Suspense>
  );
}
