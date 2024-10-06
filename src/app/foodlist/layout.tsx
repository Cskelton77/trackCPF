import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Edit Food Database - TrackCPF',
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
  return <>{children}</>;
}
