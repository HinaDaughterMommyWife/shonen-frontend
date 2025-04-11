import { URLS } from '@/common';
import Header from '@/components/Header';
import Main from '@/components/Main';
import TopWindow from '@/components/TopWindow';
import { HistoricalResponse } from '@/store/historical';
import { CloudInterface, SurveyResponse } from '@/store/survey';

export default async function Home() {
  let dataSurvey: SurveyResponse;
  let statusData: number;
  let dataExperimental: CloudInterface[];

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

    const resExperimental = await fetch(URLS.API + '/experiment/cloud-1', {
      next: { revalidate: 800, tags: ['experimental'] },
    })

    dataExperimental = await resExperimental.json();


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
  }

  return (
    <>
      <Header />
      <Main historicalData={dataHistorical} surveyData={dataSurvey} responseStatus={statusData} experimentalData={dataExperimental} />
      <TopWindow />
    </>
  );
}
