import useAuth from "@/useAuth";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
