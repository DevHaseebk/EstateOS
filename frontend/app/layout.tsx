import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display } from 'next/font/google';
import 'site-template/template.css';
import './globals.css';

// D-039 public-site fonts, self-hosted by next/font and handed to the shared template as CSS variables.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'EstateOS',
  description: 'Agency websites powered by EstateOS.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${playfair.variable}`}>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
