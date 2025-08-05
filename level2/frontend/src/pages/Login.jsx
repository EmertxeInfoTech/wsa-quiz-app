import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import QuestionBubble from "../assets/question-bubble.png";
import QuizLogo from "../components/ui/QuizLogo";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { loginAPI } from "../store/thunks/authThunks";
import useAuthState from "../hooks/useAuthState";
import { useEffect, useMemo } from "react";
import { routes } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading, error, email } = useAuthState();

  // Redirect to welcome page if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.protectedRoutes.welcome);
    }
  }, [isAuthenticated, navigate]);

  const validationSchema = useMemo(() => {
    const schema = Yup.object().shape({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
    });
    return schema;
  }, []);

  const formik = useFormik({
    initialValues: {
      email: email || "",
      password: "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission logic here
      // You can use the values object (email & password)
      dispatch(loginAPI(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="login-section">
      <QuizLogo size="large" />
      <Card className="login-card">
        <img src={QuestionBubble} alt="" />
        <div className="login-card-text">
          <h2 className="primary">User Login</h2>
          <h3>Welcome Back</h3>
        </div>
        <div className="login-card-inputs">
          {Boolean(error) && <p className="error response-error">{error}</p>}
          <InputField
            name="email"
            type="email"
            placeholder="Email Id"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.email}
            error={formik.errors.email}
          />
          <InputField
            name="password"
            type="password"
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.password}
            error={formik.errors.password}
          />
          <Button
            type="submit"
            size="large"
            loading={loading}
            loadingText="Logging In..."
          >
            Log In
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default Login;
