import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../utils/Loader";
import { showPopUp } from "../utils/PopUpMessage";

interface registerResultType {
  status: number;
  username: string;
  success: boolean;
  message: string;
}

interface usernameAvailableResultType {
  status: 200;
  message: string;
  isAvailable: boolean;
}

export default function Register() {
  const serverURI = process.env.REACT_APP_SERVER_URI;

  const [registerLoading, setRegisterLoading] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [username, setUsername] = useState("");

  const matchPasswords = () => {
    const password: string = (document.querySelector(
      "[data-register-password]"
    ) as HTMLInputElement)!.value;
    const cPassword: string = (document.querySelector(
      "[data-register-c-password]"
    ) as HTMLInputElement)!.value;

    if (password === cPassword) {
      setPasswordMatch(true);

      password === "" || password === null
        ? setButtonDisabled(true)
        : setButtonDisabled(false);
    } else {
      setPasswordMatch(false);
      setButtonDisabled(true);
    }
  };

  const clearRegisterForm = () => {
    (document.querySelector("[data-register-name]") as HTMLInputElement).value =
      "";
    (
      document.querySelector("[data-register-username]") as HTMLInputElement
    ).value = "";
    (
      document.querySelector("[data-register-password]") as HTMLInputElement
    ).value = "";
    (
      document.querySelector("[data-register-c-password]") as HTMLInputElement
    ).value = "";
  };

  const registerNewUser = async () => {
    const name: string = (
      document.querySelector("[data-register-name]") as HTMLInputElement
    ).value;
    const registerUsername: string = (
      document.querySelector("[data-register-username]") as HTMLInputElement
    ).value;
    const password: string = (
      document.querySelector("[data-register-password]") as HTMLInputElement
    ).value;

    setRegisterLoading(true);

    const res = await fetch(`${serverURI}/api/users/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        username: registerUsername,
        password: password,
      }),
    });

    const result: registerResultType = await res.json();

    setRegisterLoading(false);

    if (result.status === 200 && result.success) {
      console.log("User created.");

      showPopUp({
        success: true,
        message: result.message,
      });

      clearRegisterForm();
    } else {
      console.log("Could not create user.");

      showPopUp({
        success: false,
        message: result.message,
      });
    }
  };

  useEffect(() => {
    const check = setTimeout(async () => {
      if (username.length > 4) {
        const res = await fetch(
          `${serverURI}/api/users/username-available?username=${username}`,
          {
            method: "GET",
          }
        );

        const result: usernameAvailableResultType = await res.json();

        if (result.status === 200) setUsernameAvailable(result.isAvailable);
      }
    }, 1500);

    return () => clearTimeout(check);
  }, [username]);

  useEffect(() => {
    matchPasswords();
  }, []);

  return (
    <>
      {registerLoading && <Loader />}

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
              registerNewUser();
            }}
            className="w-[95%] max-w-[500px] flex flex-col justify-start items-center gap-3 rounded-[6px] backdrop-blur-[20px]"
          >
            <h2 className="w-full text-left text-[1.5rem] sm:text-[2rem] font-bold sm:font-semibold text-slate-800 sm:mb-1">
              Register
            </h2>

            <div className="w-full text-left flex flex-col justify-start items-start gap-1">
              <label className="w-full font-semibold text-slate-800 text-[0.85rem] sm:text-[1rem] ">
                Name:
              </label>

              <input
                type="text"
                data-register-name
                className="w-full p-2 text-[0.85rem] sm:text-[1rem] rounded-[2px] outline-offset-2 outline-2 outline outline-white border-b-black border-b-2 focus:border-b-blue-700 focus:border-b-2 focus:outline-white "
              />
            </div>

            <div className="w-full text-left flex flex-col justify-start items-start gap-1">
              <label className="w-full font-semibold text-slate-800 text-[0.85rem] sm:text-[1rem] ">
                Username:
              </label>

              <li className="w-full list-inside text-left text-slate-700 text-[0.65rem] sm:text-[0.75rem] ">
                {`Username minimum length is 5 characters (Alphanumeric) and start with alphabet.`}
              </li>

              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                minLength={5}
                pattern="[a-z][a-z0-9]{4,}"
                data-register-username
                className={
                  "w-full p-2 text-[0.85rem] sm:text-[1rem] rounded-[2px] outline outline-2 outline-offset-2 border-b-black border-b-2 focus:border-b-blue-700 focus:border-b-2 invalid:outline-red-500 " +
                  (usernameAvailable
                    ? "outline-white focus:outline-white"
                    : "outline-red-500 focus:outline-red-500")
                }
              />

              {!usernameAvailable && (
                <p className="w-full text-left text-red-500 text-[0.65rem] sm:text-[0.75rem] ">
                  Username Not Available.
                </p>
              )}
            </div>

            <div className="w-full text-left flex flex-col justify-start items-start gap-1">
              <label className="w-full font-semibold text-slate-800 text-[0.85rem] sm:text-[1rem] ">
                Password:
              </label>

              <li className="w-full list-inside text-left text-slate-700 text-[0.65rem] sm:text-[0.75rem] ">
                {`Password minimum length is 5 characters and no whitespaces.`}
              </li>

              <input
                type="password"
                onChange={() => matchPasswords()}
                minLength={5}
                pattern="^(?=.*[a-z])[a-zA-Z0-9!@#$%^&*()-_=+]{5,}$"
                data-register-password
                className={
                  "w-full p-2 text-[0.85rem] sm:text-[1rem] rounded-[2px] outline outline-2 outline-offset-2 outline-white border-b-black border-b-2 focus:border-b-blue-700 focus:border-b-2 invalid:outline-red-500 "
                }
              />
            </div>

            <div className="w-full text-left flex flex-col justify-start items-start gap-1">
              <label className="w-full font-semibold text-slate-800 text-[0.85rem] sm:text-[1rem] ">
                Confirm Password:
              </label>

              <input
                type="password"
                onChange={() => matchPasswords()}
                minLength={5}
                data-register-c-password
                className={
                  "w-full p-2 text-[0.85rem] sm:text-[1rem] rounded-[2px] outline outline-2 outline-offset-2 border-b-black border-b-2 focus:border-b-blue-700 focus:border-b-2" +
                  (passwordMatch
                    ? " outline-white focus:outline-white"
                    : " outline-red-500 focus:outline-red-500")
                }
              />

              {!passwordMatch && (
                <p className="w-full text-left text-red-500 text-[0.65rem] sm:text-[0.75rem] ">
                  Password Does Not Match.
                </p>
              )}
            </div>

            <button
              disabled={buttonDisabled}
              className="w-full flex justify-center items-center p-3 rounded-[2px] bg-[#159ac4] hover:bg-[#2c5b6b] text-slate-100 font-bold sm:font-semibold text-[0.85rem] sm:text-[1rem] "
            >
              Create Account
            </button>

            <hr className="w-[70%] border-slate-400 my-2" />

            <Link
              to="/login"
              className="p-3 bg-teal-600 text-[0.85rem] sm:text-[1rem] text-slate-100 font-bold sm:font-semibold rounded-[2px] "
            >
              Log In To Existing Account
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}
