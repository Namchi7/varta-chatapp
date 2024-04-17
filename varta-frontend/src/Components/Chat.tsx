import io, { Socket } from "socket.io-client";
// import ReactDOM from "react-dom";

import { useAppDispatch, useAppSelector } from "../redux/hooks";

import back from "../assets/images/back.png";
import Message from "./Message";
import { useCallback, useEffect } from "react";
import { fetchChatContactsData } from "../redux/reducers/getChatContactsPage";
import { setMessageData } from "../redux/reducers/getChatMessagesPage";
import { resetContact } from "../redux/reducers/chatContactNamePage";
// import chatMessages from "../assets/messages.json";

export interface messageType {
  _id: string;
  receiver_username: string;
  contact_username: string;
  is_group_chat: boolean;
  is_deleted: boolean;
  unseen: number;
  text: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface createMessageResultType {
  success: boolean;
  msg: string;
  message_data: messageType;
}

let socket: Socket;

export default function Chat() {
  const serverURI: string | undefined = process.env.REACT_APP_SERVER_URI;
  const dispatch = useAppDispatch();

  // const messages: messageType[] = chatMessages;
  const messages: messageType[] | null = useAppSelector(
    (state) => state?.chatMessages?.data
  );
  const username: string = useAppSelector((state) => state?.loggedIn?.username);
  const contactName: string = useAppSelector(
    (state) => state?.chatContact?.name
  );
  const contactUsername: string = useAppSelector(
    (state) => state?.chatContact?.username
  );

  const updateChatMessages = useCallback(
    (msg: messageType[], newMessage: messageType) => {
      dispatch(setMessageData({ prevData: msg, newMessage: newMessage }));
    },
    []
  );

  const updateChatContactData = useCallback(() => {
    dispatch(fetchChatContactsData());

    // dispatch(fetchChatMessagesData(contactUsername));
  }, []);

  const sendMessage = async () => {
    const messageText = document.querySelector(
      "[data-message-text]"
    ) as HTMLTextAreaElement;

    const text: string = messageText.value;
    messageText.value = "";

    const res = await fetch(
      `${serverURI}/create-message?receiver=${contactUsername}&text=${text}`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const result: createMessageResultType = await res.json();

    if (!result.success) {
      return;
    }

    const toSocket = {
      recipientId: contactUsername,
      message_data: result.message_data,
    };

    // messageD.push(result.message_data);
    updateChatMessages(messages, result.message_data);

    socket.emit("new-message", toSocket);

    updateChatContactData();
  };

  const clearContactName = useCallback(() => {
    dispatch(resetContact());
  }, []);

  useEffect(() => {
    socket = io(`${serverURI}?username=${username}`);

    socket.on("connect", () => {
      socket.emit("join", username);
      console.log("Socket connected.");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  }, []);

  useEffect(() => {
    const chatMessages = document.querySelector(
      "[data-chat-messages]"
    ) as HTMLElement;

    if (chatMessages !== null)
      chatMessages!.scrollTop = chatMessages!.scrollHeight;

    socket.on("new-message", async (newMessage: messageType) => {
      if (newMessage.receiver_username === username) {
        updateChatMessages(messages, newMessage);
      }

      // ##################
      // Message mark as read

      if (newMessage.contact_username === contactUsername) {
        const res = await fetch(
          `${serverURI}/mark-read-message?contact=${newMessage.contact_username}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const result = await res.json();

        if (result.success) {
          console.log("Message marked as read");
        } else {
          console.log("Message not marked as read");
        }
      }

      // ##################

      updateChatContactData();
    });
  }, [messages]);

  return (
    <div
      className={
        "w-full h-full rounded-[0.75rem] sm:flex flex-col justify-start items-start bg-slate-200 overflow-x-hidden " +
        (contactName === "" ? "hidden" : "flex")
      }
    >
      {contactName === "" ? (
        <p className="w-full h-full flex justify-center items-center text-[0.85rem] text-slate-600 ">
          Click on chat to load messages.
        </p>
      ) : (
        <>
          <div className="w-full p-3 py-2 flex flex-nowrap justify-start items-center gap-2 bg-[#159AC4]">
            <div
              onClick={(e) => {
                e.preventDefault();
                clearContactName();
              }}
              className="w-[20px] h-[20px] flex justify-center items-center cursor-pointer rounded-full "
            >
              <img src={back} alt="Back" className="h-full" />
            </div>

            <div className="text-[#ffffff] text-[1.25rem] font-semibold">
              {contactName}
            </div>

            {/* <img src={options} alt="More" className="h-[18px] cursor-pointer self-end" /> */}
          </div>

          <div
            data-chat-messages
            className="w-full h-full overflow-y-scroll overflow-x-hidden flex flex-col justify-start items-center gap-1 px-3 py-4"
          >
            {messages &&
              messages!.map((messageData: messageType, index: number) => (
                <Message messageData={messageData} key={index} />
              ))}
          </div>

          <div className="w-full px-3 py-3 flex flex-nowrap justify-between items-end gap-3 bg-slate-500">
            <textarea
              placeholder="Message..."
              data-message-text
              className="w-full h-[56px] max-h-50 px-3 py-4 resize-none rounded-[6px] focus:outline-none"
            />

            <div
              onClick={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="bg-[#159AC4] text-white p-4 rounded-[6px] hover:cursor-pointer"
            >
              Send
            </div>
          </div>
        </>
      )}
    </div>
  );
}
