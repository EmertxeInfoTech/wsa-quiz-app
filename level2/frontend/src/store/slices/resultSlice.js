import { createSlice } from "@reduxjs/toolkit";
import { fetchAttemptsApi, fetchCompletedQuizApi } from "../thunks/resultThunk";

const initialState = {
  status: false,
  incorrectAnswers: [],
  correctAnswers: [],
  attempts: 0,
  loading: true,
  error: null,
};
const resultSlice = createSlice({
  name: "result",
  initialState,
  extraReducers(builder) {
    builder.addCase(fetchCompletedQuizApi.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.status = false;
    });
    builder.addCase(fetchCompletedQuizApi.fulfilled, (state, action) => {
      state.loading = false;
      state.status = action.payload.status;
      state.correctAnswers = action.payload.correct_questions;
      state.incorrectAnswers = action.payload.incorrect_questions;
    });
    builder.addCase(fetchCompletedQuizApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(fetchAttemptsApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAttemptsApi.fulfilled, (state, action) => {
      state.loading = false;
      state.attempts = action.payload;
    });
    builder.addCase(fetchAttemptsApi.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});
export default resultSlice.reducer;
