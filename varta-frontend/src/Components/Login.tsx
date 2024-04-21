import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { fetchLoginStatus } from "../redux/reducers/loginCheckPage";
import { resetContact } from "../redux/reducers/chatContactNamePage";
import Loader from "../utils/Loader";
import { showPopUp } from "../utils/PopUpMessage";

interface loginResultType {
  status: number;
  loggedIn: boolean;
  message: string;
}

export default function Login() {
  const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;

  const dispatch = useAppDispatch();

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const handleButtonDisabled = () => {
    const username: string = (
      document.querySelector("[data-login-username]") as HTMLInputElement
    ).value;
    const password: string = (
      document.querySelector("[data-login-password]") as HTMLInputElement
    ).value;

    if (
      username === "" ||
      username === null ||
      password === "" ||
      password === null
    ) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);
    }
  };

  const loginUser = async () => {
    const username: string = (
      document.querySelector("[data-login-username]") as HTMLInputElement
    ).value;
    const password: string = (
      document.querySelector("[data-login-password]") as HTMLInputElement
    ).value;

    setLoginLoading(true);

    const res = await fetch(`${serverURI}/api/users/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const result: loginResultType = await res.json();

    setLoginLoading(false);

    if (result.status === 200 && result.loggedIn) {
      showPopUp({ success: true, message: result.message });
      dispatch(fetchLoginStatus());
    } else {
      console.log("Could not log in user.");
      showPopUp({
        success: false,
        message: result.message,
      });
    }
  };

  useEffect(() => {
    dispatch(resetContact());
  });

  return (
    <>
      {loginLoading && <Loader />}

      <div className="w-full h-full flex flex-col justify-start items-center bg-gradient-to-b from-[#159ac4] from-35% to-[#e4e7ea] to-35% px-2 sm:px-4">
        <div className="w-full flex justify-center items-center py-6 sm:pt-8 sm:pb-10">
          <h1 className="w-full max-w-[1000px] flex justify-start items-center text-[1.75rem] sm:text-[2rem] text-slate-100 font-bold">
            Varta - ChatApp
          </h1>
        </div>

        <div className="w-full max-w-[1000px] grow flex justify-center items-center bg-stone-50 rounded-[6px] mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginUser();
            }}
            className="w-[95%] max-w-[500px] flex flex-col justify-start items-center gap-3 rounded-[6px] backdrop-blur-[20px]"
          >
            <h2 className="w-full text-left text-[1.5rem] sm:text-[2rem] font-bold sm:font-semibold text-slate-800 mb-1">
              Login
            </h2>

            <div className="w-full text-left flex flex-col justify-start items-start gap-1">
              <label className="w-full font-semibold text-slate-800 text-[0.85rem] sm:text-[1rem] ">
                Username:
              </label>

              <input
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  handleButtonDisabled();
                }}
                data-login-username
                className="w-full p-2 text-[0.85rem] sm:text-[1rem] rounded-[2px] outline outline-2 outline-offset-2 outline-white border-b-black border-b-2 focus:border-b-blue-700 focus:border-b-2"
              />
            </div>

            <div className="w-full text-left flex flex-col justify-start items-start gap-1">
              <label className="w-full font-semibold text-slate-800 text-[0.85rem] sm:text-[1rem] ">
                Password:
              </label>

              <input
                type="password"
                onChange={(e) => {
                  e.preventDefault();
                  handleButtonDisabled();
                }}
                data-login-password
                className="w-full p-2 text-[0.85rem] sm:text-[1rem] rounded-[2px] outline outline-2 outline-offset-2 outline-white border-b-black border-b-2 focus:border-b-blue-700 focus:border-b-2"
              />
            </div>

            <button
              disabled={buttonDisabled}
              className="w-full flex justify-center items-center p-3 rounded-[2px] bg-[#159ac4] hover:bg-[#2c5b6b] text-slate-100 dont-bold sm:font-semibold text-[0.85rem] sm:text-[1rem] "
            >
              Login
            </button>

            <hr className="w-[70%] border-slate-400 my-2" />

            <Link
              to="/register"
              className="p-3 bg-teal-600 text-slate-100 font-bold sm:font-semibold rounded-[2px] text-[0.85rem] sm:text-[1rem] "
            >
              Create New Account
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
