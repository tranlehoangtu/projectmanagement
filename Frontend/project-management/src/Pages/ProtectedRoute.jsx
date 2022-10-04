import { Navigate, useLocation } from "react-router-dom";
const ProtectedRoute = ({ children }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const location = useLocation();

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
