import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import QuizLogo from "./ui/QuizLogo";
import RestartIcon from "../assets/restart-icon.svg";
import { routes } from "../App";
import { useDispatch } from "react-redux";
import { init } from "../store/slices/questionsSlice";

function RestartIconFC() {
  return <img src={RestartIcon} alt="" />;
}

function ResultHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRestart = useCallback(
    function () {
      dispatch(init()); // Set loading as true to prevent being redirected to result page again
      navigate(routes.protectedRoutes.questions);
    },
    [dispatch, navigate]
  );

  return (
    <header className="result-section-header">
      <QuizLogo size="small" />
      <Button
        onClick={handleRestart}
        icon={<RestartIconFC />}
        iconPosition="right"
        className="restart-btn"
      >
        Restart
      </Button>
    </header>
  );
}

export default ResultHeader;
