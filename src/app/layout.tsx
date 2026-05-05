import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://shader-garden-bice.vercel.app';
const description = 'Interactive WebGL shader gallery with a live GLSL editor.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Shader Garden',
    template: '%s · Shader Garden',
  },
  description,
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'Shader Garden',
    title: 'Shader Garden',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shader Garden',
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
