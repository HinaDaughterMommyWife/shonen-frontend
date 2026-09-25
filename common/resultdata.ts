export interface NomineeEntry {
  votes: number;
  img: string;
  audio: string;
  maxVolume?: number;
}

export interface SurveyCategory {
  [nominee: string]: NomineeEntry;
}

export interface SurveyDarkraiStyle {
  [category: string]: SurveyCategory;
}

export const surveyDarkraiStyle: SurveyDarkraiStyle = {
  '¿Cuál "cosplay" te gusta más?': {
    'Uma Musume': {
      votes: 18,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31M0afvyShnBVF2MtIXUGmOeRr7oDwulW81c0gA',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MR6fHpQVEYDv4qNlWVgQ9w8U5iu6pScMtnxJL',
    },
    Anya: {
      votes: 69,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MZOQiNwxguYVwXSjsW02OcnaBAEfrliUbp9hN',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MXmolh9X8nApI7tVFohSYRr4sBmdWGxPM3kZ2',
    },
    Badeni: {
      votes: 81,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MyJIkisYehzBXic6SxV9m2kTKLPAC1jNQFtDI',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31Mh1TcBcB0J2vIqPHWoVTYh9FsKDpQ4E58kndz',
    },
    Itadori: {
      votes: 42,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MrXT0TwEw9HfGX0dxF1NyYnIBqVgZaT82ltQe',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MnUfSuGz14ch1dLoPsRA3gqCxyMaWm0FNijbf',
    },
    Rexnex: {
      votes: 63,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MfBxfJ2lZjTxlpen2bAsF7DaCS0QPcLgXyGBf',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MxbQvmIkXOT3bhKI6utd9sE0rleBRcVLPf7M5',
    },
    'Judio (Undertaker)': {
      votes: 76,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MPMxVgcqkrxRTQwhdgKvq7opXeHmtV2NIaDBi',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31Mji8znYNAIOiCpWeZUM2GKxwRLENYrBc9bfg3',
      maxVolume: 0.1,
    },
    'El Cuarto Joker': {
      votes: 45,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MUTy1DglPohfi7qQ1WFcbXaB2y5tDS04mEeI6',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MzLZGBAWCWa78j4IsTm9kbvScwnM3B0NOAo2l',
      maxVolume: 0.1,
    },
    Traje: {
      votes: 31,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MqlZSj7TPlue3IDLHdU20scC1iQZTFxvBVXtj',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MnUwtWo14ch1dLoPsRA3gqCxyMaWm0FNijbfQ',
    },
    'Grandiosa Forma': {
      votes: 8,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MVqXPaRc5AwvgChQD1rEsOctfqTXVadRUJByW',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MQ5cfsCFZkg9qb0NxAPdroC7OhTylfJDLsMUW',
    },
    Base: {
      votes: 18,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MZNEVSGxguYVwXSjsW02OcnaBAEfrliUbp9hN',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MBfzuKzgRcXdlwxK6u8IM49tqa7ZmYr2JhvgP',
      maxVolume: 0.1,
    },
    Navideño: {
      votes: 4,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MX9NYOT8nApI7tVFohSYRr4sBmdWGxPM3kZ2E',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MDhivP59sVhX5CKk0NTZU4tyzJ3ndrFgL2pxq',
      maxVolume: 0.1,
    },
  },
  '¿Cuál reprentación de Juan Z de Galicia te gusta más?': {
    'Ama Mola': {
      votes: 111,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31Ms0u1JheKP31Mm0JBnDg6WiToRbayfvwlQEI7',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MqlBikjHTPlue3IDLHdU20scC1iQZTFxvBVXt',
      maxVolume: 0.1,
    },
    Perro: {
      votes: 101,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MzVCIZ7WCWa78j4IsTm9kbvScwnM3B0NOAo2l',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MnetAL914ch1dLoPsRA3gqCxyMaWm0FNijbfQ',
      maxVolume: 0.1,
    },
    Sapoperro: {
      votes: 109,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31Mf8kX0slZjTxlpen2bAsF7DaCS0QPcLgXyGBf',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MzY2zuJLWCWa78j4IsTm9kbvScwnM3B0NOAo2',
      maxVolume: 0.3,
    },
    Sapo: {
      votes: 56,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MnosyUT14ch1dLoPsRA3gqCxyMaWm0FNijbfQ',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31M6aZbqpmxaznuSLPw5R1iN4UWgKvsI0AyGkTe',
      maxVolume: 0.1,
    },
    Vtuber: {
      votes: 13,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MVVB5sc5AwvgChQD1rEsOctfqTXVadRUJByWz',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31Mc3ncqbHxBfCI5ZWOTplztFNqswRm4birnVMj',
      maxVolume: 0.1,
    },
    Peabody: {
      votes: 45,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31M43iav2eQwAroWcpvbNHDVmhEgJIyx9Ot6R3i',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MP8LhZFqkrxRTQwhdgKvq7opXeHmtV2NIaDBi',
    },
    Darkrai: {
      votes: 20,
      img: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MnzpxkS14ch1dLoPsRA3gqCxyMaWm0FNijbfQ',
      audio: 'https://ttsca1a6zh.ufs.sh/f/sV23QQeKP31MLyXfrMFzH2ghUsy8JeV7lcOMSX93jB0TvmWE',
    },
  },
};