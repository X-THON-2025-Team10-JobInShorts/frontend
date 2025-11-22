'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage';

export default function AfterLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  useEffect(() => {
    const pid = localStorage.getItem(LOCAL_STORAGE_KEYS.PID);

    if (!pid) {
      router.replace('/onboarding?step=1');
    } else {
      router.replace('/shorts');
    }
  }, [router]);

  return <>{children}</>;
}
