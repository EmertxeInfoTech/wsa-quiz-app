import { createSlice } from "@reduxjs/toolkit";
import {
  fetchQuestionsApi,
  submitQuizApi,
  validateAnswerApi,
} from "../thunks/questionsThunk";

const initialState = {
  questions: [],
  activeQuestionId: "",
  loading: true,
  isValidatingAnswer: false,
  isSubmittingQuiz: false,
  error: null,
};
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    activateNextQuestion(state) {
      const currentIndex = state.questions.findIndex(
        (question) => question._id === state.activeQuestionId
      );
      if (currentIndex !== -1 && currentIndex + 1 < state.questions.length) {
        state.activeQuestionId = state.questions[currentIndex + 1]._id;
      }
    },
    init(state) {
      state.loading = true;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchQuestionsApi.pending, (state) => {
      state.questions = [];
      state.activeQuestionId = "";
      state.loading = true;
      state.isValidatingAnswer = false;
      state.error = null;
    });
    builder.addCase(fetchQuestionsApi.fulfilled, (state, action) => {
      state.questions = action.payload.questions;
      const activeQuestionId =
        action.payload.questions?.find((question) => !question.attempted)
          ?._id || "";
      state.activeQuestionId = activeQuestionId;
      state.loading = false;
    });
    builder.addCase(fetchQuestionsApi.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(validateAnswerApi.pending, (state) => {
      state.isValidatingAnswer = true;
      state.error = null;
    });
    builder.addCase(validateAnswerApi.fulfilled, (state, action) => {
      state.isValidatingAnswer = false;
      const isCorrect = action.payload.status === 1;
      const activeQuestionId = state.activeQuestionId;
      const activeQuestionIndex = state.questions.findIndex(
        (question) => question._id === activeQuestionId
      );
      state.questions[activeQuestionIndex].attempted = true;
      state.questions[activeQuestionIndex].answer_status = isCorrect
        ? "right"
        : "wrong";
    });
    builder.addCase(validateAnswerApi.rejected, (state, action) => {
      state.isValidatingAnswer = false;
      state.error = action.payload;
    });
    builder.addCase(submitQuizApi.pending, (state) => {
      state.error = null;
      state.isSubmittingQuiz = true;
    });
    builder.addCase(submitQuizApi.fulfilled, (state, action) => {
      state.isSubmittingQuiz = false;
      if (action.payload.status) {
        state.questions = [];
        state.activeQuestionId = "";
      } else {
        state.error = "Could not submit quiz, something went wrong...";
      }
    });
    builder.addCase(submitQuizApi.rejected, (state, action) => {
      state.error = action.payload;
      state.isSubmittingQuiz = false;
    });
  },
});

export const { activateNextQuestion, init } = questionsSlice.actions;
export default questionsSlice.reducer;
