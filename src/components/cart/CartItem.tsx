import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CartItemProps {
  item: {
    id: string;
    dish: {
      id: string;
      name: string;
      price: number;
      image: string | null;
    };
    quantity: number;
    notes: string;
    unit_price: number;
    line_total: number;
  };
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    
    if (newQuantity >= 1 && newQuantity <= 10) {
      setIsUpdating(true);
      onQuantityChange(item.id, newQuantity);
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      onRemove(item.id);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row border-b py-4 gap-4">
      <div 
        className="w-full sm:w-24 h-24 bg-gray-200 rounded-md overflow-hidden cursor-pointer"
        onClick={() => router.push(`/dish/${item.dish.id}`)}
      >
        {item.dish.image ? (
          <Image
            src={item.dish.image.startsWith('http') 
              ? item.dish.image 
              : `${process.env.NEXT_PUBLIC_API_URL}${item.dish.image}`}
            alt={item.dish.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Sin imagen
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <h3 
          className="text-lg font-medium cursor-pointer hover:text-indigo-600"
          onClick={() => router.push(`/dish/${item.dish.id}`)}
        >
          {item.dish.name}
        </h3>
        
        <p className="text-gray-700 mt-1">
          ${item.unit_price.toFixed(2)} / unidad
        </p>
        
        {item.notes && (
          <p className="text-gray-500 mt-1 text-sm italic">
            Nota: {item.notes}
          </p>
        )}
        
        <div className="flex justify-between mt-3">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={isUpdating || item.quantity <= 1}
              className="w-8 h-8 bg-gray-200 rounded-l-md flex items-center justify-center disabled:opacity-50"
              aria-label="Disminuir cantidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            
            <span className="w-10 h-8 bg-gray-100 flex items-center justify-center text-md font-medium">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isUpdating || item.quantity >= 10}
              className="w-8 h-8 bg-gray-200 rounded-r-md flex items-center justify-center disabled:opacity-50"
              aria-label="Aumentar cantidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-semibold">${item.line_total.toFixed(2)}</span>
            
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700"
              aria-label="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}