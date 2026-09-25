'use client';

import { EMOTES_TUTORIAL_IMAGE_URL, EmoteData, setEmotesData } from '@/common/emotes';
import Navigation from '@/components/Navigation';
import SectionVoted from '@/components/SectionVoted/SectionVoted';
import WatingData from '@/components/WatingData';
import { useSurveyStore } from '@/store';
import { HistoricalResponse, useHistoricalStore } from '@/store/historical';
import { CloudInterface, STATUS, SurveyResponse } from '@/store/survey';
import { useEffect, useState } from 'react';
import { URLS } from '../common';
import { unpack } from 'msgpackr';
import Snowfall from 'react-snowfall';

interface MainProps {
  surveyData: SurveyResponse;
  historicalData: HistoricalResponse;
  experimentalData: CloudInterface[];
  responseStatus: number;
  emotesData: Record<string, EmoteData>;
  pastebinMarkdown?: string;
}

export default function Main({
  surveyData,
  historicalData,
  responseStatus,
  experimentalData,
  emotesData,
  pastebinMarkdown = '',
}: MainProps) {
  const { putSurvey } = useSurveyStore();
  const { putHistorical, putExperimental } = useHistoricalStore();

  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const overlayTimeout = setTimeout(() => {
      setShowOverlay(false);
    }, 4000);

    return () => clearTimeout(overlayTimeout);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      try {
        const resSurvey = await fetch(URLS.API + '/survey/lastKey');
        const dataSurvey = await resSurvey.json();
        const statusData = resSurvey.status;

        const resHistorical = await fetch(URLS.API + '/survey/historicalPositions');
        const dataHistorical = await resHistorical.json();

        const resExperimental = await fetch(URLS.API + '/experiment/cloud-1');
        const dataExperimental = await resExperimental.json();

        const resEmotedDataBuffer = await fetch(EMOTES_TUTORIAL_IMAGE_URL);

        const emoteArrayBuffer = await resEmotedDataBuffer.arrayBuffer();

        const emoteDataParsed = unpack(new Uint8Array(emoteArrayBuffer)) as Record<
          string,
          EmoteData
        >;

        setEmotesData(emoteDataParsed);

        if (statusData === STATUS.GET_DATA) {
          putSurvey(dataSurvey);
          putHistorical(dataHistorical);
          putExperimental(dataExperimental);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    fetchAll();
  }, []);

  return (
    <>
      {showOverlay && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black z-[9999] overlay-fade-out pointer-events-none"
        ></div>
      )}
      <Navigation />
      <SectionVoted pastebinMarkdown={pastebinMarkdown} />
    </>
  );
}
