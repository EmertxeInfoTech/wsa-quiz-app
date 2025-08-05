import { useMemo } from "react";
import useQuestionsState from "../../hooks/useQuestionsState";
import clsx from "clsx";

function ProgressBar() {
  const { activeQuestionNumber, totalQuestions } = useQuestionsState();

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
      value={activeQuestionNumber ?? 0}
      max={totalQuestions ?? 30}
      className={clsx("progress-bar", isFinalQuestion && "final-question")}
    >
      {/* Fallback content for browsers not supporting progress element */}
      {progressText}
    </progress>
  );
}

export default ProgressBar;
