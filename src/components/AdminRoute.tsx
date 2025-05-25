
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="w-16 h-16 border-4 border-t-blood-red border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return user && user.role === "admin" ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
