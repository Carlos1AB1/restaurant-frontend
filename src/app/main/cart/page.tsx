// src/app/(main)/cart/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import apiClient from '@/lib/api/client';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { RootState } from '@/store';
import toast from 'react-hot-toast';

interface CartItemType {
  id: string;
  dish: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  notes: string;
  unit_price: number;
  line_total: number;
}

interface Cart {
  id: string;
  items: CartItemType[];
  total_items: number;
  subtotal: number;
  taxes: number;
  total: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/cart');
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/orders/cart/');
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        toast.error('Error al cargar el carrito');
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, router]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      await apiClient.patch(`/orders/cart-items/${itemId}/`, {
        quantity: newQuantity
      });
      
      // Actualizar carrito
      const response = await apiClient.get('/orders/cart/');
      setCart(response.data);
      toast.success('Cantidad actualizada');
    } catch (err) {
      toast.error('Error al actualizar cantidad');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await apiClient.delete(`/orders/cart-items/${itemId}/`);
      
      // Actualizar carrito
      const response = await apiClient.get('/orders/cart/');
      setCart(response.data);
      toast.success('Producto eliminado del carrito');
    } catch (err) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleClearCart = async () => {
    try {
      await apiClient.delete('/orders/cart-items/clear/');
      
      // Actualizar carrito
      const response = await apiClient.get('/orders/cart/');
      setCart(response.data);
      toast.success('Carrito vaciado');
    } catch (err) {
      toast.error('Error al vaciar el carrito');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) return <LoadingSpinner />;

  if (!cart || cart.items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tu Carrito</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cart.items.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
          
          <button
            onClick={handleClearCart}
            className="mt-4 text-red-600 hover:text-red-800"
          >
            Vaciar carrito
          </button>
        </div>
        
        <div className="lg:w-1/3">
          <CartSummary 
            subtotal={cart.subtotal}
            taxes={cart.taxes}
            total={cart.total}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}