import { URLS } from '@/common';
import { EmoteData } from '@/common/emotes';
import Header from '@/components/Header';
import Main from '@/components/Main';
import TopWindow from '@/components/TopWindow';
import { DvdProvider } from '@/providers/DvdSettings';
import StateManagerProvider from '@/providers/StateManager';
import { Section, useSectionStore } from '@/store';
import { HistoricalResponse } from '@/store/historical';
import { CloudInterface, SurveyResponse } from '@/store/survey';
import { unpack } from 'msgpackr';

interface SearchParams {
  section: string;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  let dataSurvey: SurveyResponse;
  let statusData: number;
  let dataExperimental: CloudInterface[];

  let dataHistorical: HistoricalResponse;

  let emoteData: Record<string, EmoteData>;

  try {
    const resSurvey = await fetch(URLS.API + '/survey/lastKey', {
      next: { revalidate: 800, tags: ['survey'] },
    });
    dataSurvey = await resSurvey.json();
    statusData = resSurvey.status;

    const resHistorical = await fetch(URLS.API + '/survey/historicalPositions', {
      next: { revalidate: 800, tags: ['historical'] },
    });
    dataHistorical = await resHistorical.json();

    const resExperimental = await fetch(URLS.API + '/experiment/cloud-1', {
      next: { revalidate: 800, tags: ['experimental'] },
    })

    dataExperimental = await resExperimental.json();

    const resEmotedDataBuffer = await fetch(
      "https://8oyqmsgy9y.ufs.sh/f/ajOhhXLQGf1JbvgMSzjQpmVDajoTKMhYsuXt5kAZ6gSGelr2"
      , {
        next: { revalidate: 3600, tags: ['emoteData'] }
      })

    const emoteArrayBuffer = await resEmotedDataBuffer.arrayBuffer();

    emoteData = unpack(new Uint8Array(emoteArrayBuffer)) as Record<string, EmoteData>;

  } catch (e) {
    dataSurvey = {
      favorite_chapters: {
        dummy: 0,
      },
      least_favorite_chapters: {
        dummy: 0,
      },
      selectedComments: [],
    };

    statusData = -1;

    dataHistorical = {
      favorite_chapters: {
        dummy: 0,
      },
      least_favorite_chapters: {
        dummy: 0,
      },
    };
    dataExperimental = [];
    emoteData = {};
  }

  const params = await searchParams;

  const section = (params.section || Section.LIKED) as Section;

  return (
    <StateManagerProvider initialSection={section}>
      <DvdProvider>
        <Header />
        <Main historicalData={dataHistorical} surveyData={dataSurvey} responseStatus={statusData} experimentalData={dataExperimental} emotesData={emoteData} />
        <TopWindow />
      </DvdProvider>
    </StateManagerProvider>
  );
}
