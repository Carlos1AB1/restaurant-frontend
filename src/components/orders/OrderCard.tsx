// src/components/orders/OrderCard.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';

interface OrderCardProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    status_display: string;
    total: number;
    created_at: string;
    expected_delivery_time: string | null;
  };
  isActive: boolean;
}

export default function OrderCard({ order, isActive }: OrderCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleDetails = async () => {
    if (!showDetails && !orderDetails) {
      try {
        setLoading(true);
        const response = await apiClient.get(`/orders/orders/${order.id}/`);
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        toast.error('Error al cargar detalles del pedido');
        setLoading(false);
      }
    }
    
    setShowDetails(!showDetails);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-indigo-100 text-indigo-800';
      case 'READY':
      case 'OUT_FOR_DELIVERY':
        return 'bg-green-100 text-green-800';
      case 'DELIVERED':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrder = async () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        await apiClient.patch(`/orders/orders/${order.id}/cancel/`);
        toast.success('Pedido cancelado correctamente');
        
        // Actualiza el estado del pedido en la UI
        router.refresh();
      } catch (err) {
        toast.error('Error al cancelar el pedido');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold">Pedido #{order.order_number}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status_display}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Realizado el {formatDate(order.created_at)}
            </p>
          </div>
          
          <div className="mt-2 sm:mt-0 flex items-center space-x-3">
            <span className="font-semibold">${order.total.toFixed(2)}</span>
            
            <button
              onClick={handleToggleDetails}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </button>
          </div>
        </div>
        
        {isActive && order.status === 'PENDING' && (
          <div className="mt-4">
            <button
              onClick={handleCancelOrder}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancelar pedido
            </button>
          </div>
        )}
        
        {isActive && order.expected_delivery_time && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-md">
            <p className="text-indigo-800 font-medium">
              Tiempo estimado de entrega: {new Date(order.expected_delivery_time).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
        
        {showDetails && (
          <div className="mt-6 border-t pt-4">
            {loading ? (
              <div className="text-center py-4">
                <svg className="animate-spin h-6 w-6 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-gray-600">Cargando detalles...</p>
              </div>
            ) : orderDetails ? (
              <div>
                <h4 className="font-medium mb-3">Productos</h4>
                <div className="space-y-3 mb-4">
                  {orderDetails.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p>{item.dish.name}</p>
                        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 italic">Nota: {item.notes}</p>
                        )}
                      </div>
                      <p className="font-medium">${item.line_total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between mb-1">
                    <span>Subtotal</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Impuestos</span>
                    <span>${orderDetails.taxes.toFixed(2)}</span>
                  </div>
                  {orderDetails.delivery_fee > 0 && (
                    <div className="flex justify-between mb-1">
                      <span>Costo de envío</span>
                      <span>${orderDetails.delivery_fee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Total</span>
                    <span>${orderDetails.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {orderDetails.address && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-medium mb-2">Dirección de entrega</h4>
                    <p>{orderDetails.address.address_line1}</p>
                    {orderDetails.address.address_line2 && (
                      <p>{orderDetails.address.address_line2}</p>
                    )}
                    <p>
                      {orderDetails.address.city}, {orderDetails.address.state}, {orderDetails.address.postal_code}
                    </p>
                    <p>Tel: {orderDetails.address.phone_number}</p>
                  </div>
                )}
                
                {orderDetails.notes && (
                  <div className="mt-4 border-t pt-3">
                    <h4 className="font-medium mb-2">Notas adicionales</h4>
                    <p className="text-gray-700">{orderDetails.notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No se pudieron cargar los detalles</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}