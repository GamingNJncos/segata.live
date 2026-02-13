import * as React from "react";
import dynamic from "next/dynamic";

import { useAudioManagerContext } from "../audioManager";
import About from "../components/About";
import AudioReactiveCubes from "../components/AudioReactiveCubes";
import { DashboardBackground } from "../components/DashboardBackground";
import Header from "../components/Header";
import Menu from "../components/MenuHooks";
import SystemSettings from "../components/SystemSettings";
import MemoryManager from "../components/MemoryManager";
import ActionReplay from "../components/ActionReplay";
import { usePrevious } from "../hooks";
import styles from "./FullApp.module.scss";

const FileReader = dynamic(
  () => import("../components/FileReader/FileReader"),
  { ssr: false }
);

type SettingsScreen = null | "systemSettings" | "about" | "memoryManager" | "actionReplay";

const FullApp = ({
  isUiHidden,
  setIsUiHidden,
  onAdvanced,
}: {
  isUiHidden: boolean;
  setIsUiHidden: (_: boolean) => void;
  onAdvanced?: () => void;
}) => {
  const [isExitAnimationFinished, setIsExitAnimationFinished] =
    React.useState(false);
  const { repeat, audioStatus } = useAudioManagerContext();
  const [showFileInput, setShowFileInput] = React.useState(false);
  const [settingsScreen, setSettingsScreen] = React.useState<SettingsScreen>(null);
  const wasHidden = usePrevious(isUiHidden);

  React.useEffect(() => {
    if (isUiHidden) {
      setIsExitAnimationFinished(false);
      window.setTimeout(() => setIsExitAnimationFinished(true), 2500);
    } else {
      setIsExitAnimationFinished(true);
    }
  }, [isUiHidden]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        if (settingsScreen) {
          setSettingsScreen(null);
        } else {
          setIsUiHidden(false);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [settingsScreen]);

  const closeSettings = () => setSettingsScreen(null);

  return (
    <main
      className={styles.wrapper}
      onClick={() => {
        if (isUiHidden && isExitAnimationFinished) {
          setIsUiHidden(false);
        }
      }}
    >
      <Header
        showExitAnimation={isUiHidden}
        showEntranceAnimation={!isUiHidden && wasHidden}
      />
      <Menu
        isUiHidden={isUiHidden}
        showIfHidden={() => isUiHidden && setIsUiHidden(false)}
        toggleMenu={() => setShowFileInput(true)}
        toggleAbout={() => setSettingsScreen("systemSettings")}
        toggleDashVisibility={() => setIsUiHidden(true)}
        onSettings={() => {
          if (onAdvanced) {
            onAdvanced();
          }
        }}
        repeat={repeat}
        audioStatus={audioStatus}
      />
      <AudioReactiveCubes shouldHide={isUiHidden} />
      {showFileInput && (
        <FileReader toggleMenu={() => setShowFileInput(false)} />
      )}

      {/* Settings navigation */}
      {settingsScreen === "systemSettings" && (
        <SystemSettings
          onClose={closeSettings}
          onNavigate={(dest) => {
            if (dest) setSettingsScreen(dest as SettingsScreen);
          }}
        />
      )}
      {settingsScreen === "about" && (
        <About toggleAbout={closeSettings} />
      )}
      {settingsScreen === "memoryManager" && (
        <MemoryManager
          onClose={closeSettings}
          onSystemSettings={() => setSettingsScreen("systemSettings")}
        />
      )}
      {settingsScreen === "actionReplay" && (
        <ActionReplay
          onClose={closeSettings}
          onSystemSettings={() => setSettingsScreen("systemSettings")}
        />
      )}

      <DashboardBackground isUiHidden={isUiHidden} />
    </main>
  );
};

export default FullApp;
