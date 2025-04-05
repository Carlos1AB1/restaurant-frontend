interface CartSummaryProps {
    subtotal: number;
    taxes: number;
    total: number;
    onCheckout: () => void;
  }
  
  export default function CartSummary({ subtotal, taxes, total, onCheckout }: CartSummaryProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
        <h2 className="text-xl font-semibold mb-4">Resumen del pedido</h2>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Impuestos (16%)</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          
          <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
        >
          Proceder al pago
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">Aceptamos</h3>
          <div className="flex space-x-2">
            <div className="bg-gray-100 p-1 rounded">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none" className="text-blue-700">
                <rect width="40" height="24" rx="4" fill="currentColor" />
                <path d="M16 16H13.5V9L10 16H8L4.5 9V16H2V7H5.5L9 14L12.5 7H16V16Z" fill="white" />
                <path d="M17 11.5C17 9 18.5 7 21.5 7C24.5 7 26 9 26 11.5C26 14 24.5 16 21.5 16C18.5 16 17 14 17 11.5ZM23.5 11.5C23.5 10 22.8 9 21.5 9C20.2 9 19.5 10 19.5 11.5C19.5 13 20.2 14 21.5 14C22.8 14 23.5 13 23.5 11.5Z" fill="white" />
                <path d="M37 16H35V14.5H34.8C34.4 15.5 33.4 16 32.3 16C30 16 28.5 14 28.5 11.5C28.5 9 30 7 32.3 7C33.4 7 34.3 7.5 34.8 8.5H35V7H37V16ZM31 11.5C31 13 31.8 14 33 14C34.2 14 35 13 35 11.5C35 10 34.2 9 33 9C31.8 9 31 10 31 11.5Z" fill="white" />
              </svg>
            </div>
            <div className="bg-gray-100 p-1 rounded">
              <svg width="40" height="24" viewBox="0 0 40 24" className="text-blue-500">
                <rect width="40" height="24" rx="4" fill="currentColor" />
                <circle cx="16" cy="12" r="5" fill="#EB001B" />
                <circle cx="24" cy="12" r="5" fill="#F79E1B" />
                <path fillRule="evenodd" clipRule="evenodd" d="M20 12C20 10.3431 19.1569 8.68629 18 8.68629C16.8431 8.68629 16 10.3431 16 12C16 13.6569 16.8431 15.3137 18 15.3137C19.1569 15.3137 20 13.6569 20 12Z" fill="#FF5F00" />
              </svg>
            </div>
            <div className="bg-gray-100 p-1 rounded">
              <svg width="40" height="24" viewBox="0 0 40 24" className="text-gray-800">
                <rect width="40" height="24" rx="4" fill="currentColor" />
                <path d="M17 7.5H23V16.5H17V7.5Z" fill="#FF5F00" />
                <path d="M17.5 12C17.5 10.1 18.4 8.5 19.8 7.5C19 6.9 18 6.5 17 6.5C14.2 6.5 12 9 12 12C12 15 14.2 17.5 17 17.5C18 17.5 19 17.1 19.8 16.5C18.4 15.5 17.5 13.9 17.5 12Z" fill="#EB001B" />
                <path d="M28 12C28 15 25.8 17.5 23 17.5C22 17.5 21 17.1 20.2 16.5C21.6 15.5 22.5 13.9 22.5 12C22.5 10.1 21.6 8.5 20.2 7.5C21 6.9 22 6.5 23 6.5C25.8 6.5 28 9 28 12Z" fill="#F79E1B" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }