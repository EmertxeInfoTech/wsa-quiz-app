import Card from "../components/ui/Card";
import QuizLogo from "../components/ui/QuizLogo";
import UserImage from "../assets/user-image.png";
import { Link } from "react-router-dom";
import useAuthState from "../hooks/useAuthState";

function Home() {
  const { isTokenExpired } = useAuthState();
  return (
    <section className="home-section">
      <QuizLogo size="large" />
      <Card className="home-card">
        <div className="home-card-content-top">
          <img src={UserImage} alt="" />
          <h2 className="home-card-content-text">Are you ready?</h2>
        </div>
        <div className="home-card-content-bottom">
          {isTokenExpired && <p className="error">Your session has expired</p>}
          <Link to="/login" className="link-btn">
            Log In
          </Link>
          OR
          <Link to="/signup" className="link-btn">
            Sign Up
          </Link>
        </div>
      </Card>
    </section>
  );
}
export default Home;
