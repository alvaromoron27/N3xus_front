// reducers/ebookReducer.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBook: null,
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
    addCommentToSelectedBook: (state, action) => {
      if (state.selectedBook && state.selectedBook.comments) {
        state.selectedBook.comments.push(action.payload);
      } else if (state.selectedBook) {
        state.selectedBook.comments = [action.payload];
      }
    },
    addReplyToComment: (state, action) => {
      state.selectedBook = action.payload;
    },
  },
});

export const {
  selectBook,
  clearStateEbookSelected,
  editBookReducer,
  addCommentToSelectedBook,
  addReplyToComment,
} = bookSlice.actions;

export default bookSlice.reducer;
