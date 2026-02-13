import * as React from "react";
import { audioManagerSingleton } from "../audioManager";
import styles from "./CreateAudioContextButton.module.scss";
import introSrc from "../effects/intro.mp3";
import { preloadImages } from "../utilities/preloadImages";

const initApp = () => {
  preloadImages();
  const audioElement = new Audio();
  audioElement.src = introSrc;
  window.setTimeout(() => {
    audioElement.play();
  }, 500);
  audioManagerSingleton.init();
};

export const CreateAudioContextButton = () => {
  const hasInit = React.useRef(false);

  React.useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      initApp();
    }
  }, []);

  // Keep the UI structure — will be replaced with an intro animation
  return (
    <div className={styles.wrapper} style={{ display: "none" }}>
      <div className={styles.warning}>
        <h1>⚠️ WARNING: PHOTOSENSITIVITY ⚠️</h1>
        <p>This app displays flashing colors and shapes</p>
      </div>
      <button type="button" onClick={initApp}>
        Click to Start
      </button>
    </div>
  );
};
