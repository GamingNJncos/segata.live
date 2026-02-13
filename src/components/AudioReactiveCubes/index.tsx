import * as React from "react";
import AudioReactiveCubesScene from "./scene";
import clsx from "clsx";
import styles from "./AudioReactiveCubes.module.scss";

const useCubesScene = (
  containerRef: any,
  shouldHide: boolean
) => {
  const [scene, setScene] = React.useState<AudioReactiveCubesScene | null>(
    null
  );
  React.useEffect(() => {
    scene && containerRef?.current?.appendChild(scene.domElement);
    // only run when scene changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  React.useEffect(() => {
    setScene(new AudioReactiveCubesScene());
  }, []);

  React.useEffect(() => {
    scene?.setVisible(!shouldHide);
  }, [scene, shouldHide]);
};

const AudioReactiveCubes = ({ shouldHide }: { shouldHide: boolean }) => {
  const containerRef = React.useRef<undefined | HTMLDivElement>();
  useCubesScene(containerRef, shouldHide);

  return (
    <div
      ref={containerRef}
      className={clsx(styles.wrapper, {
        [styles.exitAnimation]: shouldHide,
      })}
    />
  );
};

export default AudioReactiveCubes;
