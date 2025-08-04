import { useState, useMemo, useCallback } from "react";
import QuestionContext from "./QuestionContext";

// Create a provider for the context
function QuestionProvider({ children }) {
  // State to store questions
  const [questions, setQuestions] = useState([]);
  // State to manage active question ID
  const [activeQuestionId, setActiveQuestionId] = useState("");

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
  const correctAnswers = useMemo(() => {
    const noOfCorrectAnswers = questions.filter(
      (question) => question.isAnswerCorrect
    ).length;
    return noOfCorrectAnswers;
  }, [questions]);

  // Function to update hasAttempted and isAnswerCorrect for a single question
  const updateQuestionStatus = useCallback(
    (isAnswerCorrect) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question._id === activeQuestionId
            ? { ...question, hasAttempted: true, isAnswerCorrect }
            : question
        )
      );
    },
    [activeQuestionId]
  );

  // Function to update active question ID
  const activateNextQuestion = useCallback(() => {
    const currentIndex = questions.findIndex(
      (question) => question._id === activeQuestionId
    );
    if (currentIndex !== -1 && currentIndex + 1 < questions.length) {
      setActiveQuestionId(questions[currentIndex + 1]._id);
    }
  }, [activeQuestionId, questions]);

  // Function to add properties `hasAttempted` and `isAnswerCorrect`
  // to each question object and set first question as active.
  const processQuestions = useCallback(function (questionsApiResponse) {
    setQuestions(
      questionsApiResponse.map((question) => ({
        ...question,
        hasAttempted: false,
        isAnswerCorrect: false,
      }))
    );
    setActiveQuestionId(questionsApiResponse[0]._id);
  }, []);

  const contextValue = useMemo(
    () => ({
      activeQuestion,
      activeQuestionNumber,
      totalQuestions,
      correctAnswers,
      processQuestions,
      updateQuestionStatus,
      activateNextQuestion,
    }),
    [
      activateNextQuestion,
      activeQuestion,
      activeQuestionNumber,
      correctAnswers,
      processQuestions,
      totalQuestions,
      updateQuestionStatus,
    ]
  );

  return (
    <QuestionContext.Provider value={contextValue}>
      {children}
    </QuestionContext.Provider>
  );
}
export default QuestionProvider;
