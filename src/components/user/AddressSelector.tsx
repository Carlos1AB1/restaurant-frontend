// src/components/user/AddressSelector.tsx
import { useState } from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AddAddressForm from './AddAddressForm';

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

interface AddressSelectorProps {
  addresses: Address[];
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function AddressSelector({ addresses, register, errors }: AddressSelectorProps) {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const router = useRouter();

  // Encuentra la dirección por defecto
  const defaultAddress = addresses.find(addr => addr.is_default);
  
  const handleAddNewAddress = async (addressData: any) => {
    try {
      // Aquí iría la lógica para añadir una nueva dirección
      // Como es probable que esto se maneje en la página de perfil completa
      // redirigimos al usuario a dicha página
      router.push('/profile');
    } catch (err) {
      console.error('Error al agregar dirección:', err);
    }
  };

  if (addresses.length === 0) {
    return (
      <div>
        <p className="text-gray-500 mb-3">No tienes direcciones guardadas.</p>
        {showAddressForm ? (
          <AddAddressForm 
            onSubmit={handleAddNewAddress}
            onCancel={() => setShowAddressForm(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowAddressForm(true)}
            className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50"
          >
            Agregar dirección
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {addresses.map((address) => (
          <div key={address.id} className="flex items-start">
            <input
              type="radio"
              id={`address-${address.id}`}
              value={address.id}
              {...register('delivery_address_id', { required: 'Selecciona una dirección de entrega' })}
              defaultChecked={address.is_default}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor={`address-${address.id}`} className="ml-3 text-sm">
              <div className="font-medium text-gray-700">
                {address.address_line1}
              </div>
              {address.address_line2 && (
                <div className="text-gray-500">{address.address_line2}</div>
              )}
              <div className="text-gray-500">
                {address.city}, {address.state}, {address.postal_code}
              </div>
              <div className="text-gray-500">Tel: {address.phone_number}</div>
              {address.is_default && (
                <span className="text-xs text-indigo-600 font-medium">Dirección predeterminada</span>
              )}
            </label>
          </div>
        ))}
      </div>
      
      {errors.delivery_address_id && (
        <p className="mt-2 text-sm text-red-600">
          {errors.delivery_address_id.message as string}
        </p>
      )}
      
      <div className="mt-4">
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Gestionar direcciones
        </button>
      </div>
    </div>
  );
}