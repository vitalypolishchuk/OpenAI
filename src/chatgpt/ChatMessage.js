import userImg from "../additional/user.webp";
import { gptIconPath } from "../additional/gpt-icon-path.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

export default function ChatMessage({ message, textToSpeech, chatLogId }) {
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
        <span
          className={`${message.user === "me" ? "none" : "gpt-textbox__play"}`}
          onClick={() => textToSpeech(message.message, chatLogId, message.messageId)}
        >
          <FontAwesomeIcon icon={faPlay} />
        </span>
      </div>
    </div>
  );
}
