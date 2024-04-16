import { useAppDispatch } from "./redux/hooks";
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LoggedOut from "./utils/LoggedOut";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import ProtectedRoute from "./utils/ProtectedRoute";

import { fetchLoginStatus } from "./redux/reducers/loginCheckPage";
import PopUpMessage from "./utils/PopUpMessage";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchLoginStatus());
  }, []);

  return (
    <div className="h-[100svh] w-full sm:h-full flex flex-nowrap justify-start items-center overflow-x-hidden">
      <PopUpMessage />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <LoggedOut>
              <Login />
            </LoggedOut>
          }
        />

        <Route
          path="/register"
          element={
            <LoggedOut>
              <Register />
            </LoggedOut>
          }
        />
      </Routes>
    </div>
  );
}
