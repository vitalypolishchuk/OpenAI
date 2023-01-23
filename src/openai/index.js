import "./sass/hero.scss";
import videoBg from "../additional/video-hero.mp4";
import thumbnail from "../additional/thumbnail.jpg";
import { useRef, useEffect } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  const imgRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current.onloadeddata = () => {
      imgRef.current.classList.add("animation-opacity");
    };
  }, []);

  return (
    <Fragment>
      <section className="openai-hero">
        <video src={videoBg} ref={videoRef} loop muted />
        <img src={thumbnail} ref={imgRef}></img>
        <div className="openai__title">
          <Link to="/chatgpt">Try ChatGPT ↗</Link>
          <Link to="/chatgpt" className="openai__title--spans">
            <span>Introducing ChatGPT research release</span>
            <span>Try ↗</span>
          </Link>
        </div>
        <button className="btn">ChatGPT</button>
        <p>Hello world, how are you?</p>
      </section>
    </Fragment>
  );
}
