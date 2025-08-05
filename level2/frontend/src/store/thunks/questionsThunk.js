import { createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../../utils/apiRequest";
import {
  FETCH_QUESTIONS_ENDPOINT,
  VALIDATE_ANSWERS_ENDPOINT,
  SUBMIT_QUIZ_ENDPOINT,
} from "../../utils/endpoints";

export const fetchQuestionsApi = createAsyncThunk(
  "questions/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: FETCH_QUESTIONS_ENDPOINT,
      });
      const jsonData = await response.json();

      if (response.ok) {
        return jsonData;
      } else {
        return thunkAPI.rejectWithValue(jsonData.message);
      }
    } catch (error) {
      let sendError = "Could not fetch questions, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);

export const validateAnswerApi = createAsyncThunk(
  "questions/validateAnswer",
  async (value, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: VALIDATE_ANSWERS_ENDPOINT,
        method: "POST",
        body: value,
      });

      const resJson = await response.json();
      if (response.ok) {
        return resJson;
      } else {
        return thunkAPI.rejectWithValue(resJson.message);
      }
    } catch (error) {
      let sendError = "Could not validate answer, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);

export const submitQuizApi = createAsyncThunk(
  "questions/submitQuiz",
  async (thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: SUBMIT_QUIZ_ENDPOINT,
        method: "POST",
      });

      const resJson = await response.json();
      if (response.ok) {
        return resJson;
      } else {
        return thunkAPI.rejectWithValue(resJson.message);
      }
    } catch (error) {
      let sendError = "Could not submit quiz, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);
