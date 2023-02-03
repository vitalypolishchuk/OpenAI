import "./sass/main.scss";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import axios from "axios";
import { v4 as uniqueId } from "uuid";
import { cloneDeep } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faBars, faPlus, faXmark, faComment, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import barsSvg from "../additional/bars.svg";
import ChatMessage from "./ChatMessage";
import apiCall from "./api";

// Voice Recognition API. If the quota is exceeded, set up new appId from Speechly API.
const appId = process.env.REACT_APP_SPEECHLY_API_KEY;
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

// text to speech API
const userId = process.env.REACT_APP_TEXT_TO_SPEECH_USER_ID;
const secretKey = process.env.REACT_APP_TEXT_TO_SPEECH_KEY;

export default function ChatGPT() {
  const [model, setModel] = useState("text-davinci-003");
  const [mainContainerHeight, setMainContainerHeight] = useState(100);
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  // const [chats, setChats] = useState([
  //   {
  //     chatLogId: "12",
  //     title: "GET Request Generation Example",
  //     data: [
  //       { user: "gpt", message: "how can I help you? 12" },
  //       { user: "me", message: "Say this is a test 12" },
  //     ],
  //   },
  //   {
  //     chatLogId: "13",
  //     title: "V | Coding",
  //     data: [{ user: "gpt", message: "how can I help you? 13" }],
  //   },
  //   {
  //     chatLogId: "14",
  //     title: "Read and write me a text to describe",
  //     data: [{ user: "gpt", message: "how can I help you? 13" }],
  //   },
  // ]); // all chats
  const [chats, setChats] = useState([]);
  const [chatLog, setChatLog] = useState({
    chatLogId: "",
    title: "New Chat",
    data: [{ user: "gpt", message: "how can I help you today?", soundUrl: "", messageId: uniqueId() }],
  }); // current chat
  const [hasRendered, setHasRendered] = useState(false);
  const [chatTranscript, setChatTranscript] = useState("");
  const [editChatId, setEditChatId] = useState("");
  const [titleName, setTitleName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [containerHeight, setContainerHeight] = useState(39);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [isMicrophoneTurnd, seisMicrophoneTurnd] = useState();
  const barsRef = useRef();
  const refMicrophone = useRef();
  const refTextArea = useRef();
  const refSideMenu = useRef();
  const refOverlay = useRef();
  const refVersion = useRef();
  const refTextBox = useRef();
  const refChatGpt = useRef();
  const refHeader = useRef();
  const refAvailable = useRef();
  const refOpenMenu = useRef();
  const refCloseSideMenu = useRef();
  const refMenuChatsContainer = useRef();
  const refChatNameInput = useRef();
  const refAudio = useRef();

  // react-speech-recognition API with Speechly
  let { transcript, resetTranscript, listening, browserSupportsSpeechRecognition, isMicrophoneAvailable } = useSpeechRecognition();

  useEffect(() => {
    const headerHeight = parseFloat(getComputedStyle(refHeader.current).getPropertyValue("height"));
    const chatGptHeight = parseFloat(getComputedStyle(refChatGpt.current).getPropertyValue("height"));

    // calc the height for .gpt-textbox
    refTextBox.current.style.height = window.innerHeight - headerHeight - chatGptHeight - 2.5 + "px";
    // containerHeight is the height of textarea, 60 is the additional height of the chat-gpt text
    setMainContainerHeight(window.innerHeight - containerHeight - 60);
  }, [containerHeight, innerHeight]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    window.addEventListener("click", handleCloseSideMenu);

    handleLocalStorage();

    if (browserSupportsSpeechRecognition) {
      // check if speech is not supported by the browser
      refMicrophone.current.classList.remove("none");
    }

    return () => {
      window.addEventListener("click", handleCloseSideMenu);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    // Chat transcript is the text which was hand-written by user, whereas Transcript is the recorded audio by user.
    setText(chatTranscript + " " + transcript);
  }, [transcript]);

  useEffect(() => {
    // if chatTranscript is changed (user wrote something in chat), we set audio transcript to = '';
    resetTranscript();
  }, [chatTranscript]);

  useEffect(() => {
    console.log(chatLog);
    const data = localStorage.getItem("chats");
    const strChats = JSON.stringify(cloneDeep(chats));
    if (hasRendered && data !== strChats) localStorage.setItem("chats", strChats);
    if (!hasRendered) setHasRendered(true); // we want to trigger [chats, hasRendered] useEffect not the initial time, but only after it was rendered at least once. The problem with complex types (in our case []) is that useEffect is being triggered even when these variables are initially set. This happens because the reference of these variables in memory is different between renders, even though the content is the same
  }, [chats, hasRendered]);

  useLayoutEffect(() => {
    if (refChatNameInput.current) {
      refChatNameInput.current.focus();
    }
  }, [titleName]);

  useEffect(() => {
    // user wrote first message && there is no chatLogId
    if (chatLog.data.length === 3 && chatLog.chatLogId === "") {
      // we set chatLogId
      const chatLogId = uniqueId();
      setChatLog({ chatLogId: chatLogId, title: chatLog.title, data: [...chatLog.data] });
    }

    // if the chatLog has chatLogId
    if (chatLog.chatLogId !== "") {
      // we try to find current chatLog in the chats
      const foundLogIndex = chats.findIndex((chat) => chat.chatLogId === chatLog.chatLogId);
      if (foundLogIndex !== -1) {
        // if we found current chatLog in the chats, we replace the old chatLog, with the new one
        setChats([...chats.slice(0, foundLogIndex), chatLog, ...chats.slice(foundLogIndex + 1)]);
      } else {
        // if we did not find current chatLog in the chats, we add it to the chats
        setChats([...chats, chatLog]);
      }
    }

    refTextBox.current.scrollTop = refTextBox.current.scrollHeight;
    if (chatLog.data[chatLog.data.length - 1].user === "gpt") return;

    const messages = chatLog.data.reduce((prev, cur, id) => {
      if (id === 0) return "";
      if (id === 1) return prev + cur.message;

      return prev + "\n" + cur.message;
    }, chatLog.data[1].message);

    const fetchData = async () => {
      console.log(chatLog);
      const response = await apiCall(messages, model);
      setChatLog({
        chatLogId: chatLog.chatLogId,
        title: chatLog.title,
        data: [...chatLog.data, { user: "gpt", message: response.message, soundUrl: "", messageId: uniqueId() }],
      });
    };
    fetchData();
  }, [chatLog]);

  useEffect(() => {
    handleText();
  }, [text]);

  useEffect(() => {
    if (audioUrl) {
      setIsPlaying(true);
    }
  }, [audioUrl]);

  useEffect(() => {
    if (isPlaying) {
      refAudio.current.play();
      setIsPlaying(false);
    }
  }, [isPlaying]);

  async function textToSpeech(text, chatId, messageId) {
    // check if current chatLog is the same as the one from which text-to-speech was asked
    if (chatLog.chatLogId === chatId) {
      // find corresponding message
      const msgIndex = chatLog.data.findIndex((msg) => {
        if (msg.user === "gpt") {
          return msg.messageId === messageId;
        }
      });
      // find the message already has mp3 url (we saved it earlier)
      if (chatLog.data[msgIndex].soundUrl) {
        // audioUrl state is ready to play the music
        if (audioUrl === chatLog.data[msgIndex].soundUrl) {
          refAudio.current.play();
        } else {
          setAudioUrl(chatLog.data[msgIndex].soundUrl);
          return;
        }
        return;
      }

      // we did not find mp3 link, create new
      const url = "https://play.ht/api/v1";
      const headers = {
        "Content-Type": "application/json",
        Authorization: secretKey,
        "X-User-ID": userId,
      };
      const body = {
        voice: "en-AU-Standard-B",
        content: [text],
      };

      const response = await axios.post(url + "/convert", body, { headers: headers }); // contains transcriptionId to check the status of mp3 convert
      const transcriptionId = response.data.transcriptionId;

      let converted = false;

      while (!converted) {
        try {
          // waiting for 1 second to let convert happen
          await new Promise((resolve) => setTimeout(resolve, 300));
          // check if the msg was already converted to mp3
          const responseStatus = await axios.get(url + `/articleStatus?transcriptionId=${transcriptionId}`, { headers: headers });
          converted = responseStatus.data.converted;
          // current chat === chat in which text-to-speech was asked for
          if (chatLog.chatLogId === chatId) {
            if (msgIndex !== -1) {
              // create new data with messages, to update the current one
              const msgCopy = cloneDeep(chatLog.data[msgIndex]);
              msgCopy.soundUrl = responseStatus.data.audioUrl;
              const data = [...chatLog.data.slice(0, msgIndex), msgCopy, ...chatLog.data.slice(msgIndex + 1)];
              // set new data with mp3 link for the message
              setChatLog({
                chatLogId: chatLog.chatLogId,
                title: chatLog.title,
                data: data,
              });
            }
          }
          setAudioUrl(responseStatus.data.audioUrl);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  async function handleListen() {
    if (isListening) {
      // check permission for microphone
      const permissionStatus = await navigator.permissions.query({ name: "microphone" });
      if (permissionStatus.state !== "granted") {
        try {
          // ask permission for microphone
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          // permission is denied. Show pop-up
          refAvailable.current.classList.remove("hidden");
          refAvailable.current.classList.add("transition");
        }

        return;
      }

      // permission for microphone is granted
      SpeechRecognition.startListening({ continuous: true });
      refMicrophone.current.classList.add("microphone-active");
      barsRef.current.classList.remove("none");
    } else {
      // Stop listening
      SpeechRecognition.stopListening();
      refMicrophone.current.classList.remove("microphone-active");
      barsRef.current.classList.add("none");
    }
  }

  function onResize() {
    handleText();
    handleHeight();
  }

  function handleText() {
    setText(refTextArea.current.value);

    // set the height of the textarea to auto in order to find scrollHeight of the element
    refTextArea.current.style.height = "auto";

    // If scrollHeight < 200, we increase/decrease the height of the textarea depending on the scrollHeight
    if (refTextArea.current.scrollHeight < window.innerHeight * 0.2) {
      // use setTextAreaHeight to set the height of the container
      setContainerHeight(refTextArea.current.scrollHeight + 21);
      refTextArea.current.style.height = refTextArea.current.scrollHeight + "px";
      refTextArea.current.style.overflowY = "hidden";
    } else {
      // if scrollHeight >= 200, we set height to 200 and add scroll
      setContainerHeight(window.innerHeight * 0.2 + 21);
      refTextArea.current.style.height = window.innerHeight * 0.2 + "px";
      refTextArea.current.style.overflowY = "scroll";
    }
  }

  function handleHeight() {
    setInnerHeight(window.innerHeight);
  }

  function handleSideMenu() {
    refSideMenu.current.style.left = "0";
    refOverlay.current.classList.remove("hidden");
    refOverlay.current.classList.add("visible-overlay");
  }

  function handleCloseSideMenu(e) {
    if (refOpenMenu.current.contains(e.target) || (refSideMenu.current.contains(e.target) && !refCloseSideMenu.current.contains(e.target))) return;
    refSideMenu.current.style.left = "-100%";
    refOverlay.current.classList.add("hidden");
    refOverlay.current.classList.remove("visible-overlay");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsListening(false);
    if (text === "") return;
    setChatLog({ chatLogId: chatLog.chatLogId, title: chatLog.title, data: [...chatLog.data, { user: "me", message: text }] });
    setChatTranscript("");
    setText("");
  }

  function newChat() {
    setChatTranscript("");
    setText("");
    setChatLog({
      chatLogId: "",
      title: "New Chat",
      data: [{ user: "gpt", message: "how can I help you today?", soundUrl: "", messageId: uniqueId() }],
    });
  }

  function handleLocalStorage() {
    const data = localStorage.getItem("chats");
    if (data) setChats(JSON.parse(data));
  }

  function renderMenuChats() {
    return chats.map((chat) => {
      return (
        <button
          onClick={() => {
            handleChat(chat.chatLogId);
          }}
          data-chatlogid={chat.chatLogId}
          key={chat.chatLogId}
          className={`${chat.chatLogId === chatLog.chatLogId ? "bg-selected" : ""} gpt-sidemenu__chat-button`}
        >
          <span>
            <FontAwesomeIcon icon={faComment} />
          </span>
          <span className={chat.chatLogId === editChatId ? "none" : ""}>{chat.title}</span>
          <span
            className={`${chat.chatLogId === chatLog.chatLogId && chat.chatLogId !== editChatId ? "" : "none"}`}
            onClick={(e) => {
              editChat(e, chat.chatLogId);
            }}
          >
            <FontAwesomeIcon icon={faPen} />
          </span>
          <span
            className={`${chat.chatLogId === chatLog.chatLogId ? "" : "none"}`}
            onClick={(e) => {
              deleteChat(e, chat.chatLogId);
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
          <input
            ref={refChatNameInput}
            value={titleName}
            onChange={(e) => setTitleName(e.target.value)}
            type="text"
            className={chat.chatLogId === editChatId ? "" : "none"}
          />
          <span
            onClick={(e) => handleSaveNameChat(e, chat.chatLogId)}
            className={`${chat.chatLogId === chatLog.chatLogId && chat.chatLogId === editChatId ? "gpt-sidemenu__chat-button__save-edit" : "none"}`}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 20 20"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
          </span>
        </button>
      );
    });
  }

  function editChat(e, id) {
    e.stopPropagation();
    setEditChatId(id);
  }

  function deleteChat(e, id) {
    e.stopPropagation();
    const findChatIndex = chats.findIndex((chat) => chat.chatLogId === id);
    setChats([...chats.slice(0, findChatIndex), ...chats.slice(findChatIndex + 1)]);
    newChat();
  }

  function handleChat(id) {
    const selectedChat = chats.find((chat) => chat.chatLogId === id);
    setChatLog(selectedChat);
  }

  function handleSaveNameChat(e, id) {
    const findChatIndex = chats.findIndex((chat) => chat.chatLogId === id);
    const objCopy = cloneDeep(chats[findChatIndex]);
    objCopy.title = titleName;
    setChats([...chats.slice(0, findChatIndex), objCopy, ...chats.slice(findChatIndex + 1)]);
    setEditChatId("");
  }

  return (
    <div className="gpt">
      <aside className="gpt-sidemenu" ref={refSideMenu}>
        <button ref={refCloseSideMenu} className="gpt-sidemenu__close gpt-btn">
          <FontAwesomeIcon icon={faXmark} />
        </button>
        <button className="gpt-sidemenu__new-chat" onClick={newChat}>
          <span>
            <FontAwesomeIcon icon={faPlus} />
          </span>
          <span>New chat</span>
        </button>
        <div className="gpt-sidemenu__chats" ref={refMenuChatsContainer}>
          {renderMenuChats()}
        </div>
        <select onChange={(e) => setModel(e.target.value)} className="gpt-sidemenu__engine" name="model" id="model">
          <option value="text-davinci-003">text-davinci-003</option>
          <option value="code-davinci-002">code-davinci-002</option>
        </select>
      </aside>
      <div className="gpt-main-container" style={{ height: mainContainerHeight + "px" }}>
        <header ref={refHeader} className="gpt-header">
          <header className="gpt-header__center">
            <button ref={refOpenMenu} onClick={handleSideMenu} className="gpt-header__menu gpt-btn">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h5 className="gpt-header__text">{chatLog.title}</h5>
            <button className="gpt-header__plus gpt-btn">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </header>
        </header>
        <section ref={refTextBox} className="gpt-textbox">
          <div ref={refAvailable} className="gpt-textbox__available hidden">
            Please grant the microphone permission!
          </div>
          {chatLog.data.map((message) => (
            <ChatMessage key={uniqueId()} message={message} textToSpeech={textToSpeech} chatLogId={chatLog.chatLogId} />
          ))}
        </section>
        <section ref={refChatGpt} className="chat-gpt" style={{ height: 60 + containerHeight + "px" }}>
          <div className="chat-gpt__result" style={{ height: containerHeight + "px" }}>
            <button ref={barsRef} className="bars none">
              <img src={barsSvg} />
            </button>
            <textarea
              ref={refTextArea}
              rows={1}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setChatTranscript(e.target.value);
              }}
            />
            <button className="chat-gpt__send" onClick={handleSubmit}>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 20 20"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
            <button ref={refMicrophone} className="microphone none" onClick={() => setIsListening(!isListening)}>
              <FontAwesomeIcon icon={faMicrophone} />
            </button>
          </div>
          <div ref={refVersion} className="chat-gpt__version">
            <span>ChatGPT Jan 9 Version.</span>
            <span>
              Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.
            </span>
          </div>
        </section>
        <audio ref={refAudio} src={audioUrl} id="audio"></audio>
        <div className="overlay hidden" ref={refOverlay}></div>
      </div>
    </div>
  );
}
