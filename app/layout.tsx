import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Scope Dashboard',
  description: 'View and manage app pipelines',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
