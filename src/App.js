import { BrowserRouter, Routes, Route, Link, Switch } from "react-router-dom";
import MainPage from "./openai";
import Chatgpt from "./chatgpt";
import Dalle2 from "./dalle2";
import Whisper from "./whisper";

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chatgpt" element={<Chatgpt />} />
          <Route path="/dalle" element={<Dalle2 />} />
          <Route path="/whisper" element={<Whisper />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
