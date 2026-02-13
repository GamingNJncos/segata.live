import * as React from "react";
import StarfieldScene from "./scene";
import styles from "./Starfield.module.scss";
import clsx from "clsx";

const useStarfieldScene = (containerRef: any, shouldShowSpaceship: boolean) => {
  const sceneRef = React.useRef<StarfieldScene | null>(null);
  const [hasRendered, setHasRendered] = React.useState(false);

  React.useEffect(() => {
    const scene = new StarfieldScene();
    sceneRef.current = scene;
    containerRef?.current?.appendChild(scene.domElement);
    setHasRendered(true);

    // Pause all rendering when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        scene.stop();
      } else {
        scene.start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    sceneRef.current?.toggleSpaceShipVisbility(shouldShowSpaceship);
  }, [shouldShowSpaceship]);

  return hasRendered;
};

export const Starfield = ({ isUiHidden }: { isUiHidden: boolean }) => {
  const containerRef = React.useRef<undefined>();

  const hasRendered = useStarfieldScene(containerRef, isUiHidden);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.wrapper, {
        [styles.fadeIn]: hasRendered,
      })}
    />
  );
};

export default Starfield;
