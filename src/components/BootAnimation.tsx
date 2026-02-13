import * as React from "react";
import styles from "./BootAnimation.module.scss";

interface BootAnimationProps {
  src: string;
  duration: number; // ms
  onComplete: () => void;
}

export const BootAnimation = ({ src, duration, onComplete }: BootAnimationProps) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // Allow click/keypress to skip
  React.useEffect(() => {
    const handleSkip = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter" || e.code === "Escape") {
        setVisible(false);
        onComplete();
      }
    };
    document.addEventListener("keydown", handleSkip);
    return () => document.removeEventListener("keydown", handleSkip);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={styles.wrapper}
      onClick={() => {
        setVisible(false);
        onComplete();
      }}
    >
      {/* Add cache-busting timestamp so GIF always plays from frame 1 */}
      <img
        src={`${src}?t=${Date.now()}`}
        className={styles.gif}
        alt="Boot animation"
      />
      <div className={styles.scanlines} />
    </div>
  );
};

export default BootAnimation;
