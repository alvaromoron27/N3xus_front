// reducers/ebookReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBook: null, // Para almacenar el libro seleccionado
};

const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    selectBook: (state, action) => {
      state.selectedBook = action.payload;
    },
    clearStateEbookSelected: (state) => {
        state.selectedBook = null;
    },
    editBookReducer: (state, action) => {
      state.selectedBook = action.payload;
    },
  },
});

export const {
  selectBook,
  clearStateEbookSelected,
  editBookReducer
} = bookSlice.actions;

export default bookSlice.reducer;
