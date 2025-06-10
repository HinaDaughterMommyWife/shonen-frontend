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

type Emote = StaticEmote | AnimatedEmote;

export interface EmoteData {
  username: string;
  filePaths: FilePaths;
  emotes: Record<string, Emote>;
}

let EMOTES_DATA: Record<string, EmoteData> = {};

export function getEmotesData() {
  return EMOTES_DATA;
}

export function setEmotesData(data: Record<string, EmoteData>) {
  EMOTES_DATA = data;
}
