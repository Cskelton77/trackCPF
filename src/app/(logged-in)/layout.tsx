import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import StyledComponentsRegistry from '@/registry';
import './globals.css';
import ParentWrapper from './ParentWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Login - TrackCPF',
  description: 'Track your Calories, Protein, Fibre',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <ParentWrapper>{children}</ParentWrapper>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
