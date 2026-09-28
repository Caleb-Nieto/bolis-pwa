import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "@hooks/useAuth"; // Gestor de estado

export const ProtectedRoute = () => {
    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};