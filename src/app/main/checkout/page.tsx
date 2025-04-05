// src/app/(main)/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import apiClient from '@/lib/api/client';
import { RootState } from '@/store';
import CheckoutForm from '@/components/payment/CheckoutForm';
import PaymentMethod from '@/components/payment/PaymentMethod';
import OrderSummary from '@/components/orders/OrderSummary';
import AddressSelector from '@/components/user/AddressSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

// Cargar Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormValues {
  delivery_method: 'PICKUP' | 'DELIVERY';
  delivery_address_id?: string;
  notes?: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm<CheckoutFormValues>({
    defaultValues: {
      delivery_method: 'PICKUP',
    }
  });
  
  const deliveryMethod = watch('delivery_method');
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener carrito
        const cartResponse = await apiClient.get('/orders/cart/');
        setCart(cartResponse.data);
        
        // Obtener direcciones
        const addressesResponse = await apiClient.get('/users/addresses/');
        setAddresses(addressesResponse.data);
        
        setLoading(false);
      } catch (err) {
        toast.error('Error al cargar los datos para el checkout');
        router.push('/cart');
      }
    };

    fetchData();
  }, [isAuthenticated, router]);
  
  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      // Crear orden
      const orderResponse = await apiClient.post('/orders/checkout/', data);
      setOrderId(orderResponse.data.id);
      
      // Crear intento de pago con Stripe
      const paymentIntentResponse = await apiClient.post('/payments/create-payment-intent/', {
        order_id: orderResponse.data.id
      });
      
      setClientSecret(paymentIntentResponse.data.client_secret);
      
      toast.success('Orden creada, procede con el pago');
    } catch (err) {
      toast.error('Error al crear la orden');
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!cart) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl mb-4">Tu carrito está vacío</h2>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={() => router.push('/menu')}
        >
          Ver menú
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm orderId={orderId!} />
        </Elements>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-4">Método de entrega</h2>
                <PaymentMethod register={register} errors={errors} />
                
                {deliveryMethod === 'DELIVERY' && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Dirección de entrega</h3>
                    <AddressSelector 
                      addresses={addresses} 
                      register={register} 
                      errors={errors}
                    />
                  </div>
                )}
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas adicionales
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full p-2 border rounded-md"
                    placeholder="Instrucciones especiales para su pedido"
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Continuar al pago
              </button>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <OrderSummary 
              items={cart.items}
              subtotal={cart.subtotal}
              taxes={cart.taxes}
              deliveryFee={deliveryMethod === 'DELIVERY' ? 50 : 0}
              total={cart.total + (deliveryMethod === 'DELIVERY' ? 50 : 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
}