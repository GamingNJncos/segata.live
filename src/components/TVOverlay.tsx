import * as React from "react";
import styles from "./TVOverlay.module.scss";

// Channel definitions — Ch3 and Ch4 show static, AV is the real app
const CHANNELS = [
  { id: "ch3", label: "CH 3" },
  { id: "ch4", label: "CH 4" },
  { id: "av", label: "AV" },
] as const;

interface TVOverlayProps {
  onReachAV: () => void;
  onLeaveAV: () => void;
  cycleChannelRef?: React.MutableRefObject<(() => void) | null>;
}

export const TVOverlay = ({ onReachAV, onLeaveAV, cycleChannelRef }: TVOverlayProps) => {
  const [channelIndex, setChannelIndex] = React.useState(0);
  const [showChannelLabel, setShowChannelLabel] = React.useState(true);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafRef = React.useRef<number>(null);
  const labelTimerRef = React.useRef<number>(null);

  const currentChannel = CHANNELS[channelIndex];
  const isStatic = currentChannel.id !== "av";

  const cycleChannel = React.useCallback(() => {
    setIsTransitioning(true);

    // Brief flash on channel change
    setTimeout(() => {
      setChannelIndex((prev) => {
        const next = (prev + 1) % CHANNELS.length;
        return next;
      });
      setIsTransitioning(false);
      setShowChannelLabel(true);

      // Clear any existing timer
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
      labelTimerRef.current = window.setTimeout(() => {
        setShowChannelLabel(false);
      }, 2500);
    }, 80);
  }, []);

  // Expose cycleChannel to parent via ref
  React.useEffect(() => {
    if (cycleChannelRef) {
      cycleChannelRef.current = cycleChannel;
    }
  }, [cycleChannel, cycleChannelRef]);

  // Notify parent when we land on or leave AV
  React.useEffect(() => {
    if (currentChannel.id === "av") {
      onReachAV();
    } else {
      onLeaveAV();
    }
  }, [currentChannel.id, onReachAV, onLeaveAV]);

  // Keyboard: spacebar to cycle, escape to jump to AV
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && isStatic) {
        e.preventDefault();
        cycleChannel();
      }
      if (e.code === "Escape") {
        // Jump directly to AV channel
        setChannelIndex(CHANNELS.length - 1);
        setShowChannelLabel(true);
        if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
        labelTimerRef.current = window.setTimeout(() => {
          setShowChannelLabel(false);
        }, 2500);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [cycleChannel, isStatic]);

  // Draw TV static noise on canvas
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isStatic) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Low res for that chunky CRT look
    canvas.width = 200;
    canvas.height = 150;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;

    const drawStatic = () => {
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      rafRef.current = requestAnimationFrame(drawStatic);
    };

    drawStatic();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isStatic]);

  // Show label briefly on initial mount
  React.useEffect(() => {
    labelTimerRef.current = window.setTimeout(() => {
      setShowChannelLabel(false);
    }, 2500);
    return () => {
      if (labelTimerRef.current) clearTimeout(labelTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* Static noise overlay — only visible on Ch3/Ch4 */}
      <div
        className={`${styles.overlay} ${isStatic ? styles.visible : styles.hidden}`}
        onClick={cycleChannel}
      >
        <canvas ref={canvasRef} className={styles.staticCanvas} />

        {/* Scanlines */}
        <div className={styles.scanlines} />

        {/* Screen curvature vignette */}
        <div className={styles.vignette} />

        {/* Transition flash */}
        {isTransitioning && <div className={styles.flash} />}
      </div>

      {/* Channel label — shows on all channels including AV */}
      {showChannelLabel && (
        <div className={styles.channelLabel}>
          <span className={styles.channelText}>{currentChannel.label}</span>
        </div>
      )}

      {/* Invisible cycle button — always present at same screen position when on static channels */}
      {isStatic && (
        <button
          className={styles.invisibleCycleButton}
          onClick={cycleChannel}
          aria-label="Change channel"
          type="button"
        />
      )}
    </>
  );
};

export default TVOverlay;
