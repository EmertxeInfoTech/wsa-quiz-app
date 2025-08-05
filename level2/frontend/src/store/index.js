import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import questionsReducer from "./slices/questionsSlice";
import resultReducer from "./slices/resultSlice";
import apiMiddleware from "./apiMiddleware";

const store = configureStore({
  reducer: {
    auth: authReducer,
    questions: questionsReducer,
    result: resultReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware), // Add the custom `apiMiddleware`
});

export default store;
