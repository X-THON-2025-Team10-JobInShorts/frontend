'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OnboardingCard from '@/components/onboarding/OnboardingCard';
import { ONBOARDING_CONTENTS } from '@/constants/onboarding';
import { AnimatePresence, motion } from 'motion/react';

const TOTAL_STEPS = 3;

function OnboardingLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStep = Number(searchParams.get('step')) || 1;

  /** 다음 단계 이동 */
  const next = () => {
    if (currentStep < TOTAL_STEPS) {
      router.push(`/onboarding?step=${currentStep + 1}`);
    } else {
      complete();
    }
  };

  /** 이전 단계 이동 */
  const back = () => {
    if (currentStep > 1) {
      router.push(`/onboarding?step=${currentStep - 1}`);
      // router.back() 써도 됨
    }
  };

  /** 온보딩 스킵 */
  const skip = () => {
    router.push('/login');
  };

  /** 온보딩 완료 */
  const complete = () => {
    router.push('/login');
  };

  /** render 부분은 네가 퍼블리싱 넣으면 됨 */
  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0.5, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.5, x: -30 }}
          transition={{ duration: 0.25 }}
          className="absolute w-full h-full"
        >
          {/* Step 렌더링 */}
          {currentStep === 1 && <Step1 next={next} skip={skip} />}
          {currentStep === 2 && <Step2 next={next} back={back} skip={skip} />}
          {currentStep === 3 && <Step3 complete={complete} back={back} skip={skip} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingLogic />
    </Suspense>
  );
}

function Step1({ next, skip }: { next: () => void; skip: () => void }) {
  return (
    <OnboardingCard
      next={next}
      skip={skip}
      content={ONBOARDING_CONTENTS.step1}
      step={1}
      maxSteps={TOTAL_STEPS}
    />
  );
}

function Step2({ next, back, skip }: { next: () => void; back: () => void; skip: () => void }) {
  return (
    <OnboardingCard
      next={next}
      back={back}
      skip={skip}
      content={ONBOARDING_CONTENTS.step2}
      step={2}
      maxSteps={TOTAL_STEPS}
    />
  );
}

function Step3({
  complete,
  back,
  skip,
}: {
  complete: () => void;
  back: () => void;
  skip: () => void;
}) {
  return (
    <OnboardingCard
      complete={complete}
      back={back}
      skip={skip}
      content={ONBOARDING_CONTENTS.step3}
      step={3}
      maxSteps={TOTAL_STEPS}
    />
  );
}
