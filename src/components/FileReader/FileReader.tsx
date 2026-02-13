/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";

import { getLocalizedCopy } from "../../utilities/helpers";
import { Modal } from "../Modal";
import { useAudioManagerContext } from "../../audioManager";
import type { Track } from "../../audioManager";

import styles from "./FileReader.module.scss";

import {
  getTracks,
  onReorder,
  getDirectory,
  getDraggableClasses,
} from "./FileReader.utils";

// TODO: Fix event listener leak here
function FileReader({ toggleMenu }: { toggleMenu: () => void }) {
  const { tracks } = useAudioManagerContext();
  const { fileReader: fileReaderCopy } = getLocalizedCopy();

  return (
    <FileReaderUI
      toggleMenu={toggleMenu}
      fileReaderCopy={fileReaderCopy}
      tracks={tracks}
    />
  );
}

export const FileReaderUI = ({
  toggleMenu,
  fileReaderCopy,
  tracks,
}: {
  toggleMenu: () => void;
  fileReaderCopy: any; // TODO copy types
  tracks: Track[];
}) => {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, destIndex: number) => {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== destIndex) {
      onReorder(dragIndex, destIndex);
    }
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Modal header={fileReaderCopy.header}>
      <div className={styles.playlistWrapper}>
        <PlaylistHeader />
        {/* TODO: Small font for playlist items */}
        <div className={styles.playlistEditor}>
          <div>
            {tracks.map(({ artist, album, title, id }, index) => {
              const currentPlaying = false;
              const isDragging = dragIndex === index;

              return (
                <div
                  key={id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={getDraggableClasses({
                    isDragging,
                    currentPlaying,
                  })}
                >
                  <div>{currentPlaying ? "▱" : index + 1}</div>
                  <div>{title}</div>
                  <div>{artist}</div>
                  <div>{album}</div>
                  <button
                    className="icon-button"
                    type="button"
                  >
                    ▵
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.editorControlButtons}>
        <button className={styles.saturnButton} onClick={() => getDirectory()}>
          Add a directory
        </button>
        <button
          className={styles.saturnButton}
          type="button"
          onClick={() => getTracks()}
        >
          Add file(s)
        </button>
      </div>
      <div style={{ marginTop: "auto" }}>
        <button
          className={styles.saturnButton}
          type="button"
          onClick={toggleMenu}
        >
          Exit
        </button>
      </div>
    </Modal>
  );
};

const PlaylistHeader = () => {
  const { playlist: playlistCopy } = getLocalizedCopy();

  return (
    <div className={styles.playlistHeaderWrapper}>
      <div>{playlistCopy.number}</div>
      <div>{playlistCopy.title}</div>
      <div>{playlistCopy.artist}</div>
      <div>{playlistCopy.album}</div>
      <div />
    </div>
  );
};

export default FileReader;
