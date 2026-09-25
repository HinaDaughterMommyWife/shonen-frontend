export const EMOTES_TUTORIAL_IMAGE_URL =
  'https://8oyqmsgy9y.ufs.sh/f/ajOhhXLQGf1JG1bzvnEYs8zrLblxqWZUc1gm59uSvi2TjQe0';

interface EmoteFile {
  fileURL: string;
  gridSize: number;
}

interface FilePaths {
  static: EmoteFile;
  animated: EmoteFile;
}

interface StaticEmote {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AnimatedEmote extends StaticEmote {
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animationDuration: number;
}

export type Emote = StaticEmote | AnimatedEmote;

export interface EmoteData {
  username: string;
  filePaths: FilePaths;
  emotes: Record<string, Emote>;
}

let EMOTES_DATA: Record<string, EmoteData> = {};
const listeners = new Set<() => void>();

export function getEmotesData() {
  return EMOTES_DATA;
}

export function setEmotesData(data: Record<string, EmoteData>) {
  EMOTES_DATA = data;
  listeners.forEach((listener) => listener());
}

export function subscribeEmotesData(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
