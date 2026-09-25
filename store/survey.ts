import { create } from 'zustand';

interface Manga {
  [key: string]: number;
}

export interface SelectedCommentObject {
  comment: string;
  favorite_chapter: string;
  least_favorite_chapter: string;
}

export interface SurveyResponse {
  favorite_chapters: Manga;
  least_favorite_chapters: Manga;
  selectedComments: string[] | SelectedCommentObject[];
}

export interface CloudInterface {
  text: string;
  value: number;
}

export enum STATUS {
  WAITING,
  GET_DATA = 200,
}

export interface SurveyState {
  survey: SurveyResponse;
  status: STATUS;
  putSurvey: (responses: SurveyResponse) => void;
  setStatus: (status: STATUS) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  survey: {
    favorite_chapters: {},
    least_favorite_chapters: {},
    selectedComments: [],
  },
  status: STATUS.WAITING,
  putSurvey: (status) =>
    set(() => {
      return { survey: status };
    }),
  setStatus: (status) => set(() => ({ status: status })),
}));

export function initializeSurveyStore(data: SurveyResponse) {
  useSurveyStore.setState({ survey: data });
}
