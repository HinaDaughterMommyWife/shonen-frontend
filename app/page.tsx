import { URLS } from '@/common';
import Header from '@/components/Header';
import Main from '@/components/Main';
import TopWindow from '@/components/TopWindow';
import { HistoricalResponse } from '@/store/historical';
import { SurveyResponse } from '@/store/survey';

export default async function Home() {
  let dataSurvey: SurveyResponse;
  let statusData: number;

  let dataHistorical: HistoricalResponse;

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
  }

  return (
    <>
      <Header />
      <Main historicalData={dataHistorical} surveyData={dataSurvey} responseStatus={statusData} />
      <TopWindow />
    </>
  );
}
