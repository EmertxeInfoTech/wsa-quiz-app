import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";
import {
  COMPLETED_QUIZ_ENDPOINT,
  QUIZ_ATTEMPTS_ENDPOINT,
} from "../../utils/endpoints";

export const fetchCompletedQuizApi = createAsyncThunk(
  "result/fetchQuiz",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: COMPLETED_QUIZ_ENDPOINT,
      });

      const jsonData = await response.json();
      if (response.ok) {
        return jsonData;
      } else {
        return thunkAPI.rejectWithValue(jsonData.message);
      }
    } catch (error) {
      let sendError = "Could not fetch result, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);

export const fetchAttemptsApi = createAsyncThunk(
  "result/fetchAttempts",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: QUIZ_ATTEMPTS_ENDPOINT,
      });

      const jsonData = await response.json();
      if (response.ok) {
        return jsonData.attempts;
      } else {
        return thunkAPI.rejectWithValue(jsonData.message);
      }
    } catch (error) {
      let sendError = "Could not fetch result, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);
