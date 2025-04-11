import { create } from 'zustand';
import { CloudInterface } from './survey';

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
  experimental: CloudInterface[];
  putHistorical: (responses: HistoricalResponse) => void;
  putExperimental: (responses: CloudInterface[]) => void;
  setStatus: (status: STATUS) => void;
}

export const useHistoricalStore = create<HistoricalState>((set) => ({
  historical: {
    favorite_chapters: {},
    least_favorite_chapters: {},
  },
  experimental: [],
  status: STATUS.WAITING,
  putHistorical: (status) =>
    set(() => {
      return { historical: status };
    }),
  putExperimental: (experimental) => set(() => ({ experimental })),
  setStatus: (status) => set(() => ({ status: status }))
}));
