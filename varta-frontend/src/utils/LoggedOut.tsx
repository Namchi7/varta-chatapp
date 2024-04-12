import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

interface ChildComponents {
  children: React.ReactNode;
}

export default function LoggedOut({ children }: ChildComponents) {
  const loggedIn: boolean = useAppSelector((state) => state?.loggedIn?.login);

  const location = useLocation();

  if (loggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
