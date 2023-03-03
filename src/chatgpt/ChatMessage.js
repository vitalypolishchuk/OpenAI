import userImg from "../additional/user.webp";
import { gptIconPath } from "../additional/gpt-icon-path.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause } from "@fortawesome/free-solid-svg-icons";

export default function ChatMessage({ message, textToSpeech, chatLogId, startSpeaking, setStartSpeaking }) {
  return (
    <div className={`gpt-textbox__msg-container ${message.role === "assistant" && "light"}`}>
      <div className="gpt-textbox__msg-container__center">
        <div className="gpt-textbox__avatar">
          <img className={`${message.role === "assistant" && "none"}`} src={userImg}></img>
          <svg width="30" height="30" viewBox="0 0 41 41" className={`gpt-textbox__gpt-icon ${message.role === "user" && "none"}`}>
            <path d={gptIconPath}></path>
          </svg>
        </div>
        <div className="gpt-textbox__message">{message.message}</div>
        <span
          className={message.role !== "user" && startSpeaking !== message.messageId ? "gpt-textbox__play" : "none"}
          onClick={() => {
            textToSpeech(message.message, chatLogId, message.messageId);
          }}
        >
          <FontAwesomeIcon icon={faPlay} />
        </span>
        <span
          className={message.role !== "user" && startSpeaking === message.messageId ? "gpt-textbox__pause" : "none"}
          onClick={() => {
            setStartSpeaking("");
          }}
        >
          <FontAwesomeIcon icon={faPause} />
        </span>
      </div>
    </div>
  );
}
