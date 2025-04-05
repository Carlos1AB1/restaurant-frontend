// src/components/orders/OrderSummary.tsx
import Image from 'next/image';

interface OrderItem {
  id: string;
  dish: {
    id: string;
    name: string;
    price: number;
    image: string | null;
  };
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  taxes: number;
  deliveryFee: number;
  total: number;
}

export default function OrderSummary({
  items,
  subtotal,
  taxes,
  deliveryFee,
  total
}: OrderSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
      <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
      
      <div className="max-h-60 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center py-3 border-b">
            <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-3">
              {item.dish.image ? (
                <Image
                  src={item.dish.image.startsWith('http') 
                    ? item.dish.image 
                    : `${process.env.NEXT_PUBLIC_API_URL}${item.dish.image}`}
                  alt={item.dish.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <span className="text-xs">Sin imagen</span>
                </div>
              )}
            </div>
            
            <div className="flex-grow">
              <h3 className="text-sm font-medium">{item.dish.name}</h3>
              <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
            </div>
            
            <div className="text-right">
              <span className="font-medium">${item.line_total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Impuestos (16%)</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Costo de envío</span>
          <span>${deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        <p>
          Al proceder con tu pedido, aceptas nuestros{' '}
          <a href="#" className="text-indigo-600 hover:underline">Términos de servicio</a>{' '}
          y{' '}
          <a href="#" className="text-indigo-600 hover:underline">Políticas de privacidad</a>.
        </p>
      </div>
    </div>
  );
}