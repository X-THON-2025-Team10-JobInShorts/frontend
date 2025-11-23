'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { Shorts } from '@/apis/shorts/dto.types';
import { usePlaybackStore } from '@/stores/playback.store';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Separator } from '@/components/ui/separator';

import { FaPlay } from 'react-icons/fa';
import { Calendar, Clock, Sparkles, Tag, AlignLeft } from 'lucide-react';

interface ShortsPlayerProps {
  short: Shorts;
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
  console.log('Rendering ShortsPlayer for short id:', short.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [open, setOpen] = useState(false);

  const openMore = () => setOpen(true);
  const { hasInteracted, setHasInteracted } = usePlaybackStore();

  const play = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // video.play()는 Promise를 반환합니다.
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // 재생 성공 시
          setIsPaused(false);
        })
        .catch(error => {
          if (error.name === 'AbortError') {
            console.log('재생이 중단되었습니다. (빠른 스크롤 등)');
          } else {
            console.error('재생 실패:', error);
            setIsPaused(true);
          }
        });
    }
  }, []);

  const pause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    // 재생 중이 아닐 때 pause를 부르면 에러가 날 수 있으므로 체크
    if (!video.paused) {
      video.pause();
    }
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

  console.log('short videoUrl:', short.videoUrl);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <div className="relative w-full h-full bg-black overflow-hidden">
        <div
          className={cn(
            'relative w-full h-full bg-black overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top transform-gpu will-change-transform backface-hidden',
            open ? 'scale-[0.3] rounded-[20px] translate-y-2 opacity-80' : '',
          )}
        >
          <video
            ref={videoRef}
            src={short.videoUrl}
            className="w-full h-full object-contain"
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
        </div>

        {/* 텍스트 오버레이 (그라데이션 추가로 가독성 확보) */}
        <div
          className={cn(
            'absolute bottom-0 left-0 w-full p-6 pb-30 md:pb-20 text-white',
            'bg-linear-to-t from-black/80 via-black/40 to-transparent pointer-events-auto z-20',
          )}
        >
          <div className="w-[75%]">
            <h3 className="text-lg font-bold mb-1 drop-shadow-md">{short.title}</h3>
            <p
              onClick={() => setOpen(true)}
              className="text-sm text-gray-200 line-clamp-2 mb-2 drop-shadow-sm cursor-pointer"
            >
              {short.description}
            </p>
            <div className="flex items-center gap-2">
              {short.owner.profileImageUrl ? (
                <Image
                  src={short.owner.profileImageUrl || '/temp-profile.png'}
                  alt={`${short.owner.displayName}'s avatar`}
                  className="w-6 h-6 rounded-full"
                  width={24}
                  height={24}
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-500"></div>
              )}
              <p className="text-xs font-medium text-gray-300">By {short.owner.displayName}</p>
            </div>

            {/* 태그와 더보기 */}
            <section className="my-2 flex justify-between w-full">
              {/* TAG PREVIEW */}
              <div className="flex items-center flex-wrap gap-1">
                {short.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] bg-white/10 border border-white/20 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}

                {/* 추가 태그가 더 있으면 +N 표시 */}
                {short.tags.length > 2 && (
                  <span
                    className="px-2 py-0.5 text-[10px] bg-white/10 border border-white/20 rounded-full cursor-pointer underline"
                    onClick={() => setOpen(true)}
                  >
                    +{short.tags.length - 2} 더보기
                  </span>
                )}
              </div>

              <button className="cursor-pointer p-1" onClick={openMore}>
                <p className="text-sm text-gray-300 underline ">더보기</p>
              </button>
            </section>
          </div>
        </div>

        {/* BOTTOM Drawer */}
        <DrawerContent className="max-w-md mx-auto w-full rounded-t-[20px] h-[70vh] flex flex-col">
          {/* 1. 헤더 및 메타데이터 (고정 영역) */}
          <div className="px-4 pt-2 pb-4 shrink-0">
            {/* 핸들바 디자인 개선 */}
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle className="text-xl font-bold leading-tight mb-2">
                {short.title}
              </DrawerTitle>

              {/* 메타데이터를 아이콘과 함께 한 줄로 배치 */}
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(short.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="w-px h-3 bg-zinc-300" /> {/* 구분선 */}
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{short.durationSec}초</span>
                </div>
              </div>
            </DrawerHeader>
          </div>

          {/* 2. 스크롤 가능한 콘텐츠 영역 */}
          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">
            {/* AI 요약 섹션 (가장 눈에 띄게) */}
            {short.summary && (
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4 relative overflow-hidden">
                {/* 장식용 배경 효과 */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-indigo-200/30 rounded-full blur-xl" />

                <div className="flex items-center gap-2 mb-2 text-indigo-700">
                  <Sparkles className="w-4 h-4 fill-indigo-300" />
                  <h4 className="text-sm font-bold">AI 요약</h4>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed tracking-tight">
                  {short.summary}
                </p>
              </div>
            )}

            {/* 설명 섹션 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-900">
                <AlignLeft className="w-4 h-4" />
                <h4 className="text-sm font-semibold">영상 설명</h4>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                {short.description}
              </p>
            </div>

            {/* 태그 섹션 */}
            {short.tags.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-2 text-zinc-900">
                  <Tag className="w-4 h-4" />
                  <h4 className="text-sm font-semibold">관련 태그</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {short.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* (선택 사항) 하단 고정 버튼 영역이 필요하다면 여기에 추가 */}
          {/* <div className="p-4 border-t mt-auto"> ... </div> */}
        </DrawerContent>
      </div>
    </Drawer>
  );
}

export const ShortsPlayer = forwardRef(ShortsPlayerInner);
ShortsPlayer.displayName = 'ShortsPlayer';
