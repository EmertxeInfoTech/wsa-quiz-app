import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./ResultDonut.css";

const ResultDonut = (props) => {
  const { score, totalQuestions } = props;
  const percentage = ((score / totalQuestions) * 100).toFixed(2);

  return (
    <div className="circular-progress-wrapper">
      <CircularProgressbarWithChildren value={percentage} strokeWidth={7.5}>
        <div className="score">{score}</div>
        <div className="score-label">Your Score</div>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default ResultDonut;
