import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { session } = useAuth();

  if (session === undefined) {
    return <p>Loading...</p>;
  }
  return <>{session ? <>{children}</> : <Navigate to="/signin" />}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
