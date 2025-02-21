'use client';

import Navigation from '@/components/Navigation';
import SectionVoted from '@/components/SectionVoted/SectionVoted';
import WatingData from '@/components/WatingData';
import { Section, useSectionStore, useSurveyStore } from '@/store';
import { STATUS, SurveyResponse } from '@/store/survey';
import { useEffect } from 'react';

interface MainProps {
  surveyData: SurveyResponse;
  responseStatus: number;
}

export default function Main({ surveyData, responseStatus }: MainProps) {
  const { putSurvey } = useSurveyStore();

  useEffect(() => {
    if (surveyData !== undefined && responseStatus === STATUS.GET_DATA) {
      putSurvey(surveyData);
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
