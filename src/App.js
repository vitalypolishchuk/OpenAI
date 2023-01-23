import "./openai/sass/hero.scss";
import videoBg from "./additional/video-hero.mp4";

export default function App() {
  return (
    <section className="openai-hero">
      <video src={videoBg} loop muted />
      <div className="title">
        <span>Try chatGPT &#8599;</span>
        <span className="title-2">Introducing ChatGPT release</span>
        <span>Try &#8599;</span>
      </div>
      <button className="btn">ChatGPT</button>
      <p>Hello world, how are you?</p>
    </section>
  );
}
