/**
 * The `apiMiddleware` is a Redux middleware that checks for specific actions with a payload of "Invalid token".
 * If such an action is encountered, it dispatches the `logoutUser` action with a payload of `true`.
 * This action is typically triggered when an API request returns an Unauthorized response, indicating an invalid token.
 *
 * This middleware ensures that when the user's token becomes invalid, they are logged out of the application.
 */

import { logoutUser } from "./thunks/authThunks"; // Import your logout action

const apiMiddleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    if (action.payload === "Invalid token") {
      const isTokenInvalid = true;
      // Dispatch logout action
      dispatch(logoutUser(isTokenInvalid));
    }

    return next(action);
  };

export default apiMiddleware;
