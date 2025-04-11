'use client';

import Navigation from '@/components/Navigation';
import SectionVoted from '@/components/SectionVoted/SectionVoted';
import WatingData from '@/components/WatingData';
import { useSurveyStore } from '@/store';
import { HistoricalResponse, useHistoricalStore } from '@/store/historical';
import { CloudInterface, STATUS, SurveyResponse } from '@/store/survey';
import { useEffect } from 'react';

interface MainProps {
  surveyData: SurveyResponse;
  historicalData: HistoricalResponse;
  experimentalData: CloudInterface[];
  responseStatus: number;
}

export default function Main({ surveyData, historicalData, responseStatus, experimentalData }: MainProps) {
  const { putSurvey } = useSurveyStore();
  const { putHistorical, putExperimental } = useHistoricalStore();

  useEffect(() => {
    if (surveyData !== undefined && responseStatus === STATUS.GET_DATA) {
      putSurvey(surveyData);
      putHistorical(historicalData);
      putExperimental(experimentalData);
    }
  }, []);

  return (
    <>
      {responseStatus === STATUS.GET_DATA && (
        <>
          <Navigation />
          <SectionVoted />
        </>
      )}
      {responseStatus !== STATUS.GET_DATA && <WatingData />}
    </>
  );
}
