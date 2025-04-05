// src/app/layout.tsx
'use client';

import { useEffect } from 'react';
import { Providers } from '@/store/provider';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/(auth)') || pathname?.includes('/login') || pathname?.includes('/register');

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <html lang="es">
      <head>
        <title>Restaurante App</title>
        <meta name="description" content="El mejor restaurante de la ciudad" />
      </head>
      <body>
        <Providers>
          <Toaster position="top-right" />
          {!isAuthPage && <Header />}
          <main>
            {children}
          </main>
          {!isAuthPage && <Footer />}
        </Providers>
      </body>
    </html>
  );
}