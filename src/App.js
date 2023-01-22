import "./openai/sass/hero.scss";
import videoBg from "./additional/video-hero.mp4";

export default function App() {
  return (
    <section className="openai-background">
      <video src={videoBg} loop muted />
      <button className="btn">ChatGPT</button>
    </section>
  );
}
