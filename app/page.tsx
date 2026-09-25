import { URLS } from '@/common';
import { EMOTES_TUTORIAL_IMAGE_URL, EmoteData } from '@/common/emotes';
import Header from '@/components/Header';
import Main from '@/components/Main';
import TopWindow from '@/components/TopWindow';
import StateManagerProvider from '@/providers/StateManager';
import { Section } from '@/store';
import { HistoricalResponse } from '@/store/historical';
import { CloudInterface, SurveyResponse } from '@/store/survey';
import { fetchFirstOkText } from '@/lib/fetchPastebin';
import { unpack } from 'msgpackr';
import { TextQueueProvider } from '../providers/TextQueueContext';

interface SearchParams {
  section: string;
}

const PASTEBIN_REVALIDATE = process.env.NODE_ENV === 'development' ? 3 : 30;

/** Header subtitle — first OK wins; add more mirrors for failover. */
const PASTEBIN_HEADER_URLS = [
  'https://pastebin.com/raw/DDKHUA5V',
  // 'https://pastebin.com/raw/BACKUP_ID',
];

/** Comment markdown — independent of header; first OK wins. */
const PASTEBIN_MARKDOWN_URLS = [
  'https://pastebin.com/raw/BdyMKKKF',
  // 'https://pastebin.com/raw/BACKUP_ID',
];

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  let dataSurvey: SurveyResponse;
  let statusData: number;
  let dataExperimental: CloudInterface[];

  let dataHistorical: HistoricalResponse;

  let emoteData: Record<string, EmoteData>;
  let pastebinMarkdown = '';
  let pastebinHeaderText = '';

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
    });

    dataExperimental = await resExperimental.json();

    const resEmotedDataBuffer = await fetch(
      EMOTES_TUTORIAL_IMAGE_URL,
      {
        next: { revalidate: 3600, tags: ['emoteData'] },
      },
    );

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

  const [headerResult, markdownResult] = await Promise.all([
    fetchFirstOkText(PASTEBIN_HEADER_URLS, {
      next: { revalidate: PASTEBIN_REVALIDATE, tags: ['pastebin-header'] },
    }),
    fetchFirstOkText(PASTEBIN_MARKDOWN_URLS, {
      next: { revalidate: PASTEBIN_REVALIDATE, tags: ['pastebin-markdown'] },
    }),
  ]);
  pastebinHeaderText = headerResult;
  pastebinMarkdown = markdownResult;

  const params = await searchParams;

  const section = (params.section || Section.LIKED) as Section;

  return (
    <StateManagerProvider initialSection={section}>
      <TextQueueProvider>
        <Header emotesData={emoteData} headerText={pastebinHeaderText} />
        <Main
          historicalData={dataHistorical}
          surveyData={dataSurvey}
          responseStatus={statusData}
          experimentalData={dataExperimental}
          emotesData={emoteData}
          pastebinMarkdown={pastebinMarkdown}
        />
        <TopWindow />
      </TextQueueProvider>
    </StateManagerProvider>
  );
}
