import { useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import useAuthState from "../hooks/useAuthState";
import { routes } from "../App";
import Button from "../components/ui/Button";
import { logoutUser } from "../store/thunks/authThunks";

// `ProtectedRoute` checks if a user is authenticated.
// If the user is authenticated, it renders a logout button and the element passed to it.
// If the user is not authenticated, it redirects to the home page.
function ProtectedRoute({ element }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthState();

  const handleLogout = useCallback(() => dispatch(logoutUser()), [dispatch]);

  return isAuthenticated ? (
    <>
      <Button
        onClick={handleLogout}
        className={clsx(
          "logout-btn",
          location.pathname === routes.protectedRoutes.result &&
            "result-logout-btn"
        )}
        tabIndex={-1}
        // Set tabIndex to -1 to prevent the button from being accessible, when navigating using the keyboard.
        // This is to make sure that the user consciously clicks the logout button and not mistakenly.
      >
        Logout
      </Button>
      {element}
    </>
  ) : (
    <Navigate to={routes.home} replace />
  );
}

export default ProtectedRoute;
