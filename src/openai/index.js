import "./sass/hero.scss";
import "./sass/links.scss";
import videoBg from "../additional/video-hero.mp4";
import thumbnail from "../additional/thumbnail.jpg";
import { useRef, useEffect } from "react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGithub, faLinkedin, faSoundcloud, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import SvgComponent from "./SvgComponent";

export default function MainPage() {
  const imgRef = useRef(null);
  const videoRef = useRef(null);
  const refVideoCenter = useRef();
  const refOverlay = useRef();

  useEffect(() => {
    videoRef.current.onloadeddata = () => {
      imgRef.current.classList.add("animation-opacity");
    };

    window.addEventListener("click", handleCloseVideo);
    window.addEventListener("resize", handleOverlayResize);

    return () => {
      // videoRef.current.onloadeddata = null;
      window.removeEventListener("click", handleCloseVideo);
      window.removeEventListener("click", handleOverlayResize);
    };
  }, []);

  function handleVideo() {
    videoRef.current.pause();
    refVideoCenter.current.classList.remove("hidden");
    refVideoCenter.current.style.opacity = "1";
    refOverlay.current.classList.remove("hidden");
    refOverlay.current.style.opacity = "1";
  }

  function handleCloseVideo(e) {
    if (refVideoCenter.current.classList.contains("hidden")) return;
    if (!e.target.classList.contains("openai-overlay")) return;

    refVideoCenter.current.pause();
    refVideoCenter.current.classList.add("hidden");
    refVideoCenter.current.style.opacity = "0";
    refOverlay.current.classList.add("hidden");
    refOverlay.current.style.opacity = "0";
    videoRef.current.play();
  }

  function handleOverlayResize() {
    if (refOverlay.current.classList.contains("hidden")) return;
    refOverlay.current.style.height = window.innerHeight + "px";
    console.log(refOverlay.current);
    refOverlay.current.style.width = window.innerWidth + "px";
  }

  return (
    <>
      <section className="openai-hero">
        <video src={videoBg} ref={videoRef} loop muted autoPlay />
        <img src={thumbnail} ref={imgRef}></img>
        <div className="openai__title">
          <Link to="/chatgpt">Try ChatGPT ↗</Link>
          <Link to="/chatgpt" className="openai__title--spans">
            <span>Introducing ChatGPT research release</span>
            <span>Try ↗</span>
            <span>Learn More</span>
          </Link>
        </div>
        <nav className="openai-nav">
          <div className="openai-nav__center">
            <SvgComponent />
            <ul className="openai-nav__navlinks">
              <li>
                <a href="https://openai.com/api/">API</a>
              </li>
              <li>
                <a href="https://openai.com/research/">RESEARCH</a>
              </li>
              <li>
                <a href="https://openai.com/blog/">BLOG</a>
              </li>
              <li>
                <a href="https://openai.com/about/">ABOUT</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="openai-message">
          <div className="openai-message__center">
            <span className="openai-message__join">Join us in shaping the future of technology</span>
            <div className="openai-message__btns">
              <button onClick={handleVideo}>
                <span>&#9654;</span>
                <span>WATCH VIDEO</span>
              </button>
              <a href="https://openai.com/careers/">VIEW CAREERS ›</a>
            </div>
          </div>
        </div>
      </section>
      <section className="openai-links">
        <div className="openai-links__center">
          <SvgComponent />
          <div className="openai-links__container">
            <span className="openai-links__container-items">
              <span className="openai-links__header">Featured</span>
              <ul className="openai-links__list">
                <li className="link-color">
                  <Link to="/chatgpt">ChatGPT</Link>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/dall-e-2/">DALL·E 2</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/blog/whisper/">Whisper</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/alignment/">Alignment</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/fund/">Startup Fund</a>
                </li>
              </ul>
            </span>
            <span className="openai-links__container-items">
              <span className="openai-links__header">API</span>
              <ul className="openai-links__list">
                <li className="link-color">
                  <a href="https://openai.com/api/">Overview</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/api/pricing/">Pricing</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/api/examples/">Examples</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/api/docs/">Docs</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/api/policies/">Terms & Policies</a>
                </li>
                <li className="link-color">
                  <a href="https://status.openai.com/">Status</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/api/login/">Log in</a>
                </li>
              </ul>
            </span>
            <span className="openai-links__container-items">
              <span className="openai-links__header">BLOG</span>
              <ul className="openai-links__list">
                <li className="link-color">
                  <a href="https://openai.com/blog/">Index</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/blog/tags/research/">Research</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/blog/tags/announcements/">Announcements</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/blog/tags/events/">Events</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/blog/tags/milestones/">Milestones</a>
                </li>
              </ul>
            </span>
            <span className="openai-links__container-items">
              <span className="openai-links__header">INFORMATION</span>
              <ul className="openai-links__list">
                <li className="link-color">
                  <a href="https://openai.com/about/">About Us</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/charter/">Our Charter</a>
                </li>
                <li>
                  <a href="https://openai.com/research/">Our Research</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/publications/">Publications</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/newsroom/">Newsroom</a>
                </li>
                <li className="link-color">
                  <a href="https://openai.com/careers/">Careers</a>
                </li>
              </ul>
            </span>
          </div>
        </div>
      </section>
      <footer className="openai-footer">
        <div className="openai-footer__center">
          <span className="openai-footer__left">
            <a href="https://openai.com/" className="link-color">
              OpenAI © 2015-2023
            </a>
            <a href="https://openai.com/privacy/" className="link-color">
              Privacy Policy
            </a>
            <a href="https://openai.com/terms/" className="link-color">
              Terms of Use
            </a>
          </span>
          <span className="openai-footer__right">
            <a href="https://twitter.com/openai" className="link-color">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://youtube.com/openai" className="link-color">
              <FontAwesomeIcon icon={faYoutube} />
            </a>

            <a href="https://github.com/openai/" className="link-color">
              <FontAwesomeIcon icon={faGithub} />
            </a>

            <a href="https://soundcloud.com/openai_audio" className="link-color">
              <FontAwesomeIcon icon={faSoundcloud} />
            </a>

            <a href="https://linkedin.com/company/openai" className="link-color">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>

            <a href="https://facebook.com/openai.research/" className="link-color">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
          </span>
        </div>
      </footer>
      <video className="openai-central-video hidden" src={videoBg} ref={refVideoCenter} loop controls />
      <div className="openai-overlay hidden" ref={refOverlay}></div>
    </>
  );
}
