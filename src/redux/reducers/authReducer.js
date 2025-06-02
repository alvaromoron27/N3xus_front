import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  isConfirmedAccount: false,
  user: null,
  canResend: true,
  resendTimer: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isConfirmedAccount = false;
    },
    confirmAccountReducer: (state) => {
      state.isConfirmedAccount = true;
    },
    register: (state) => {
      state.isConfirmedAccount = false;
    },
    sendConfirmationEmail: (state) => {
      state.canResend = false;
      state.resendTimer = 180;
    },
    decrementResendTimer: (state) => {
      if (state.resendTimer > 0) {
        state.resendTimer -= 1;
      } else {
        state.canResend = true;
      }
    },
    editUserField: (state, action) => {
      const { field, value } = action.payload;
      state.user[field] = value;
    },
    addSavedBook: (state, action) => {
      if (state.user && state.user.LibrosGuardados) {
        state.user.LibrosGuardados.push(action.payload);
      }
    },
    deleteSavedBookReducer: (state, action) => {
      if (state.user && state.user.LibrosGuardados) {
        // Encuentra el índice del ebook a eliminar
        const index = state.user.LibrosGuardados.findIndex(
          (ebook) => ebook.id === action.payload.id
        );
        // Si se encuentra el índice, elimina el ebook del array usando splice
        if (index !== -1) {
          state.user.LibrosGuardados.splice(index, 1);
        }
      }
    },
  },
});

export const {
  register,
  login,
  logout,
  confirmAccountReducer,
  sendConfirmationEmail,
  decrementResendTimer,
  editUserField,
  addSavedBook,
  deleteSavedBookReducer,
} = authSlice.actions;

export default authSlice.reducer;