import { createAsyncThunk } from "@reduxjs/toolkit";
import { SIGNUP_ENDPOINT, LOGIN_ENDPOINT } from "../../utils/endpoints";
import apiRequest from "../../utils/apiRequest";

export const signupAPI = createAsyncThunk(
  "auth/signup",
  async (values, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: SIGNUP_ENDPOINT,
        method: "POST",
        includeAuth: false,
        body: {
          name: values.username,
          email: values.email,
          password: values.password,
        },
      });

      const resJson = await response.json();
      if (response.ok) {
        return resJson;
      } else {
        return thunkAPI.rejectWithValue(resJson.message);
      }
    } catch (error) {
      let sendError = "Could not register user, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);

export const loginAPI = createAsyncThunk(
  "auth/login",
  async (values, thunkAPI) => {
    try {
      const response = await apiRequest({
        endpoint: LOGIN_ENDPOINT,
        method: "POST",
        includeAuth: false,
        body: values,
      });

      const resJson = await response.json();

      if (response.ok) {
        const { accessToken } = resJson;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("email", values.email);
        return values.email;
      } else {
        return thunkAPI.rejectWithValue(resJson.message);
      }
    } catch (error) {
      let sendError = "Could not log in, something went wrong...";
      if ("message" in error) {
        sendError = error.message;
      }
      return thunkAPI.rejectWithValue(sendError);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  (isTokenExpired = false, _thunkAPI) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("email");
    return isTokenExpired;
  }
);
