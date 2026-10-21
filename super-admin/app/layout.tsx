import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EstateOS — Super Admin',
  description: 'EstateOS super admin placeholder.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
