import useAuth from "@/useAuth";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
