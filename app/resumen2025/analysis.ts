export interface MangaStat {
  manga: string;
  appearances: number;
  ranks: number[];
  bestRank: number;
  worstRank: number;
  avgRank: number;
  medianRank: number;
  timesAt1: number;
  timesInTop3: number;
  timesInTop5: number;
}

export interface TopAvgEntry {
  manga: string;
  avgRank: number;
  bestRank: number;
  timesAt1: number;
}

export interface TopBestEntry {
  manga: string;
  bestRank: number;
  avgRank: number;
}

export interface TopPointsEntry {
  manga: string;
  points: number;
  appearances: number;
}

export interface FavoriteSection {
  totalMangas: number;
  topByAvg: TopAvgEntry[];
  topByBest: TopBestEntry[];
  topByFavPoints: TopPointsEntry[];
  stats: MangaStat[];
}

export interface LeastSection {
  totalMangas: number;
  topByAvg: TopAvgEntry[];
  stats: MangaStat[];
}

export interface CombinedEntry {
  manga: string;
  favAppearances: number;
  favBest: number | null;
  favAvg: number | null;
  favTimesAt1: number;
  favPoints: number;
  leastAppearances: number;
  leastBest: number | null;
  leastAvg: number | null;
  leastTimesAt1: number;
  leastPoints: number;
  receivedPoints: number;
  netPoints: number;
}

export interface AnalysisOutput {
  totalWeeks: number;
  minAppearancesUsed: number;
  favorite: FavoriteSection;
  least: LeastSection;
  combined: CombinedEntry[];
  topByReceivedPoints: { manga: string; receivedPoints: number }[];
}
