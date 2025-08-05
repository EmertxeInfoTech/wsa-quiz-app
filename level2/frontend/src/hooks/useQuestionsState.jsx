import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "../App";
import { submitQuizApi } from "../store/thunks/questionsThunk";

function useQuestionsState() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const questionsState = useSelector((state) => state.questions);
  const {
    questions,
    activeQuestionId,
    loading,
    isValidatingAnswer,
    isSubmittingQuiz,
    error,
  } = questionsState;

  // On page load or refresh, after fetching questions, submit the quiz if all questions have been answered
  useEffect(() => {
    if (questions.length && !activeQuestionId && !loading && !error) {
      // We check is `activeQuestionId` is falsy despite questions array being non-empty.
      // This means all questions have been attempted according to our logic written in extraReducers.
      dispatch(submitQuizApi());
    }
  }, [activeQuestionId, dispatch, error, loading, questions.length]);

  // Redirect to result screen after quiz has been submitted
  useEffect(() => {
    if (!questions.length && !loading && !error && !isSubmittingQuiz) {
      // According to our logic in extraReducers, questions array will be set empty after quiz has been submitted.
      // questions array will also be empty on initial page load and when question fetching fails. So we check for loading and error states as well.
      // Loading will be true on initial page load. But false after quiz has been submitted.
      navigate(routes.protectedRoutes.result, { replace: true });
    }
  }, [error, isSubmittingQuiz, loading, navigate, questions.length]);

  const activeQuestion = useMemo(
    () => questions.find((question) => question._id === activeQuestionId),
    [activeQuestionId, questions]
  );
  const activeQuestionNumber = useMemo(
    () =>
      questions.findIndex((question) => question._id === activeQuestionId) + 1,
    [activeQuestionId, questions]
  );
  const totalQuestions = useMemo(() => questions.length, [questions.length]);

  const values = useMemo(
    () => ({
      activeQuestion,
      activeQuestionId,
      activeQuestionNumber,
      totalQuestions,
      isValidatingAnswer,
      isSubmittingQuiz,
      loading,
      error,
    }),
    [
      activeQuestion,
      activeQuestionId,
      activeQuestionNumber,
      error,
      isSubmittingQuiz,
      isValidatingAnswer,
      loading,
      totalQuestions,
    ]
  );

  return values;
}
export default useQuestionsState;
