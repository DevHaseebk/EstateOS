import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EstateOS — Agency Admin',
  description: 'Secure EstateOS agency account access.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
