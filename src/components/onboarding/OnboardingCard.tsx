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
        'h-svh w-full overflow-hidden flex flex-col md:overflow-auto',
      )}
    >
      {/* 상단 이미지 영역 */}
      <div className="flex-1 flex flex-col items-center justify-start pt-6">
        <div className="w-full flex justify-end px-8">
          <button onClick={() => skip?.()} className="text-white text-base font-semibold">
            건너뛰기
          </button>
        </div>

        <Image
          src={content.imageUrl}
          alt="Onboarding Image"
          width={280}
          height={360}
          className="rounded-3xl mt-8 max-h-[40vh] object-contain"
        />
      </div>

      {/* 하단 카드 */}
      <div
        className="bg-white w-full rounded-t-4xl p-8 flex flex-col justify-between items-center"
        style={{ height: '38svh' }}
      >
        <h2 className="font-semibold text-3xl">{content.title}</h2>

        <p className="font-medium text-[#737373] text-base text-center whitespace-pre-line">
          {content.description}
        </p>

        {/* 인디케이터 */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: maxSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 rounded-full transition-all',
                step === i + 1 ? 'w-8 bg-[#00A6F4]' : 'w-2 bg-gray-300',
              )}
            />
          ))}
        </div>

        {/* 버튼 */}
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
            className="relative flex h-12 w-full items-center justify-center rounded-xl
                 bg-[linear-gradient(90deg,#00A6F4_0%,#0084D1_100%)]
                 text-white font-semibold text-lg"
          >
            {next && '다음'}
            {complete && '시작하기'}
            <ChevronRight className="absolute right-4 w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
