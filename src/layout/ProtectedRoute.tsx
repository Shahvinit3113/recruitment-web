import { Navigate, Outlet } from "react-router-dom";
import { TokenService } from "@/api/services/TokenService";

const tokenService = new TokenService();

const ProtectedRoute = () => {
  const isAuthenticated = tokenService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
