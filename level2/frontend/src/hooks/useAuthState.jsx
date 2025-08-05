import { useSelector } from "react-redux";

function useAuthState() {
  const authState = useSelector((state) => state.auth);
  return authState;
}

export default useAuthState;
