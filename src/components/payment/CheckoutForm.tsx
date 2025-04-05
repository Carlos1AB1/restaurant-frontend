// src/components/payment/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  orderId: string;
}

export default function CheckoutForm({ orderId }: CheckoutFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe aún no ha cargado
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error('Error al procesar el pago');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment('', {
        payment_method: {
          card: cardElement,
          billing_details: {
            // Aquí puedes añadir datos de facturación si son necesarios
          },
        },
      });

      if (error) {
        toast.error(error.message || 'Error al procesar el pago');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Notificar al backend que el pago fue exitoso
        await apiClient.post(`/payments/confirm/${orderId}/`);
        
        toast.success('¡Pago completado con éxito!');
        router.push(`/orders?success=true`);
      } else {
        toast.error('El pago no pudo completarse');
      }
    } catch (err) {
      console.error('Error en el proceso de pago:', err);
      toast.error('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Finalizar Pago</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
              Información de tarjeta
            </label>
            
            <div className="border rounded-md p-4">
              <CardElement id="card-element" options={cardElementOptions} />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Para pruebas, utilice:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Número: 4242 4242 4242 4242</li>
              <li>Expiración: Cualquier fecha futura</li>
              <li>CVC: Cualquier número de 3 dígitos</li>
            </ul>
          </div>
          
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </>
            ) : (
              'Pagar ahora'
            )}
          </button>
        </form>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/cart')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Volver al carrito
        </button>
      </div>
    </div>
  );
}