import { useEffect, useState } from "react";

import { useAppDispatch } from "../redux/hooks";
import { fetchChatContactsData } from "../redux/reducers/getChatContactsPage";

import Chat from "./Chat";
import ChatContacts from "./ChatContacts";
import Header from "./Header";
import Loader from "../utils/Loader";

export default function Home() {
  const dispatch = useAppDispatch();
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchChatContactsData());
  }, []);

  return (
    <>
      {logoutLoading && <Loader />}
      <div className="w-full h-full flex flex-col justify-start items-center overflow-x-hidden">
        <Header setLogoutLoading={setLogoutLoading} />
        <div className="w-full h-[calc(100%-50px)] shrink-0 flex flex-nowrap justify-between items-center gap-2 sm:gap-4  px-2 sm:px-4 pt-2 sm:pt-4 pb-4 overflow-hidden">
          <ChatContacts />
          <Chat />
        </div>
      </div>
    </>
  );
}
