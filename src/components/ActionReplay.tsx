import * as React from "react";
import styles from "./ActionReplay.module.scss";

type ARScreen = "main" | "startGame" | "selectCheats" | "memoryManager" | "credits";

// Placeholder save entries A-Z
const placeholderEntries = Array.from({ length: 26 }, (_, i) => {
  const letter = String.fromCharCode(65 + i);
  return { name: `${letter}.txt`, size: Math.floor(Math.random() * 90) + 5 };
});

interface ActionReplayProps {
  onClose: () => void;
  onSystemSettings: () => void;
}

const ActionReplay = ({ onClose, onSystemSettings }: ActionReplayProps) => {
  const [screen, setScreen] = React.useState<ARScreen>("main");

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {screen === "main" && (
          <MainMenu
            onNavigate={setScreen}
            onClose={onClose}
          />
        )}
        {screen === "startGame" && (
          <StartGame onBack={() => setScreen("main")} />
        )}
        {screen === "selectCheats" && (
          <SelectCheats onBack={() => setScreen("main")} />
        )}
        {screen === "memoryManager" && (
          <ARMemoryManager onBack={() => setScreen("main")} />
        )}
        {screen === "credits" && (
          <Credits onBack={() => setScreen("main")} />
        )}
      </div>

      <div className={styles.bottomNav}>
        <button className={styles.navButton} type="button" onClick={onClose}>
          Exit
        </button>
        <button
          className={styles.navButton}
          type="button"
          onClick={onSystemSettings}
        >
          System Settings
        </button>
      </div>
    </div>
  );
};

/* ── Main Menu ── */
const MainMenu = ({
  onNavigate,
  onClose,
}: {
  onNavigate: (s: ARScreen) => void;
  onClose: () => void;
}) => {
  return (
    <div className={styles.mainMenu}>
      <div className={styles.titleBar}>
        Action Replay (Plus) Version 2.02
      </div>

      <div className={styles.sectionHeader}>Main Menu</div>

      <div className={styles.menuItems}>
        <button
          className={styles.menuButton}
          type="button"
          onClick={() => onNavigate("startGame")}
        >
          Start Game
        </button>
        <button
          className={styles.menuButton}
          type="button"
          onClick={() => onNavigate("selectCheats")}
        >
          Select Cheats
        </button>
        <button
          className={styles.menuButton}
          type="button"
          onClick={() => onNavigate("memoryManager")}
        >
          Memory Manager
        </button>
        <button
          className={styles.menuButton}
          type="button"
          onClick={() => onNavigate("credits")}
        >
          Credits
        </button>
      </div>

      <div className={styles.infoBlock}>
        <p>No Game Selected</p>
        <p>No Cheat Codes Are On</p>
      </div>

      <div className={styles.hint}>
        Up/Down to Highlight, Button A Selects
      </div>
    </div>
  );
};

/* ── Start Game ── */
const StartGame = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className={styles.subScreen}>
      <div className={styles.titleBar}>Start Game</div>

      <div className={styles.subContent}>
        <div className={styles.disabledOption}>Start Game With Enhancements</div>
        <div className={styles.disabledOption}>Start Game Without Enhancements</div>
      </div>

      <div className={styles.hint}>
        <button className={styles.backButton} type="button" onClick={onBack}>
          B: Back
        </button>
      </div>
    </div>
  );
};

/* ── Select Cheats ── */
const SelectCheats = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className={styles.subScreen}>
      <div className={styles.titleBar}>Select Cheats</div>

      <div className={styles.subContent}>
        <div className={styles.disabledOption}>No Games Available</div>
        <div className={styles.disabledOption}>Add New Game</div>
      </div>

      <div className={styles.hint}>
        <button className={styles.backButton} type="button" onClick={onBack}>
          B: Back
        </button>
      </div>
    </div>
  );
};

/* ── Action Replay Memory Manager ── */
const ARMemoryManager = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className={styles.subScreen}>
      <div className={styles.titleBar}>Action Replay Memory Manager</div>

      <div className={styles.memoryColumns}>
        {/* System Memory */}
        <div className={styles.memColumn}>
          <div className={styles.memColumnHeader}>
            <span>System Memory</span>
          </div>
          <div className={styles.memColumnLabels}>
            <span>Name</span>
            <span>Size</span>
          </div>
          <div className={styles.memScrollBox}>
            {placeholderEntries.map((entry, i) => (
              <div key={`sys-${i}`} className={styles.memEntry}>
                <span className={styles.memName}>{entry.name}</span>
                <span className={styles.memSize}>{entry.size}</span>
              </div>
            ))}
          </div>
          <div className={styles.memFree}>Free: 197/510</div>
        </div>

        {/* Cartridge Memory */}
        <div className={styles.memColumn}>
          <div className={styles.memColumnHeader}>
            <span>Cartridge Memory</span>
          </div>
          <div className={styles.memColumnLabels}>
            <span>Name</span>
            <span>Size</span>
          </div>
          <div className={styles.memScrollBox}>
            {placeholderEntries.map((entry, i) => (
              <div key={`cart-${i}`} className={styles.memEntry}>
                <span className={styles.memName}>{entry.name}</span>
                <span className={styles.memSize}>{entry.size}</span>
              </div>
            ))}
          </div>
          <div className={styles.memFree}>Free: 7877/8190</div>
        </div>
      </div>

      <div className={styles.memWarning}>
        You Must Exit to Save Any Changes
      </div>

      <div className={styles.memControls}>
        <button className={styles.backButton} type="button" onClick={onBack}>
          B: Exit
        </button>
        <span className={styles.controlHint}>C: Copy</span>
        <span className={styles.controlHint}>Z: Delete</span>
      </div>
    </div>
  );
};

/* ── Credits ── */
const Credits = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className={styles.subScreen}>
      <div className={styles.titleBar}>Credits</div>

      <div className={styles.creditsContent}>
        <p>Programming</p>
        <p className={styles.creditName}>segata.live</p>
        <p>Graphics</p>
        <p className={styles.creditName}>segata.live</p>
        <p>Testing</p>
        <p className={styles.creditName}>segata.live</p>
      </div>

      <div className={styles.hint}>
        <button className={styles.backButton} type="button" onClick={onBack}>
          B: Back
        </button>
      </div>
    </div>
  );
};

export default ActionReplay;
