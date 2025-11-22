'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

import type { Short } from '@/data/shorts';
import { usePlaybackStore } from '@/stores/playback.store';
import { cn } from '@/lib/utils';

interface ShortsPlayerProps {
  short: Short;
  isActive: boolean;
}

export interface ShortsPlayerRef {
  play: () => void;
  pause: () => void;
}

function ShortsPlayerInner(
  { short, isActive }: ShortsPlayerProps,
  ref: React.Ref<ShortsPlayerRef>,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const { hasInteracted, setHasInteracted } = usePlaybackStore();

  const play = useCallback(() => {
    videoRef.current?.play().catch(() => {
      // 자동 재생 정책 등으로 실패 시 처리
      setIsPaused(true);
    });
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    setIsPaused(true);
  }, []);

  useImperativeHandle(ref, () => ({ play, pause }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // 사용자가 상호작용 했다면 즉시 재생, 아니면 음소거 재생 등의 정책 필요
      if (hasInteracted) {
        video.currentTime = 0; // 숏츠는 보통 처음부터 다시 시작
        // defer playing to avoid calling setState synchronously inside an effect
        requestAnimationFrame(() => {
          const v = videoRef.current;
          if (!v) return;
          if (!isActive) return;
          play();
        });
      }
    } else {
      // defer pausing to avoid calling setState synchronously inside an effect
      requestAnimationFrame(() => {
        const v = videoRef.current;
        if (!v) return;
        if (isActive) return;
        pause();
      });
    }
  }, [isActive, hasInteracted, play, pause]);

  const handleVideoClick = () => {
    if (!hasInteracted) setHasInteracted(true);
    if (isPaused) play();
    else pause();
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* object-contain 대신 object-cover를 쓰면 꽉 차게 보이지만 위아래가 잘릴 수 있음. 숏츠 특성상 cover가 더 몰입감 있음 */}
      <video
        ref={videoRef}
        src={short.videoUrl}
        className="w-full h-full object-contain md:object-contain bg-black"
        playsInline
        loop
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
      />

      {/* 클릭 영역 (전체 화면) */}
      <div
        className="absolute inset-0 z-10 cursor-pointer flex items-center justify-center"
        onClick={handleVideoClick}
      >
        {isPaused && (
          <div className="text-white bg-black/40 rounded-full p-5 backdrop-blur-sm transform transition-transform active:scale-95">
            <FaPlay size={32} />
          </div>
        )}
      </div>

      {/* 텍스트 오버레이 (그라데이션 추가로 가독성 확보) */}
      <div
        className={cn(
          'absolute bottom-0 left-0 w-full p-6 pb-20 text-white',
          'bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-none z-20',
        )}
      >
        <h3 className="text-lg font-bold mb-1 drop-shadow-md">{short.title}</h3>
        <p className="text-sm text-gray-200 line-clamp-2 mb-2 drop-shadow-sm">
          {short.description}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-500"></div> {/* 아바타 자리 */}
          <p className="text-xs font-medium text-gray-300">By {short.author}</p>
        </div>
      </div>
    </div>
  );
}

export const ShortsPlayer = forwardRef(ShortsPlayerInner);
ShortsPlayer.displayName = 'ShortsPlayer';
