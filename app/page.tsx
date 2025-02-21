import { URLS } from '@/common';
import Header from '@/components/Header';
import Main from '@/components/Main';
import TopWindow from '@/components/TopWindow';
import { SurveyResponse } from '@/store/survey';

export default async function Home() {
  let data: SurveyResponse;
  let statusData: number;

  try {
    const res = await fetch(URLS.API + '/lastKey', { next: { revalidate: 300 } });
    data = await res.json();
    statusData = res.status;
  } catch (e) {
    data = {
      favorite_chapters: {
        dummy: 0,
      },
      least_favorite_chapters: {
        dummy: 0,
      },
      selectedComments: [],
    };
    statusData = -1;
  }

  return (
    <>
      <Header />
      <Main surveyData={data} responseStatus={statusData} />
      <TopWindow />
    </>
  );
}
