import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ChildComponents {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ChildComponents) {
  const loggedIn: boolean = useAppSelector((state) => state?.loggedIn?.login);

  const location = useLocation();

  if (!loggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
