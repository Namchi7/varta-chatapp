import { Dispatch, SetStateAction } from "react";

import logout from "../assets/images/logout.png";
import avatarPlaceholder from "../assets/images/avatar-placeholder.png";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchLoginStatus } from "../redux/reducers/loginCheckPage";
import { showPopUp } from "../utils/PopUpMessage";

interface PropsType {
  setLogoutLoading: Dispatch<SetStateAction<boolean>>;
}

interface logoutResultType {
  loggedIn: boolean;
  username: string;
}

export default function Header(props: PropsType) {
  const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;
  const dispatch = useAppDispatch();

  const nameOfUser = useAppSelector((state) => state?.loggedIn?.name);

  const setLogoutCookie = useCallback(() => {
    dispatch(fetchLoginStatus());
  }, []);

  const logoutUser = async () => {
    props.setLogoutLoading(true);

    const res = await fetch(`${serverURI}/logout`, {
      method: "GET",
      credentials: "include",
    });

    const result: logoutResultType = await res.json();

    props.setLogoutLoading(false);

    if (!result?.loggedIn) {
      showPopUp({ success: true, message: "User logged-out." });
      setLogoutCookie();
    } else {
      showPopUp({ success: false, message: "Could not log out user." });
    }
  };

  return (
    <div className="w-full flex justify-between items-center bg-[#159AC4]  px-2 sm:px-4 py-1 ">
      <div className="text-[1.75rem] font-semibold text-[#f5f5f5]">Varta</div>

      <div className="flex flex-nowrap justify-end items-center gap-2">
        <p className="text-[#f5f5f5] text-[0.75] sm:text-[0.95rem] font-semibold ">
          {nameOfUser}
        </p>

        <div className="w-8 h-8 rounded-[50%] bg-slate-200 overflow-hidden">
          <img src={avatarPlaceholder} alt="User" className="w-full h-full" />
        </div>

        <img
          src={logout}
          alt="Logout"
          onClick={(e) => {
            e.preventDefault();
            logoutUser();
          }}
          className="h-6 cursor-pointer"
        />
      </div>
    </div>
  );
}
