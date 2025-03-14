import { create } from 'zustand';

interface Manga {
  [key: string]: number;
}

export interface HistoricalResponse {
  favorite_chapters: Manga;
  least_favorite_chapters: Manga;
}

export enum STATUS {
  WAITING,
  GET_DATA = 200,
}

export interface HistoricalState {
  historical: HistoricalResponse;
  status: STATUS;
  putHistorical: (responses: HistoricalResponse) => void;
  setStatus: (status: STATUS) => void;
}

export const useHistoricalStore = create<HistoricalState>((set) => ({
  historical: {
    favorite_chapters: {},
    least_favorite_chapters: {},
  },
  status: STATUS.WAITING,
  putHistorical: (status) =>
    set(() => {
      return { historical: status };
    }),
  setStatus: (status) => set(() => ({ status: status })),
}));
