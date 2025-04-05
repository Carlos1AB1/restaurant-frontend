import { useRouter } from 'next/navigation';

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-24 w-24 text-gray-400 mb-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={1.5} 
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      
      <h2 className="text-2xl font-semibold mb-2">Tu carrito está vacío</h2>
      
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Parece que aún no has agregado ningún plato a tu carrito. 
        Explora nuestro menú y descubre deliciosas opciones.
      </p>
      
      <button
        onClick={() => router.push('/menu')}
        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        Ver menú
      </button>
    </div>
  );
}