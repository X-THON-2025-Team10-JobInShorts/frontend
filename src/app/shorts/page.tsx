'use client';

import { useCallback, useLayoutEffect, useRef, useState, Suspense } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { ShortsPlayer, ShortsPlayerRef } from '@/components/shorts/ShortsPlayer';
import { shorts } from '@/data/shorts';

function ShortsPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRefs = useRef<(ShortsPlayerRef | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight } = event.currentTarget;
      const index = Math.round(scrollTop / clientHeight);
      if (index !== currentIndex) {
        setCurrentIndex(index);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('shortId', shorts[index].id.toString());
        router.push(`${pathname}?${newSearchParams.toString()}`, {
          scroll: false,
        });
      }
    },
    [currentIndex, router, pathname, searchParams],
  );

  const scrollToShort = useCallback((index: number, behavior: 'smooth' | 'auto' = 'smooth') => {
    if (containerRef.current && index >= 0 && index < shorts.length) {
      containerRef.current.scrollTo({
        top: index * containerRef.current.clientHeight,
        behavior,
      });
    }
  }, []);

  useLayoutEffect(() => {
    const shortId = searchParams.get('shortId');
    if (shortId) {
      const index = shorts.findIndex(s => s.id === parseInt(shortId, 10));
      if (index !== -1) {
        requestAnimationFrame(() => {
          setCurrentIndex(index);
        });
        scrollToShort(index, 'auto');
      }
    }
  }, [searchParams]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative snap-y snap-mandatory overflow-y-scroll no-scrollbar"
        onScroll={handleScroll}
      >
        {shorts.map((short, index) => (
          <div key={short.id} className="relative w-full h-screen snap-start">
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
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <button
          onClick={() => scrollToShort(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-white/50 disabled:opacity-50"
        >
          <FaArrowUp />
        </button>
        <button
          onClick={() => scrollToShort(currentIndex + 1)}
          disabled={currentIndex === shorts.length - 1}
          className="p-2 rounded-full bg-white/50 disabled:opacity-50"
        >
          <FaArrowDown />
        </button>
      </div>
    </>
  );
}

export default function ShortsPage() {
  return (
    <Suspense fallback={null}>
      <ShortsPageInner />
    </Suspense>
  );
}
