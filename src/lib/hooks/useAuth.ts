// src/lib/hooks/useAuth.ts
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RootState } from '@/store';

export function useAuth(redirectIfAuthenticated = false) {
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !redirectIfAuthenticated) {
        // Si no está autenticado y se requiere autenticación
        router.push('/login');
      } else if (isAuthenticated && redirectIfAuthenticated) {
        // Si está autenticado y se requiere redirección
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, redirectIfAuthenticated, router]);

  return { isAuthenticated, isLoading, user };
}