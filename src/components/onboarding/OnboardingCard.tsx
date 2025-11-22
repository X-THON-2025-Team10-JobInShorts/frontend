import Image from 'next/image';
import { type OnboardingContents } from '@/constants/onboarding';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OnboardingCardProps {
  next?: () => void;
  back?: () => void;
  skip?: () => void;
  complete?: () => void;
  className?: string;
  content: OnboardingContents;
  step: number;
  maxSteps: number;
}

export default function OnboardingCard({
  next,
  back,
  skip,
  complete,
  className,
  content,
  step,
  maxSteps,
}: OnboardingCardProps) {
  return (
    <section
      className={cn(
        className,
        content.gradient,
        'flex flex-col items-center justify-between gap-8 h-full',
      )}
    >
      <div className="flex flex-col w-full items-center mt-6">
        <div className="w-full flex justify-end mr-8">
          <button onClick={() => skip?.()} className="text-white text-base font-semibold">
            건너뛰기
          </button>
        </div>
        <Image
          src={content.imageUrl}
          alt="Onboarding Image"
          width={300}
          height={400}
          className="rounded-4xl mt-10"
        />
      </div>
      {/* 온보딩 카드 UI 구현 */}
      <div className="bg-white w-full h-[280px] flex flex-col items-center justify-between rounded-t-4xl p-8">
        <h2 className="font-semibold text-4xl">{content.title}</h2>
        <p className="font-medium text-[#737373] text-base whitespace-pre-line text-center h-[52px]">
          {content.description}
        </p>

        {/* 진행 인디케이터 */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: maxSteps }).map((_, i) => {
            const stepIndex = i + 1;
            const isActive = step === stepIndex;

            return (
              <div
                key={i}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  isActive ? 'w-8 bg-[#00A6F4]' : 'w-2 bg-gray-300',
                )}
              />
            );
          })}
        </div>

        <div className="w-full flex items-center justify-between gap-4 mt-4">
          {back && (
            <button
              onClick={() => back?.()}
              className={cn(
                'relative ',
                'flex h-[43px] w-[43px] items-center justify-center rounded-2xl bg-white',
                'hover:bg-gray-100',
              )}
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
          )}

          <button
            onClick={() => {
              next?.();
              complete?.();
            }}
            className={cn(
              'relative ', // ★ 필요하면 이거 추가
              'flex h-[43px] items-center justify-center rounded-[12px]',
              'bg-[linear-gradient(90deg,#00A6F4_0%,#0084D1_100%)]',
              '[box-shadow: 0 10px 15px -3px rgba(0, 166, 244, 0.30), 0 4px 6px -4px rgba(0, 166, 244, 0.30)]',
              'w-full text-white font-semibold text-lg',
            )}
          >
            {next && <span>다음</span>}
            {complete && <span>시작하기</span>}
            <ChevronRight className="absolute right-4 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
