import { Navigate } from "react-router-dom";

function ProtectedRoute({ user, role, allowedRole, children }) {
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
