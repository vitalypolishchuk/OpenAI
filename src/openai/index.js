import "./sass/hero.scss";
import videoBg from "../additional/video-hero.mp4";
import { Fragment } from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  return (
    <Fragment>
      <section className="openai-hero">
        <video src={videoBg} loop muted />
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
