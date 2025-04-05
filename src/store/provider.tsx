// src/store/provider.tsx
'use client';

import { store } from './index';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { loadUser } from './slices/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      store.dispatch(loadUser());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}