import type { Metadata } from 'next';
import { Inter, Manrope, Playfair_Display } from 'next/font/google';
import 'site-template/template.css';
import './globals.css';
import './website.css';

// D-039: Inter for body/UI text; self-hosted by next/font at build time.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
// D-039 public-site heading fonts, used by the shared site-template preview.
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'EstateOS — Agency Admin',
  description: 'Secure EstateOS agency account access.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
