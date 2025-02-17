'use client';

import { generateDescendingScores, getTotalScore } from '@/lib/random';
import StatItem from './StatItem';
import { useEffect, useState } from 'react';
import SimpleStats from '../SimpleStats';
import { TabsTrigger, Tabs, TabsList, TabsContent } from '../ui/tabs';
import { ViewType } from '@/store/stats';

interface StatItemProps {
  title: string;
  avatar: string;
  score: number;
  team: string;
}

export default function StatsLiked() {
  const [stats, setStats] = useState<Array<StatItemProps>>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const data = [
    {
      title: 'Centuria',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsbMxdfrNn08RVhl5EsZToawXOmkgepfGiSLKd',
      score: 0,
      team: 'red',
    },
    {
      title: 'Chainsaw Man',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsyBpXloJWE2RrHWPuACU6tblTSchKogFveVfM',
      score: 0,
      team: 'red',
    },
    {
      title: 'DanDaDan',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsLyA81ep67085zusiThMpBHCWOSZdY94ntgGV',
      score: 0,
      team: 'red',
    },
    {
      title: 'Ruri Dragon',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBspqr94ePYPiZUKgdsI4JGNxR20Db3ze9FnTBM',
      score: 0,
      team: 'red',
    },
    {
      title: 'Sakamoto Days',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs65J0Mt7KRJC27kgGhzfDmI0AeL3HTEU1ul9B',
      score: 0,
      team: 'red',
    },
    {
      title: 'Undead Unluck',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsJmy0brKVSRBsbW93xziZXKCMNc1rp5DPFgu7',
      score: 0,
      team: 'red',
    },
    {
      title: 'Dragon Ball Super',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsvXleGFyLbhI7ovQkEdBqiwycHRXDAgmW3M4u',
      score: 0,
      team: 'red',
    },
    {
      title: 'One Punch Man',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsSTuz0VxL4573tDil6ghUGyZ0IjHwQc2bsdSv',
      score: 0,
      team: 'red',
    },
    {
      title: 'Re:Zero',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsNh52I2b9iFu0sXtSWf4lm5V3RAT8HPd1ChoI',
      score: 0,
      team: 'red',
    },
    {
      title: 'Shuumatsu',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsZPmINOnLWbCvTNiS6Z1kPtGQHjXe04pnfwIO',
      score: 0,
      team: 'red',
    },
    {
      title: 'Tenkaichi',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsnhxLHyBEwi4ZKzYNLpRc1xlWyOGXngAU87Ds',
      score: 0,
      team: 'red',
    },
    {
      title: 'Oshi no Ko',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsBOJOAiNV64s5bjuGWe37Ic8z19wEDvlqmRxH',
      score: 0,
      team: 'red',
    },
    {
      title: 'Boku no Hero',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBspLakvfPYPiZUKgdsI4JGNxR20Db3ze9FnTBM',
      score: 0,
      team: 'red',
    },
    {
      title: 'Jujutsu Kaisen',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsebcMC8lzWuJGf2kpoVdj4n85SAysHqMC0gD9',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Blue Lock',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsanAjyDdIe6DPKJbANLT1t79HRaZkMfWS3iF8',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Gachiakuta',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsJS8FZJKVSRBsbW93xziZXKCMNc1rp5DPFgu7',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Iruma',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBshU3wM0DR2Ivlsz6EaOq9PrLndbfyxtwu7V0D',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Kagurabachi',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsvnp9dZQyLbhI7ovQkEdBqiwycHRXDAgmW3M4',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Negai no Astro',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsvJwcAmyLbhI7ovQkEdBqiwycHRXDAgmW3M4u',
      score: 0,
      team: 'blue',
    },
    {
      title: 'One Piece',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsyRTXAdWE2RrHWPuACU6tblTSchKogFveVfMY',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Frieren',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBs48aode2l7qAXtPgkhWwEfFZSbap4V8GMRD6u',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Jojolands',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsBQO2sxNV64s5bjuGWe37Ic8z19wEDvlqmRxH',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Houseki no Kuni',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsYKxeLaEIXKlb15JIq0PgDaznFU24RjpfYoeA',
      score: 0,
      team: 'blue',
    },
    {
      title: 'Black Clover',
      avatar: 'https://p27kfbb298.ufs.sh/f/JxRqJXKVSRBsv0nHJOyLbhI7ovQkEdBqiwycHRXDAgmW3M4u',
      score: 0,
      team: 'blue',
    },
  ];

  useEffect(() => {
    let randomSortData = data.sort(() => Math.random() - 0.5);
    const scores = generateDescendingScores(randomSortData.length);

    randomSortData = randomSortData.map((item, index) => {
      return {
        ...item,
        score: scores[index],
      };
    });

    setStats(randomSortData);
    setTotalScore(getTotalScore(scores));
  }, []);

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
          <span>Nota 1: Los votos son aleatorios, asi que no se alarmen 😅</span>
          <span>
            Nota 2: Estoy mostrando todos los mangas, cuando sea una votacion real, solo se
            mostraran los publicados
          </span>
          <span>
            <a
              href="https://www.youtube.com/watch?v=ivNNRTnztbA"
              target="_blank"
              className="underline"
            >
              Nota 3: Mesugakis 😭💢 (link)
            </a>
          </span>
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
