import * as React from "react";
import { Modal } from "./Modal";
import styles from "./SystemSettings.module.scss";

type SettingsDestination = "about" | "memoryManager" | "actionReplay" | null;

interface SystemSettingsProps {
  onClose: () => void;
  onNavigate: (destination: SettingsDestination) => void;
}

const SystemSettings = ({ onClose, onNavigate }: SystemSettingsProps) => {
  return (
    <Modal header="System Settings">
      <div className={styles.wrapper}>
        <div className={styles.menuList}>
          <button
            className={styles.menuItem}
            type="button"
            onClick={() => onNavigate("about")}
          >
            About
          </button>
          <button
            className={styles.menuItem}
            type="button"
            onClick={() => onNavigate("memoryManager")}
          >
            Memory Manager
          </button>
          <button
            className={styles.menuItem}
            type="button"
            onClick={() => onNavigate("actionReplay")}
          >
            Action Replay
          </button>
          <div className={styles.menuItemBlank}>&nbsp;</div>
        </div>
      </div>
      <button className={styles.exitButton} type="button" onClick={onClose}>
        Exit
      </button>
    </Modal>
  );
};

export default SystemSettings;
