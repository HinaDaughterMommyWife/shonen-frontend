'use client';

import { generateDescendingScores, getTotalScore } from '@/lib/random';
import StatItem from './StatItem';
import { useEffect, useState } from 'react';
import SimpleStats from '../SimpleStats';
import { TabsTrigger, Tabs, TabsList, TabsContent } from '../ui/tabs';
import { ViewType } from '@/store/stats';
import { useSurveyStore } from '@/store';
import { MANGAS } from '@/common/mangas';

interface StatItemProps {
  title: string;
  avatar: string;
  score: number;
  team: string;
}

export default function StatsLiked() {
  const [stats, setStats] = useState<Array<StatItemProps>>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const { survey } = useSurveyStore();

  useEffect(() => {
    const data: Array<StatItemProps> = [];

    Object.keys(survey.favorite_chapters).forEach((key) => {
      data.push({
        title: MANGAS[key].title,
        avatar: MANGAS[key].avatar,
        score: survey.favorite_chapters[key],
        team: MANGAS[key].team,
      });
    });

    const sortData = data.sort((a, b) => b.score - a.score);

    setStats(sortData);
    setTotalScore(getTotalScore(data.map((item) => item.score)));
  }, [survey]);

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-3xl">
            ¿Cuál ha sido el capitulo que más ha gustado de la semana?
          </h2>
          <p className="text-center font-bold text-xl text-gray-500">
            Total de votos: {totalScore}
          </p>
        </div>
        <div className="flex flex-col gap-medium pt-4xlarge text-sm text-gray-500/75">
          <span>
            Nota 1: Esto es una prueba de concepto, la version final estara en 3 o 4 semanas (espero
            que menos xd)
          </span>
          <span>
            Nota 2: Se esta trabajando en una escaneo automatico de los mangas publicados que
            participan del shonen semanal (revision automatica si X manga ha publicado un capitulo)
          </span>
          <span>
            Nota 3: Se esta trabajando en la posibilidad de que la gente pueda poner
            <span className="font-bold text-purple-700"> emotes de Twitch</span> de los canales:
            [darkrai, perico, emotes nativos de twitch, etc] en los comentarios (incluyendo los
            animados) (si al sapoperro no le gusta la idea, se descarta xd) (se espera comentarios
            llenos de pepelu{' '}
            <img
              src={'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs5jE07XQRLHr4spidyZSq0co8UYMh2EOK9NkJ'}
              alt={'pepelu'}
              className="inline h-8 w-8 align-middle animate-spin"
              loading="lazy"
            />{' '}
            )
          </span>
          <span>
            <a
              href="https://www.youtube.com/watch?v=ivNNRTnztbA"
              target="_blank"
              className="underline"
            >
              Nota 4: Mesugakis 😭💢 (link)
            </a>
          </span>
          <span>- GuibelOrgulloPeruano</span>
        </div>
        <Tabs defaultValue={ViewType.BAR} className="w-full pt-2xlarge">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value={ViewType.BAR}>Barras</TabsTrigger>
            <TabsTrigger value={ViewType.SIMPLE}>Simple</TabsTrigger>
          </TabsList>
          <TabsContent value={ViewType.BAR}>
            <div className="flex flex-col gap-large pt-2xlarge">
              {stats.map((item, index) => (
                <StatItem
                  key={index + '-stats'}
                  title={item.title}
                  value={item.score}
                  maxValue={stats[0].score}
                  icon={item.avatar}
                  index={index}
                  team={item.team}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value={ViewType.SIMPLE}>
            <SimpleStats stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
