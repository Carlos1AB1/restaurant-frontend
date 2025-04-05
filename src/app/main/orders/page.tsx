// src/app/(main)/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import apiClient from '@/lib/api/client';
import { RootState } from '@/store';
import OrderCard from '@/components/orders/OrderCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  order_number: string;
  status: string;
  status_display: string;
  total: number;
  created_at: string;
  expected_delivery_time: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/orders/orders/');
        setOrders(response.data);
        
        // Separar órdenes activas y pasadas
        const active = response.data.filter((order: Order) => 
          ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(order.status)
        );
        
        const past = response.data.filter((order: Order) => 
          ['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(order.status)
        );
        
        setActiveOrders(active);
        setPastOrders(past);
        setLoading(false);
      } catch (err) {
        toast.error('Error al cargar tus pedidos');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [isAuthenticated, router]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tus Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl mb-4">No tienes pedidos todavía</h2>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => router.push('/menu')}
          >
            Explorar menú
          </button>
        </div>
      ) : (
        <div>
          {activeOrders.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Pedidos activos</h2>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isActive={true} />
                ))}
              </div>
            </div>
          )}
          
          {pastOrders.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Pedidos anteriores</h2>
              <div className="space-y-4">
                {pastOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isActive={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}