import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "./ui/Card";
import clsx from "clsx";
import Button from "./ui/Button";
import useQuestionContext from "../hooks/useQuestionContext";
import NextArrow from "../assets/chevron-left-rounded.svg";
import CorrectCheckmark from "../assets/white-checkmark.svg";
import IncorrectCross from "../assets/incorrect-cross.svg";
import handleError from "../utils/handleError";
import validateAnswerAPI from "../api/validateAnswer";

function NextArrowIcon() {
  return <img src={NextArrow} alt="Next Question" />;
}

function QuestionContent(props) {
  const { showResultScreen } = props;
  // Use our custom hook that returns the context values
  const {
    activeQuestion, // Current question object
    activeQuestionNumber, // Current question number
    totalQuestions, // Total number of questions
    updateQuestionStatus, // Function to update whether user answered correctly for active question
    activateNextQuestion, // Move on to next question
  } = useQuestionContext();
  const [userSelectedOption, setUserSelectedOption] = useState(""); // State to prevent user from clicking more than one option
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset user selected option when active question changes
    setUserSelectedOption("");
  }, [activeQuestion._id]);

  const hasAttempted = useMemo(
    () => Boolean(userSelectedOption),
    [userSelectedOption]
  );
  const isFinalQuestion = useMemo(
    () => activeQuestionNumber === totalQuestions,
    [activeQuestionNumber, totalQuestions]
  );

  const handleResponse = useCallback(
    function (responseData) {
      // Check API response to find if answer is correct
      const isAnswerCorrect = responseData.status === 1;
      updateQuestionStatus(isAnswerCorrect);
    },
    [updateQuestionStatus]
  );

  const handleClick = useCallback(
    (selectedOption) => {
      console.log(selectedOption);
      setUserSelectedOption(selectedOption.id);
      // Call API to validate answer
      validateAnswerAPI(
        activeQuestion._id,
        selectedOption,
        handleResponse,
        handleError,
        setLoading
      );
    },

    [activeQuestion._id, handleResponse]
  );

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
              isThisSelected && activeQuestion.isAnswerCorrect; // This will only be avaiable after the API call
            const isOptionIncorrect =
              isThisSelected && !loading && !activeQuestion.isAnswerCorrect; // This will only be avaiable after the API call
            const isLoading = isThisSelected && loading; // To apply loading state on selected option
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
                disabled={hasAttempted} // Disable any option after user has answered
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
        {isFinalQuestion ? (
          <Button
            onClick={showResultScreen}
            disabled={!activeQuestion.hasAttempted}
          >
            Submit
          </Button>
        ) : (
          <Button
            onClick={activateNextQuestion}
            disabled={!activeQuestion.hasAttempted}
            icon={<NextArrowIcon />}
            iconPosition="right"
          >
            Next
          </Button>
        )}
      </Card>
    </div>
  );
}

export default QuestionContent;
