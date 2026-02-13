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

export const CreateAudioContextButton = (): null => {
  const hasInit = React.useRef(false);

  React.useEffect(() => {
    if (!hasInit.current) {
      hasInit.current = true;
      initApp();
    }
  }, []);

  return null;
};
