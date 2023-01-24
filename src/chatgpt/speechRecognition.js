import "./sass/main.scss";
import { useState, useEffect, useRef, React } from "react";
import { v4 as uniqueId } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import barsSvg from "../additional/bars.svg";
import { languages } from "./languages";

export default function SpeechRecognition() {
  const languageRef = useRef();
  const barsRef = useRef();
  const microphoneRef = useRef();
  const resultRef = useRef();
  const interimRef = useRef();

  const [showInterim, setShowInterim] = useState(true);
  const [interimText, setInterimText] = useState("");
  let [resultText, setResultText] = useState("");
  const [isSpeechOn, setIsSpeechOn] = useState(false);
  const [language, setLanguage] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [recongition, setRecognition] = useState(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (recongition) {
      generateSpeech();
    }
  }, [recongition]);

  function generateSpeech() {
    // if the recording button was clicked
    recongition.lang = languageRef.current.value; // setting up language
    recongition.interimResults = true; // setting up interim results (not final)
    barsRef.current.classList.remove("none"); // show recording svg
    setIsSpeechOn(true); // let react now that we are recording
    recongition.start(); // start recording
    // recieve result. result can be either final or interim
    let myresult;
    recongition.onresult = (e) => {
      const speechResult = e.results[0][0].transcript;
      console.log(speechResult, e.results[0].isFinal);

      // if result is final, show it in the resultText
      if (e.results[0].isFinal) {
        setResultText((resultText += " " + speechResult));
        setShowInterim(false); // remove interim element
      } else {
        setInterimText(" " + speechResult);
      }
    };
    recongition.onspeechend = () => {
      // on speech end again call the function to continuously listen
      setRecognition(new (window.speechRecognition || window.webkitSpeechRecognition)());
    };

    recongition.onerror = (e) => {
      alert("Error Occured: ", e.error);
    };
  }

  function generateLanguates() {
    return languages.map((lang) => {
      return (
        <option key={uniqueId()} value={lang.code}>
          {lang.name}
        </option>
      );
    });
  }

  function speechToText() {
    if (isSpeechOn) return stopSpeechToText(); // if speech recognition API is on, stop it
    return setRecognition(new (window.speechRecognition || window.webkitSpeechRecognition)()); // if speech recognition API is off, launch it
  }

  function stopSpeechToText() {
    // stop speech to text functionality
    recongition.stop();
    barsRef.current.classList.add("none");
    setIsSpeechOn(false);
  }

  return (
    <div className="speech-recongition">
      <select name="language" id="language" ref={languageRef} value={language} onChange={(e) => setLanguage(e.target.value)}>
        {generateLanguates()}
      </select>
      <span className="speech-recongition__icons">
        <img src={barsSvg} ref={barsRef} className="bars none" />
        <FontAwesomeIcon icon={faMicrophone} ref={microphoneRef} className="microphone" onClick={speechToText} />
      </span>
      <div className="speech-recongition__result" ref={resultRef} spellCheck="false">
        {showInterim && <p className="speech-recongition__interim">{interimText}</p>}
        <div>{resultText}</div>
      </div>
    </div>
  );
}
