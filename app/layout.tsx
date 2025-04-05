// app/layout.tsx

import './globals.css'; // or adjust if you're using another global CSS file

export const metadata = {
  title: 'Test Results Dashboard',
  description: 'Pipeline test and code coverage summary',
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
