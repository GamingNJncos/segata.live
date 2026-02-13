import * as React from "react";
import { Modal } from "./Modal";
import styles from "./MemoryManager.module.scss";

// BIOS boot animation entries
const biosEntries = [
  { name: "US", id: "us" },
  { name: "Victor", id: "victor" },
  { name: "Hisaturn", id: "hisaturn" },
];

// Cartridge Memory link entries (placeholder)
const cartridgeEntries: { name: string; href: string }[] = [];

interface MemoryManagerProps {
  onClose: () => void;
  onSystemSettings: () => void;
}

const MemoryManager = ({ onClose, onSystemSettings }: MemoryManagerProps) => {
  return (
    <Modal header="Memory Manager">
      <div className={styles.wrapper}>
        <div className={styles.columns}>
          {/* BIOS column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>BIOS</div>
            <div className={styles.scrollBox}>
              {biosEntries.map((entry) => (
                <div key={entry.id} className={styles.entryDisabled}>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>

          {/* Cartridge Memory column */}
          <div className={styles.column}>
            <div className={styles.columnHeader}>Cartridge Memory</div>
            <div className={styles.scrollBox}>
              {cartridgeEntries.length === 0 && (
                <div className={styles.emptyText}>No items</div>
              )}
              {cartridgeEntries.map((entry, i) => (
                <div key={i} className={styles.entryDisabled}>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.navBar}>
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
    </Modal>
  );
};

export default MemoryManager;
