import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';
import Footer from '@/layouts/Footer';
import ProgressBar from './_Provider/ProgressBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Job으 Shorts!',
  description: 'A platform to share and discover short videos.',
};

const IS_DEV = process.env.NODE_ENV === 'development';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased flex flex-col w-full justify-center items-center h-screen overflow-hidden',
          IS_DEV ? 'bg-green-400' : 'bg-gray-100',
        )}
      >
        <ProgressBar>
          <div className="relative flex flex-col w-full max-w-md h-full bg-white shadow-xl overflow-hidden">
            <main className="flex-1 w-full h-full overflow-y-auto scrollbar-hide">{children}</main>
            <Footer />
          </div>
        </ProgressBar>
      </body>
    </html>
  );
}
