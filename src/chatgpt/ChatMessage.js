import userImg from "../additional/user.webp";
import { gptIconPath } from "../additional/gpt-icon-path.js";

export default function ChatMessage({ message }) {
  return (
    <div className={`gpt-textbox__msg-container ${message.user === "gpt" && "light"}`}>
      <div className="gpt-textbox__msg-container__center">
        <div className="gpt-textbox__avatar">
          <img className={`${message.user === "gpt" && "none"}`} src={userImg}></img>
          <svg width="30" height="30" viewBox="0 0 41 41" className={`gpt-textbox__gpt-icon ${message.user === "me" && "none"}`}>
            <path d={gptIconPath}></path>
          </svg>
        </div>
        <div className="gpt-textbox__message">{message.message}</div>
      </div>
    </div>
  );
}
