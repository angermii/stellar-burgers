import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi } from '@api';

type TPasswordState = {
  isEmailSent: boolean;
  isPasswordReset: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: TPasswordState = {
  isEmailSent: false,
  isPasswordReset: false,
  loading: false,
  error: null
};

export const forgotPassword = createAsyncThunk(
  'password/forgot',
  async (email: string) => {
    await forgotPasswordApi({ email });
  }
);

export const resetPassword = createAsyncThunk(
  'password/reset',
  async (data: { password: string; token: string }) => {
    await resetPasswordApi(data);
  }
);

export const passwordSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {
    clearPasswordState: (state) => {
      state.isEmailSent = false;
      state.isPasswordReset = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // forgot
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.isEmailSent = true;
      })
      // reset
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Произошла ошибка';
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.isPasswordReset = true;
      });
  }
});

export const { clearPasswordState } = passwordSlice.actions;
export default passwordSlice.reducer;
