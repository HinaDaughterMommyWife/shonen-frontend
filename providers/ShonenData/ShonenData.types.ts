interface Manga {
  [key: string]: number;
}

export interface SurveyResponse {
  favorite_chapters: Manga;
  least_favorite_chapters: Manga;
  selectedComments: string[];
}

export interface ShonenDataStateProps {
  survey: SurveyResponse;
}

export interface ShonenDataProviderProps {
  children: React.ReactNode;
}

export interface ShonenDataContextProps extends Omit<ShonenDataProviderProps, 'children'> {}
