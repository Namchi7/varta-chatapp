import ChatContact from "./ChatContact";
// import chatContactData from "../assets/chatContacts.json";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useCallback, useEffect, useState } from "react";
import { setContact } from "../redux/reducers/chatContactNamePage";
import { fetchChatContactsData } from "../redux/reducers/getChatContactsPage";
import { fetchChatMessagesData } from "../redux/reducers/getChatMessagesPage";

export interface dataForChat {
  _id: string;
  contact_username: string;
  text: string;
  time: string;
  unseen_count: number;
  contact_name: string;
}

interface userResultType {
  username: string;
  name: string;
}

export default function ChatContacts() {
  const dispatch = useAppDispatch();

  const [searchUsername, setSearchUsername] = useState("");
  const [usernameResult, setUsernameResult] = useState([]);

  const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;

  // const contactData: dataForChat[] = chatContactData;
  const contactData: dataForChat[] = useAppSelector(
    (state) => state?.chatContacts?.data
  );
  const username: string = useAppSelector((state) => state?.loggedIn?.username);
  const contactName: string = useAppSelector(
    (state) => state?.chatContact?.name
  );

  const searchUsernameData = async () => {
    const res = await fetch(
      `${serverURI}/find-username-info?username=${searchUsername}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await res.json();

    setUsernameResult(result);
  };

  const openNewChat = useCallback((name: string, contact: string) => {
    dispatch(setContact({ name, username: contact }));
    dispatch(fetchChatContactsData());
    dispatch(fetchChatMessagesData(contact));

    const searchUsernameInput = document.querySelector(
      "[data-search-username-input]"
    ) as HTMLInputElement;

    searchUsernameInput.value = "";
    setSearchUsername("");
  }, []);

  useEffect(() => {
    const searchUser = setTimeout(() => {
      if (searchUsername !== "") {
        searchUsernameData();
      } else {
        setUsernameResult([]);
      }
    }, 1000);

    return () => clearTimeout(searchUser);
  }, [searchUsername]);

  return (
    <div
      className={
        "w-full sm:w-[20%] sm:max-w-[300px] sm:min-w-[250px] h-full rounded-[0.75rem] shrink-0 sm:flex flex-col justify-start items-start bg-slate-200 overflow-x-hidden " +
        (contactName === "" ? "flex" : "hidden")
      }
    >
      <div className="w-full p-3 py-2 flex flex-nowrap justify-start items-start bg-[#159AC4] text-[#ffffff] text-[1.25rem] font-semibold">
        Chats
      </div>

      <div className="w-full h-full overflow-y-scroll overflow-x-hidden flex flex-col justify-start items-center">
        {contactData &&
          contactData!.map((data: dataForChat, index: number) => (
            <ChatContact contactData={data} key={index} />
          ))}
      </div>

      <div className="relative w-full p-2 self-end">
        {usernameResult && (
          <div className="absolute bottom-[4rem] left-0 right-0 translate-x-[0.4rem] w-[calc(100%-0.75rem)] max-h-[7.5rem] h-fit rounded-[4px] flex flex-col-reverse justify-start items-start bg-slate-400 overflow-y-scroll ">
            {usernameResult.map((user: userResultType) => {
              if (user.username !== username)
                return (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      openNewChat(user.name, user.username);
                    }}
                    data-contact-username-result
                    className="w-full text-left p-2 cursor-pointer"
                  >{`${user.name} (${user.username})`}</div>
                );
            })}
          </div>
        )}

        <input
          type="text"
          placeholder="Start New Chat - Search Username"
          onChange={(e) => {
            e.preventDefault();
            setSearchUsername(e.target.value);
          }}
          data-search-username-input
          className="w-full px-2 py-3 rounded-[4px] text-[0.9rem] outline outline-2 outline-offset-2 outline-white "
        />
      </div>
    </div>
  );
}
