import "./sass/main.scss";
import { useState, useEffect, useRef } from "react";
import { v4 as uniqueId } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faBars, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import barsSvg from "../additional/bars.svg";

// check if mobile or web
const x_mobileFlg = window.navigator.userAgentData.mobile;

const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognitionAPI();
if (x_mobileFlg) {
  recognition.continuous = false;
} else {
  recognition.continuous = true;
}
console.log(recognition.continuous);
recognition.interimResults = true;
recognition.lang = "en-US";

export default function SpeechRecognition() {
  const [mainContainerHeight, setMainContainerHeight] = useState(100);
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [containerHeight, setContainerHeight] = useState(39);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const barsRef = useRef();
  const refMicrophone = useRef();
  const refTextArea = useRef();
  const refSideMenu = useRef();
  const refOverlay = useRef();

  useEffect(() => {
    setMainContainerHeight(window.innerHeight - containerHeight - 40);
  }, [containerHeight, innerHeight]);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    handleText();
  }, [text]);

  function handleListen() {
    try {
      if (isListening) {
        refMicrophone.current.classList.add("microphone-active");

        recognition.start();
        barsRef.current.classList.remove("none");
        recognition.onend = () => {
          recognition.start();
        };
      } else {
        recognition.stop();
        refMicrophone.current.classList.remove("microphone-active");
        recognition.onend = () => {};
        barsRef.current.classList.add("none");
      }
      // recognition.onstart = () => {
      //   console.log("Recognition is on");
      // };
      recognition.onresult = (e) => {
        const transcript = Array.from(e.results)
          .map((result) => result[0].transcript)
          .join("");
        setText(transcript);
        recognition.onerror = (event) => {
          throw new Error(event);
        };
      };
    } catch (err) {
      console.log(err);
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
      <aside className="gpt-sidemenu" ref={refSideMenu}>
        menu
        <button onClick={handleCloseSideMenu} className="gpt-sidemenu__close gpt-btn">
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </aside>
      <div className="chat-gpt" style={{ height: 60 + containerHeight + "px" }}>
        <img src={barsSvg} ref={barsRef} className="bars none" />
        <div className="chat-gpt__result" style={{ height: containerHeight + "px" }}>
          <textarea ref={refTextArea} rows={1} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <FontAwesomeIcon icon={faMicrophone} ref={refMicrophone} className="microphone" onClick={() => setIsListening(!isListening)} />
        <div className="chat-gpt__version">
          <span>ChatGPT Jan 9 Version.</span>
          <span>
            Free Research Preview. Our goal is to make AI systems more natural and safe to interact with. Your feedback will help us improve.
          </span>
        </div>
      </div>
      <div className="overlay hidden" ref={refOverlay}></div>
    </div>
  );
}
