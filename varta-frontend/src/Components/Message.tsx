import { useAppSelector } from "../redux/hooks";
import { messageType } from "./Chat";

interface Props {
  messageData: messageType;
}

export const resolveMessageTime = (timeStr: string) => {
  const msgTime = new Date(timeStr);

  const hrs: number = msgTime.getHours();
  let min: string = msgTime.getMinutes().toString();

  if (min.toString().length === 1) {
    min = "0" + min;
  }

  const time: string = `${hrs}:${min}`;

  return time;
};

export default function Message(props: Props) {
  const messageData = props.messageData;

  const username: string = useAppSelector((state) => state?.loggedIn?.username);

  return (
    <div
      data-message-id={messageData._id}
      className={
        "max-w-[85%] flex flex-col justify-start items-end gap-[0.1rem] " +
        (messageData.contact_username === username ? "self-end" : "self-start")
      }
    >
      <div
        className={
          "px-3 py-2 text-right rounded-[6px] shadow-msg " +
          (messageData.contact_username === username
            ? "bg-slate-100 text-right rounded-tr-none"
            : "bg-[#159AC4] text-white rounded-tl-none")
        }
      >
        {messageData.text}
      </div>
      <div
        className={
          "text-black text-[0.75rem] " +
          (messageData.contact_username === username
            ? "text-right self-end"
            : "text-left self-start")
        }
      >
        {resolveMessageTime(messageData.createdAt)}
      </div>
    </div>
  );
}
