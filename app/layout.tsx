import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Scope Dashboard',
  description: 'View application test and code coverage',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
