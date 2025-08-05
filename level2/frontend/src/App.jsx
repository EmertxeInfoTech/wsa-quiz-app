import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResultScreen from "./pages/ResultScreen";
import ProtectedRoute from "./pages/ProtectedRoute";
import WelcomeScreen from "./pages/WelcomeScreen";
import QuestionScreen from "./pages/QuestionScreen";

/**
 * The `routes` object is a collection of all the paths in the application.
 * It's useful to have this object in one place, as it provides a clear and
 * centralized way to manage and update the routes of the application.
 * It also helps to avoid hardcoding the routes throughout the codebase.
 * By using this object, it's easier to add, remove or change routes in the
 * future, without having to search and update each occurrence of each route.
 */
export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  protectedRoutes: {
    // Protected routes can only be accessed when the user is authenticated.
    welcome: "/welcome",
    questions: "/questions",
    result: "/result",
  },
};

const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Home />,
  },
  {
    path: routes.login,
    element: <Login />,
  },
  { path: routes.signup, element: <Signup /> },
  {
    path: routes.protectedRoutes.welcome,
    element: <ProtectedRoute element={<WelcomeScreen />} />,
  },
  {
    path: routes.protectedRoutes.questions,
    element: <ProtectedRoute element={<QuestionScreen />} />,
  },
  {
    path: routes.protectedRoutes.result,
    element: <ProtectedRoute element={<ResultScreen />} />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
