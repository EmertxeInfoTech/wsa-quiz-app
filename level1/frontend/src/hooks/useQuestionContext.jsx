import { useContext } from "react";
import QuestionContext from "../store/QuestionContext";

// This is a custom hook called `useQuestionContext`
// that uses the `useContext` hook to access the `QuestionContext`
// provided by `QuestionProvider`. It returns the `contextValue` object from the `QuestionContext`.
function useQuestionContext() {
  return useContext(QuestionContext);
}
export default useQuestionContext;
