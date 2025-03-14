'use client';

import Navigation from '@/components/Navigation';
import SectionVoted from '@/components/SectionVoted/SectionVoted';
import WatingData from '@/components/WatingData';
import { useSurveyStore } from '@/store';
import { HistoricalResponse, useHistoricalStore } from '@/store/historical';
import { STATUS, SurveyResponse } from '@/store/survey';
import { useEffect } from 'react';

interface MainProps {
  surveyData: SurveyResponse;
  historicalData: HistoricalResponse;
  responseStatus: number;
}

export default function Main({ surveyData, historicalData, responseStatus }: MainProps) {
  const { putSurvey } = useSurveyStore();
  const { putHistorical } = useHistoricalStore();

  useEffect(() => {
    if (surveyData !== undefined && responseStatus === STATUS.GET_DATA) {
      putSurvey(surveyData);
      putHistorical(historicalData);
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
