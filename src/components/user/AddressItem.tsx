// src/components/user/AddressItem.tsx
interface Address {
    id: string;
    address_line1: string;
    address_line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone_number: string;
    is_default: boolean;
  }
  
  interface AddressItemProps {
    address: Address;
    onDelete: () => void;
    onSetDefault: () => void;
  }
  
  export default function AddressItem({ address, onDelete, onSetDefault }: AddressItemProps) {
    return (
      <div className="border rounded-md p-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{address.address_line1}</div>
            {address.address_line2 && (
              <div className="text-gray-600">{address.address_line2}</div>
            )}
            <div className="text-gray-600">
              {address.city}, {address.state}, {address.postal_code}
            </div>
            <div className="text-gray-600">{address.country}</div>
            <div className="text-gray-600 mt-1">Tel: {address.phone_number}</div>
            
            {address.is_default && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Dirección predeterminada
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-2">
            {!address.is_default && (
              <button
                onClick={onSetDefault}
                className="text-indigo-600 hover:text-indigo-800 text-sm"
              >
                Establecer como predeterminada
              </button>
            )}
            
            <button
              onClick={onDelete}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }