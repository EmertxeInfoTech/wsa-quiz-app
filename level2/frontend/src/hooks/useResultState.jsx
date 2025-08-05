import { useMemo } from "react";
import { useSelector } from "react-redux";

function useResultState() {
  const { status, incorrectAnswers, correctAnswers, attempts, loading, error } =
    useSelector((state) => state.result);

  const [noOfCorrectAnswers, noOfIncorrectAnswers] = useMemo(() => {
    const correct = correctAnswers?.length ?? 0;
    const incorrect = incorrectAnswers?.length ?? 0;
    return [correct, incorrect];
  }, [correctAnswers?.length, incorrectAnswers?.length]);

  const totalNoOfQuestions = useMemo(
    () => noOfCorrectAnswers + noOfIncorrectAnswers,
    [noOfCorrectAnswers, noOfIncorrectAnswers]
  );

  const values = useMemo(
    () => ({
      incorrectAnswers,
      correctAnswers,
      attempts,
      noOfCorrectAnswers,
      noOfIncorrectAnswers,
      totalNoOfQuestions,
      status,
      loading,
      error,
    }),
    [
      attempts,
      correctAnswers,
      error,
      incorrectAnswers,
      loading,
      noOfCorrectAnswers,
      noOfIncorrectAnswers,
      status,
      totalNoOfQuestions,
    ]
  );

  return values;
}

export default useResultState;
