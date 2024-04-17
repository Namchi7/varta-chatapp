import { useCallback } from "react";

import { useAppDispatch } from "../redux/hooks";
import { fetchChatMessagesData } from "../redux/reducers/getChatMessagesPage";

import { dataForChat } from "./ChatContacts";
import avatarPlaceholder from "../assets/images/avatar-placeholder.png";
import { setContact } from "../redux/reducers/chatContactNamePage";

interface Props {
  contactData: dataForChat;
}

interface setContactType {
  name: string;
  username: string;
}

export default function ChatContact(props: Props) {
  const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;

  const dispatch = useAppDispatch();
  const contactData = props.contactData;

  console.log(contactData);

  const fetchChatMessages = useCallback((contact: string) => {
    const toSetContact: setContactType = {
      name: contactData.contact_name,
      username: contact,
    };

    dispatch(setContact(toSetContact));
    dispatch(fetchChatMessagesData(contact));
  }, []);

  const openChat = async (contact: string) => {
    fetchChatMessages(contact);

    // ##################
    // Message mark as read

    const res = await fetch(
      `${serverURI}/mark-read-message?contact=${contact}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await res.json();

    if (result.success) {
      console.log("Chat marked as read");
    } else {
      console.log("Chat not marked as read");
    }

    // ##################
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        openChat(contactData.contact_username);
      }}
      className="w-full p-3 flex flex-nowrap justify-start items-center gap-2 border-b-[1px] border-[#159AC4] cursor-pointer transition-[background-color] duration-200 ease-in-out hover:bg-slate-300 overflow-x-hidden overflow-y-scroll"
    >
      <div className="w-8 h-8 shrink-0 flex justify-center items-center rounded-full overflow-hidden">
        <img
          src={avatarPlaceholder}
          alt={contactData.contact_name}
          className="w-full h-full rounded-full border-solid border-2 border-[#159AC4]"
        />
      </div>

      <div className="w-full flex flex-col justify-center items-start ">
        <div className="w-full flex flex-nowrap justify-between items-center gap-2 ">
          <div className="shrink text-[0.95rem] font-semibold ">
            {contactData.contact_name}
          </div>

          {contactData.unseen_count > 0 && (
            <div className="aspect-square w-4 text-[0.8rem] leading-[0.8rem] text-slate-100 bg-[#159AC4] rounded-full p-[2px] shrink-0 flex justify-center items-center ">
              {contactData.unseen_count}
            </div>
          )}
        </div>

        <div className="text-[0.8rem] ">{contactData.text}</div>
      </div>
    </div>
  );
}
