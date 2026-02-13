import * as React from "react";
import {
  AudioManagerContextProvider,
  useAudioManagerContext,
} from "../audioManager";
import { CreateAudioContextButton } from "../components/CreateAudioContextButton";
import dynamic from "next/dynamic";
import styles from "./App.module.scss";

// Don't load three.js until an audio context is
const FullApp = dynamic(() => import("./FullApp"), { ssr: false });
const Starfield = dynamic(() => import("../components/Starfield/Starfield"), {
  ssr: false,
});
const TVOverlay = dynamic(() => import("../components/TVOverlay"), {
  ssr: false,
});
const BootAnimation = dynamic(
  () => import("../components/BootAnimation"),
  { ssr: false }
);

const BOOT_ANIMATION = {
  src: "/animations/saturn-startup.gif",
  duration: 5200,
};

const App = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [bootComplete, setBootComplete] = React.useState(false);
  const { audioContextState } = useAudioManagerContext();
  const [isUiHidden, setIsUiHidden] = React.useState(false);
  const [isOnAV, setIsOnAV] = React.useState(false);

  const handleReachAV = React.useCallback(() => setIsOnAV(true), []);
  const handleLeaveAV = React.useCallback(() => setIsOnAV(false), []);
  const handleBootComplete = React.useCallback(() => setBootComplete(true), []);

  // Ref to the TVOverlay's cycle function so the menu can trigger it
  const cycleChannelRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      {/* Boot animation plays first */}
      {hasMounted && !bootComplete && (
        <BootAnimation
          src={BOOT_ANIMATION.src}
          duration={BOOT_ANIMATION.duration}
          onComplete={handleBootComplete}
        />
      )}

      {audioContextState !== "suspended" && (
        <FullApp
          isUiHidden={isUiHidden}
          setIsUiHidden={setIsUiHidden}
          onAdvanced={() => {
            // "Coming Soon" / settings button cycles the TV channel
            if (cycleChannelRef.current) {
              cycleChannelRef.current();
            }
          }}
        />
      )}
      {audioContextState === "suspended" && <CreateAudioContextButton />}
      {hasMounted && <Starfield isUiHidden={isUiHidden} />}
      <div className={styles.galaxy} />
      {hasMounted && bootComplete && (
        <TVOverlay
          onReachAV={handleReachAV}
          onLeaveAV={handleLeaveAV}
          cycleChannelRef={cycleChannelRef}
        />
      )}
    </>
  );
};

export const AppWithAudioContextProvider = () => (
  <AudioManagerContextProvider>
    <App />
  </AudioManagerContextProvider>
);
