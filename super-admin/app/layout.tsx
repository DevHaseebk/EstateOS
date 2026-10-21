import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EstateOS — Super Admin',
  description: 'Secure EstateOS platform administration access.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
