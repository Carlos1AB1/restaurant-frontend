// src/store/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/api/client';

interface CartState {
  items: any[];
  totalItems: number;
  subtotal: number;
  tax: number;
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/orders/cart/');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al cargar el carrito');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: { dish: string; quantity: number; notes?: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/orders/cart-items/', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al agregar al carrito');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (data: { id: string; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/orders/cart-items/${data.id}/`, {
        quantity: data.quantity,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al actualizar carrito');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/orders/cart-items/${id}/`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al eliminar del carrito');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await apiClient.delete('/orders/cart-items/clear/');
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Error al vaciar el carrito');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total_items;
        state.subtotal = action.payload.subtotal;
        state.tax = action.payload.taxes;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
        // After adding, we fetch the cart again to get updated state
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Other cart actions would follow a similar pattern
      // For full implementation, handle updateCartItem, removeCartItem, clearCart
  }
});

export default cartSlice.reducer;