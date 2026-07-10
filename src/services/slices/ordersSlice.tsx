import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  TNewOrder,
  orderBurgerApi,
  getOrderByNumberApi
} from '@api';
import { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  currentOrder: TNewOrder | null;
  selectedOrder: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  currentOrder: null,
  selectedOrder: null,
  loading: false,
  error: null
};

export const fetchOrder = createAsyncThunk(
  'orders/fetch',
  async () => await getOrdersApi()
);

export const createOrder = createAsyncThunk(
  'orders/create',
  async (ingredients: string[]) => {
    const responce = await orderBurgerApi(ingredients);
    return responce.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number) => {
    const responce = await getOrderByNumberApi(number);
    return responce.orders[0];
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      //fetchOrder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      //createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      //fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      });
  }
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
