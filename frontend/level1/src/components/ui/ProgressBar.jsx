import { useMemo } from "react";
import useQuestionContext from "../../hooks/useQuestionContext";
import clsx from "clsx";

function ProgressBar() {
  // Our custom hook, `useQuestionContext`, returns an object that
  // contains `activeQuestionNumber` and `totalQuestions`,
  // which are used to calculate the progress of the quiz.
  const { activeQuestionNumber, totalQuestions } = useQuestionContext();

  const progressText = useMemo(
    // Use a percentage value upto 2 decimal characters
    () => `${((activeQuestionNumber / totalQuestions) * 100).toFixed(2)}%`,
    [activeQuestionNumber, totalQuestions]
  );

  const isFinalQuestion = useMemo(
    () => activeQuestionNumber === totalQuestions,
    [activeQuestionNumber, totalQuestions]
  );

  return (
    <progress
      value={activeQuestionNumber} // Current value
      max={totalQuestions}
      className={clsx("progress-bar", isFinalQuestion && "final-question")}
    >
      {/* Fallback content for browsers not supporting progress element */}
      {progressText}
    </progress>
  );
}

export default ProgressBar;
