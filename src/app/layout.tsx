import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { cn } from '@/lib/utils';
import Footer from '@/layouts/Footer';
import ProgressBar from './_Provider/ProgressBar';
import FooterPad from './_Provider/FooterPad';
import QueryClient from './_Provider/QueryClient';

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
  icons: {
    icon: '/favicon.png',
  },
};

const IS_DEV = process.env.NODE_ENV === 'development';

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased flex justify-center items-center h-screen',
          IS_DEV ? 'bg-green-400' : 'bg-gray-100',
        )}
      >
        <ProgressBar>
          <QueryClient>
            <div className="relative w-full max-w-md h-full bg-white shadow-xl">
              <FooterPad className="w-full h-full scrollbar-hide">{children}</FooterPad>
              {modal}
              <Footer />
            </div>
          </QueryClient>
        </ProgressBar>
      </body>
    </html>
  );
}
