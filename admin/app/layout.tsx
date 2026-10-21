import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// D-039: Inter for body/UI text; self-hosted by next/font at build time.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'EstateOS — Agency Admin',
  description: 'Secure EstateOS agency account access.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
