import popUpSuccessIcon from "../assets/images/pop-up-success.png";
import popUpErrorIcon from "../assets/images/pop-up-error.png";

interface popUpMessageType {
  success: boolean;
  message: string;
}

export const showPopUp = (messageData: popUpMessageType) => {
  const success = messageData.success;
  const message = messageData.message;

  const popUpDiv = document.querySelector("[data-pop-up]") as HTMLElement;
  const popUpIcon = document.querySelector("[data-pop-up-icon]") as HTMLElement;
  const popUpMessage = document.querySelector(
    "[data-pop-up-message]"
  ) as HTMLElement;
  const popUpTimeBar = document.querySelector(
    "[data-pop-up-time-bar]"
  ) as HTMLElement;

  popUpDiv.style.display = "flex";
  popUpIcon.setAttribute("src", success ? popUpSuccessIcon : popUpErrorIcon);
  popUpMessage.innerHTML = message;
  popUpTimeBar.style.backgroundColor = success ? "#4f95db" : "#ff4500";

  setTimeout(() => {
    popUpDiv.style.display = "none";
  }, 3000);
};

export default function PopUpMessage() {
  return (
    <div
      style={{ display: "none" }}
      className="fixed bottom-[1rem] left-[1rem] w-[95%] sm:w-full max-w-[400px] flex justify-start items-center rounded-[2px] bg-white shadow-popUpMessage z-[7] overflow-hidden "
      data-pop-up
    >
      <div className="relative flex flex-nowrap justify-start items-center gap-2 p-4 ">
        <div className="w-6 h-6 flex justify-center items-center ">
          <img src="" alt="Msg: " className="w-full" data-pop-up-icon />
        </div>
        <p
          className="text-[0.85rem] sm:text-[0.95rem] font-normal"
          data-pop-up-message
        ></p>
      </div>

      <div
        className="absolute left-0 bottom-0 right-0 h-[5px] w-full bg-slate-200 origin-left animate-popUpToLeft "
        data-pop-up-time-bar
      ></div>
    </div>
  );
}
