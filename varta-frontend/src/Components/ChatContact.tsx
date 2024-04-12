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
  const dispatch = useAppDispatch();
  const contactData = props.contactData;

  const fetchChatMessages = useCallback((contact: string) => {
    const toSetContact: setContactType = {
      name: contactData.contact_name,
      username: contact,
    };

    dispatch(setContact(toSetContact));
    dispatch(fetchChatMessagesData(contact));
  }, []);

  const openChat = (contact: string) => {
    fetchChatMessages(contact);
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        openChat(contactData.contact_username);
      }}
      className="w-full p-3 flex flex-nowrap justify-start items-center gap-2 border-b-[1px] border-[#159AC4] cursor-pointer transition-[background-color] duration-200 ease-in-out hover:bg-slate-300 overflow-x-hidden overflow-y-scroll"
    >
      <div className="w-8 h-8 flex justify-center items-center rounded-full overflow-hidden">
        <img
          src={avatarPlaceholder}
          alt={contactData.contact_name}
          className="w-full h-full rounded-full border-solid border-2 border-[#159AC4]"
        />
      </div>

      <div>{contactData.contact_name}</div>
    </div>
  );
}
