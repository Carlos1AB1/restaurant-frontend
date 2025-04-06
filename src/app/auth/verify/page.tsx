'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import authService from '@/lib/auth/authService';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const verifyEmail = async () => {
      try {
        await authService.verifyEmail(token);
        setVerificationStatus('success');
        toast.success('Correo electrónico verificado exitosamente');
        
        // Redirigir después de 3 segundos
        const timer = setTimeout(() => {
          router.push('/login');
        }, 3000);

        return () => clearTimeout(timer);
      } catch (error: any) {
        setVerificationStatus('error');
        toast.error(error.response?.data?.detail || 'Error al verificar el correo electrónico');
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {verificationStatus === 'loading' && (
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Verificando Correo Electrónico
            </h2>
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
            </div>
          </div>
        )}

        {verificationStatus === 'success' && (
          <div>
            <h2 className="text-3xl font-extrabold text-green-600 mb-4">
              Correo Verificado
            </h2>
            <p className="text-gray-600 mb-6">
              Tu correo electrónico ha sido verificado exitosamente. Serás redirigido a iniciar sesión.
            </p>
            <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
              Iniciar Sesión
            </Link>
          </div>
        )}

        {verificationStatus === 'error' && (
          <div>
            <h2 className="text-3xl font-extrabold text-red-600 mb-4">
              Error de Verificación
            </h2>
            <p className="text-gray-600 mb-6">
              Hubo un problema al verificar tu correo electrónico. El enlace puede estar caducado o ser inválido.
            </p>
            <div className="space-x-4">
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800">
                Iniciar Sesión
              </Link>
              <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-800">
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}