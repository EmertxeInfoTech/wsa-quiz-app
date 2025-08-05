import { useFormik } from "formik";
import * as Yup from "yup";
import Card from "../components/ui/Card";
import UserImage from "../assets/user-image.png";
import QuizLogo from "../components/ui/QuizLogo";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import useAuthState from "../hooks/useAuthState";
import { routes } from "../App";
import { signupAPI } from "../store/thunks/authThunks";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { email, loading, error } = useAuthState();

  useEffect(() => {
    // After successful signup, redirect to login page
    if (email) {
      navigate(routes.login);
    }
  }, [email, navigate]);

  const validationSchema = useMemo(() => {
    const schema = Yup.object().shape({
      username: Yup.string().trim().required("User Name is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
      confirmPassword: Yup.string()
        .trim()
        .required("Re-enter your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
    });
    return schema;
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission logic here
      // You can use the values object (username, email, password)
      dispatch(signupAPI(values));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="signup-section">
      <QuizLogo size="large" />
      <Card className="signup-card">
        <img src={UserImage} alt="" />
        <div className="signup-card-inputs">
          {Boolean(error) && <p className="error response-error">{error}</p>}
          <InputField
            name="username"
            type="text"
            placeholder="User Name"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.username}
            error={formik.errors.username}
          />
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
          <InputField
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            touched={formik.touched.confirmPassword}
            error={formik.errors.confirmPassword}
          />
          <Button
            type="submit"
            size="large"
            loading={loading}
            loadingText="Signing Up..."
          >
            Submit
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default Signup;
