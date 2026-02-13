/* eslint-disable react/jsx-props-no-spreading */
import { getFilesWithTags, reorder } from "../../utilities/files";
import { audioManagerSingleton } from "../../audioManager";

export async function getTracks() {
  const tracks = await getFilesWithTags({
    extensions: ".mp3, .m4a, .flac, .wav, .aac",
  });
  audioManagerSingleton.addTracks(tracks);
}

export async function getDirectory() {
  const tracks = await getFilesWithTags({
    extensions: ".mp3, .wav, .aac",
    allowDirectory: true,
  });

  audioManagerSingleton.addTracks(tracks);
}

export const getDraggableClasses = ({
  isDragging,
  currentPlaying,
}: {
  isDragging: boolean;
  currentPlaying: boolean;
}) =>
  `draggable ${isDragging ? "isDragging" : ""} ${
    currentPlaying ? "currentTrack" : ""
  }`;

export function onReorder(sourceIndex: number, destIndex: number) {
  const curr = audioManagerSingleton.state.currentTrackIndex;

  const items = reorder(
    audioManagerSingleton.state.tracks,
    sourceIndex,
    destIndex
  );

  // Update current track index to follow the playing track
  if (sourceIndex === curr) {
    audioManagerSingleton.setCurrentTrack(destIndex);
  } else if (destIndex === curr) {
    if (sourceIndex < curr) {
      audioManagerSingleton.setCurrentTrack(curr - 1);
    } else {
      audioManagerSingleton.setCurrentTrack(
        destIndex ? curr + 1 : 1
      );
    }
  } else if (sourceIndex > curr && curr > destIndex) {
    audioManagerSingleton.setCurrentTrack(curr + 1);
  } else if (sourceIndex < curr && curr < destIndex) {
    audioManagerSingleton.setCurrentTrack(curr - 1);
  }

  audioManagerSingleton.setNewTrackOrder(items);
}
