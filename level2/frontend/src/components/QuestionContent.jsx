import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "./ui/Card";
import clsx from "clsx";
import Button from "./ui/Button";
import useQuestionsState from "../hooks/useQuestionsState";
import NextArrow from "../assets/chevron-left-rounded.svg";
import CorrectCheckmark from "../assets/white-checkmark.svg";
import IncorrectCross from "../assets/incorrect-cross.svg";
import {
  fetchQuestionsApi,
  submitQuizApi,
  validateAnswerApi,
} from "../store/thunks/questionsThunk";
import { activateNextQuestion } from "../store/slices/questionsSlice";

function NextArrowIcon() {
  return <img src={NextArrow} alt="Next Question" />;
}

function QuestionContent() {
  const dispatch = useDispatch();

  // Use our custom hook that returns the redux state values
  const {
    activeQuestion, // Current question object
    activeQuestionId, // Current question ID
    activeQuestionNumber, // Current question number
    totalQuestions, // Total number of questions
    isValidatingAnswer, // Flag to show if an answer is being validated
    isSubmittingQuiz, // Flag to show if quiz is being submitted
    loading, // Flag to show if questions are being fetched
    error, // Error message if an error occured
  } = useQuestionsState();
  const [userSelectedOption, setUserSelectedOption] = useState(""); // State to prevent user from clicking more than one option

  useEffect(() => {
    // Fetch questions on `/questions` route load
    dispatch(fetchQuestionsApi());
  }, [dispatch]);

  useEffect(() => {
    // Reset user selected option when active question changes
    setUserSelectedOption("");
  }, [activeQuestion?._id]);

  const hasAttempted = useMemo(
    () => Boolean(userSelectedOption),
    [userSelectedOption]
  );
  const isFinalQuestion = useMemo(
    () => activeQuestionNumber === totalQuestions,
    [activeQuestionNumber, totalQuestions]
  );

  const handleClick = useCallback(
    (selectedOption) => {
      setUserSelectedOption(selectedOption.id);
      // Validate selected answer
      dispatch(
        validateAnswerApi({
          id: activeQuestionId,
          answer: selectedOption,
        })
      );
    },
    [activeQuestionId, dispatch]
  );

  const moveForward = useCallback(
    function () {
      if (isFinalQuestion) {
        dispatch(submitQuizApi());
      } else {
        dispatch(activateNextQuestion());
      }
    },
    [dispatch, isFinalQuestion]
  );

  if (loading || !activeQuestionId) {
    return <div className="question-content font-large">Loading...</div>;
  }
  if (Boolean(error)) {
    return (
      <div className="question-content error response-error">
        <p className="font-large">{error}</p>
      </div>
    );
  }

  return (
    <div className="question-content">
      <Card className="question-card">
        <div className="question-number">
          {activeQuestionNumber}/{totalQuestions}
        </div>
        <p className="question-text">{activeQuestion.question}</p>
        <div className="question-options">
          {activeQuestion.options.map((option) => {
            const isThisSelected = option.id === userSelectedOption;
            const isOptionCorrect =
              isThisSelected && activeQuestion.answer_status === "right"; // This will only be avaiable after the validate answer API call
            const isOptionIncorrect =
              isThisSelected &&
              !isValidatingAnswer &&
              activeQuestion.answer_status === "wrong"; // This will only be avaiable after the validate answer API call
            const isLoading = isThisSelected && isValidatingAnswer; // To apply loading state on selected option
            return (
              <button
                className={clsx(
                  "option",
                  !hasAttempted && "not-answered",
                  isLoading && "loading",
                  isOptionCorrect && "correct-answer",
                  isOptionIncorrect && "incorrect-answer"
                )}
                key={activeQuestion._id + "-" + option.id}
                onClick={() => handleClick(option)}
                disabled={hasAttempted} // Disable all options after user has answered
              >
                {option.value}
                {isThisSelected ? (
                  <span
                    className={clsx(
                      isOptionCorrect && "correct-radio",
                      isOptionIncorrect && "incorrect-radio"
                    )}
                  >
                    {isOptionCorrect && (
                      <img src={CorrectCheckmark} alt="Correct answer" />
                    )}
                    {isOptionIncorrect && (
                      <img src={IncorrectCross} alt="Incorrect answer" />
                    )}
                  </span>
                ) : (
                  <span className="unattempted-radio" />
                )}
              </button>
            );
          })}
        </div>
        <Button
          onClick={moveForward}
          disabled={!activeQuestion.attempted}
          icon={isFinalQuestion ? null : <NextArrowIcon />}
          iconPosition="right"
          loading={isSubmittingQuiz}
          loadingText="Submitting..."
        >
          {isFinalQuestion ? "Submit" : "Next"}
        </Button>
      </Card>
    </div>
  );
}

export default QuestionContent;
