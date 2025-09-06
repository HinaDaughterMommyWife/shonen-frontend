'use client';

import { getTotalScore } from '@/lib/random';
import { useMemo } from 'react';
import SimpleStats from '../SimpleStats';
import { TabsTrigger, Tabs, TabsList, TabsContent } from '../ui/tabs';
import { ViewType } from '@/store/stats';
import { useSurveyStore } from '@/store';
import { MANGAS } from '@/common/mangas';
import { StatItem } from '../StatItem';
import { reorderScores } from '@/lib/utils';
import WavyText from '../ui/wobble';
import Image from 'next/image';

interface StatItemProps {
  id: string;
  title: string;
  avatar: string;
  score: number;
  team: string;
}

export default function StatsLiked() {
  const { survey } = useSurveyStore();

  const stats = useMemo(() => {
    const data: Array<StatItemProps> = Object.keys(survey.favorite_chapters).map((key) => ({
      id: MANGAS[key].id,
      title: MANGAS[key].title,
      avatar: MANGAS[key].avatar,
      score: survey.favorite_chapters[key],
      team: MANGAS[key].team,
    }));

    return data.sort((a, b) => b.score - a.score);
  }, [survey]);

  const totalScore = useMemo(() => getTotalScore(stats.map((item) => item.score)), [stats]);

  const positionScore = reorderScores(survey.favorite_chapters);

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="w-full flex justify-center mb-[100px] py-[140px] px-5xlarge">
        <Image src="https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsa90Moe6dIe6DPKJbANLT1t79HRaZkMfWS3iF" alt="Like" width={600} height={500} className='hue-rotate-[200deg] saturate-200' />
      </div>
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-3xl">
            ¿Cuál ha sido el capitulo que más ha gustado de la semana?
          </h2>
          <p className="text-center font-bold text-xl text-gray-500">
            Total de votos: {totalScore}
          </p>
        </div>
        <div className="flex flex-col gap-large pt-2xlarge">
          {stats.map((item, index) => (
            <StatItem
              id={item.id}
              key={index + '-stats'}
              title={item.title}
              value={item.score}
              maxValue={stats[0].score}
              icon={item.avatar}
              index={index}
              team={item.team}
              position={positionScore[item.id]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
