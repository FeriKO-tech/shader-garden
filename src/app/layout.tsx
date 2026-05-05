import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shader Garden',
  description: 'Interactive WebGL shader gallery with a live GLSL editor.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
