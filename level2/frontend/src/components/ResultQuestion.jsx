import clsx from "clsx";

function ResultQuestion(props) {
  const { question, number, displayCorrectAnswers } = props;
  return (
    <>
      <div className="question">
        <span>{String(number).padStart(2, "0") + ". "}</span>
        <div className="question-answer">
          <p>{question.question}</p>
          <h4 className="selected-answer-text">Selected Answer</h4>
          <div
            className={clsx(
              "display-answer",
              displayCorrectAnswers ? "correct-answer" : "incorrect-answer"
            )}
          >
            <span>{question.submitted_answer.id}. </span>
            <span>{question.submitted_answer.value}</span>
          </div>
          {!displayCorrectAnswers && (
            <>
              <h4 className="correct-answer-text">Correct Answer</h4>
              <div className={clsx("display-answer", "correct-answer")}>
                <span>{question.answer.id}. </span>
                <span>{question.answer.value}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ResultQuestion;
