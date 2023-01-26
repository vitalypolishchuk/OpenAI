import "./sass/main.scss";
import { useState, useEffect, useRef } from "react";
import { createSpeechlySpeechRecognition } from "@speechly/speech-recognition-polyfill";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { v4 as uniqueId } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faBars, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import barsSvg from "../additional/bars.svg";

// If the quota is exceeded, set up new appId from Speechly API.
const appId = "b2638ffb-3015-4690-8ead-b919df798c4b";
const SpeechlySpeechRecognition = createSpeechlySpeechRecognition(appId);
SpeechRecognition.applyPolyfill(SpeechlySpeechRecognition);

export default function ChatGPT() {
  const [mainContainerHeight, setMainContainerHeight] = useState(100);
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [chatTranscript, setchatTranscript] = useState("");
  const [containerHeight, setContainerHeight] = useState(39);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const barsRef = useRef();
  const refMicrophone = useRef();
  const refTextArea = useRef();
  const refSideMenu = useRef();
  const refOverlay = useRef();
  const refVersion = useRef();

  // react-speech-recognition API with Speechly
  let { transcript, resetTranscript, listening, browserSupportsSpeechRecognition, isMicrophoneAvailable } = useSpeechRecognition();

  useEffect(() => {
    // Chat transcript is the text which was hand-written by user, whereas Transcript is the recorded audio by user.
    setText(chatTranscript + " " + transcript);
  }, [transcript]);

  useEffect(() => {
    // if chatTranscript is changed (user wrote something in chat), we set audio transcript to = '';
    resetTranscript();
  }, [chatTranscript]);

  useEffect(() => {
    // containerHeight is the height of textarea, 60 is the additional height of the chat-gpt text
    setMainContainerHeight(window.innerHeight - containerHeight - 60);
  }, [containerHeight, innerHeight]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    if (browserSupportsSpeechRecognition) {
      // check if speech is not supported by the browser
      refMicrophone.current.classList.remove("none");
    }
    if (!isMicrophoneAvailable) {
      // Render some fallback content
    }

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    handleText();
  }, [text]);

  function handleListen() {
    if (isListening) {
      SpeechRecognition.startListening({ continuous: true });
      refMicrophone.current.classList.add("microphone-active");
      barsRef.current.classList.remove("none");

      if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
      }
    } else {
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

  function handleCloseSideMenu() {
    refSideMenu.current.style.left = "-100%";
    refOverlay.current.classList.add("hidden");
    refOverlay.current.classList.remove("visible-overlay");
  }

  return (
    <div className="gpt">
      <aside className="gpt-sidemenu" ref={refSideMenu}>
        menu
        <button onClick={handleCloseSideMenu} className="gpt-sidemenu__close gpt-btn">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </aside>
      <div className="gpt-main-container" style={{ height: mainContainerHeight + "px" }}>
        <header className="gpt-header">
          <header className="gpt-header__center">
            <button onClick={handleSideMenu} className="gpt-header__menu gpt-btn">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h5 className="gpt-header__text">useEffect and window.innerHeight</h5>
            <button className="gpt-header__plus gpt-btn">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </header>
        </header>
        <div className="chat-gpt" style={{ height: 60 + containerHeight + "px" }}>
          <div className="chat-gpt__result" style={{ height: containerHeight + "px" }}>
            <img src={barsSvg} ref={barsRef} className="bars none" />
            <textarea
              ref={refTextArea}
              rows={1}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setchatTranscript(e.target.value);
              }}
            />
            <FontAwesomeIcon icon={faMicrophone} ref={refMicrophone} className="microphone none" onClick={() => setIsListening(!isListening)} />
          </div>
          <div ref={refVersion} className="chat-gpt__version">
            <span>ChatGPT Jan 9 Version.</span>
            <span>
              Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.
            </span>
          </div>
        </div>
        <div className="overlay hidden" ref={refOverlay}></div>
      </div>
    </div>
  );
}
