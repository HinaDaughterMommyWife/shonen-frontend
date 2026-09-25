import { EMOTES_TUTORIAL_IMAGE_URL, EmoteData } from '@/common/emotes';
import { AnalysisOutput } from './analysis';
import analysisData from './analysis-output.json';
import {
  YearHeader,
  DeveloperNote,
  ChampionSpotlight,
  LoserSpotlight,
  TopFavorites,
  MostPopular,
  LeastPopular,
  DominationStats,
  TeamComparison,
  StatsLegend,
} from '@/components/ResumenStats';
import { unpack } from 'msgpackr';

export default async function ResumenPage() {
  const data = analysisData as AnalysisOutput;

  // Get champion by netPoints
  const champion = [...data.combined].sort((a, b) => b.netPoints - a.netPoints)[0];
  const loser = [...data.combined].sort((a, b) => a.netPoints - b.netPoints)[0];

  let emoteData: Record<string, EmoteData>;

  try {
    const resEmotedDataBuffer = await fetch(EMOTES_TUTORIAL_IMAGE_URL, {
      next: { revalidate: 3600, tags: ['emoteData'] },
    });

    const emoteArrayBuffer = await resEmotedDataBuffer.arrayBuffer();

    emoteData = unpack(new Uint8Array(emoteArrayBuffer)) as Record<string, EmoteData>;
  } catch (e) {
    emoteData = {};
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-6 md:px-8 py-12 max-w-7xl">
        {/* Year Header */}
        <YearHeader data={data} />

        {/* Developer Note */}
        <DeveloperNote emoteData={emoteData} />

        {/* Stats Legend */}
        <StatsLegend />

        {/* Most Loved (favTimesAt1) */}
        <MostPopular combined={data.combined} />

        {/* Most Hated (leastTimesAt1) */}
        <LeastPopular combined={data.combined} />

        {/* Top by Net Score */}
        <TopFavorites combined={data.combined} />

        {/* Champion Spotlight */}
        <ChampionSpotlight champion={champion} />

        {/* Loser Spotlight */}
        <LoserSpotlight loser={loser} />

        {/* Domination Stats */}
        <DominationStats combined={data.combined} />

        {/* Team Comparison */}
        <TeamComparison combined={data.combined} />

        {/* Footer */}
        <div className="text-center text-gray-500 mt-16 pb-8">
          <p className="text-sm">
            Estadísticas generadas con la data de {data.totalWeeks} semanas de votaciones
          </p>
          <p className="text-xs mt-2">Resumen 2025 • Creado por un <a href="https://x.com/AOi_646/status/2007109628132463000" target="_blank" rel="noopener noreferrer" className='underline text-purple-600'>Hina Lover</a> 💕</p>
        </div>
      </div>
    </div>
  );
}
