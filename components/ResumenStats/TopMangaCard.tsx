'use client';

import { MANGAS } from '@/common/mangas';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TopMangaCardProps {
  mangaId: string;
  rank: number;
  favPoints?: number;
  leastPoints?: number;
  netPoints?: number;
  favTimesAt1?: number;
  leastTimesAt1?: number;
  bestRank?: number;
  worstRank?: number;
  avgRank?: number;
  upperName?: boolean;
  highlight?: 'favorite' | 'least' | 'net' | null;
}

export default function TopMangaCard({
  mangaId,
  rank,
  favPoints,
  leastPoints,
  netPoints,
  favTimesAt1,
  leastTimesAt1,
  bestRank,
  worstRank,
  avgRank,
  upperName = false,
  highlight = null,
}: TopMangaCardProps) {
  const manga = MANGAS[mangaId];

  if (!manga) return null;

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-orange-400 to-orange-600';
      default:
        return 'bg-white/30'
    }
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="group relative bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-700 hover:border-purple-500">
      {/* Rank Badge - Larger for vertical layout */}
      <div
        className={`absolute top-6 left-6 z-10 bg-gradient-to-br ${getMedalColor(rank)} text-white font-black text-3xl w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}
      >
        {rank <= 3 ? getMedalEmoji(rank) : rank}
      </div>

      {/* Team Color Strip - Vertical on left */}
      <div
        className={`absolute top-0 left-0 w-2 h-full ${manga.team === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}
      ></div>

      <div className={cn('p-8 pl-24')}>
        {/* Title Section - Upper Layout */}

        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden ring-4 ring-purple-500/30 group-hover:ring-purple-400 transition-all shadow-xl">
              <Image
                title={manga.title}
                src={manga.avatar}
                alt={manga.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Title Section - Side Layout */}
          {!upperName && (
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <h3 className="text-2xl font-black text-white">{manga.title}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${manga.team === 'red' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}
                >
                  Equipo {manga.team === 'red' ? 'Rojo' : 'Azul'}
                </span>
              </div>
            </div>
          )}

          {/* Stats Section - Flex wrap para distribución automática */}
          <div className="flex-shrink-0 w-full md:w-auto">
            {upperName && (
              <div className="mb-6 text-center md:text-left">
                <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                  <h3 className="text-2xl font-black text-white">{manga.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${manga.team === 'red' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}
                  >
                    Equipo {manga.team === 'red' ? 'Rojo' : 'Azul'}
                  </span>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              {netPoints !== undefined && (
                <div
                  className={cn(
                    'bg-gray-900/70 rounded-xl p-3 text-center min-w-[110px] flex-1 md:flex-initial',
                    highlight === 'net'
                      ? 'border-yellow-400 ring-4 ring-yellow-400/20'
                      : 'border border-gray-700',
                  )}
                >
                  <div
                    className={`text-lg font-black ${netPoints >= 0 ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {netPoints >= 0 ? '+' : ''}
                    {netPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Net Score</div>
                </div>
              )}

              {favPoints !== undefined && (
                <div
                  className={cn(
                    'bg-gray-900/70 rounded-xl p-3 text-center min-w-[110px] flex-1 md:flex-initial',
                  )}
                >
                  <div className="text-lg font-black text-purple-400">
                    {favPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Pts Fav</div>
                </div>
              )}

              {leastPoints !== undefined && (
                <div
                  className="bg-gray-900/70 rounded-xl p-3 text-center min-w-[110px] flex-1 md:flex-initial"
                >
                  <div className="text-lg font-black text-orange-400">
                    {leastPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Pts Menos</div>
                </div>
              )}

              {favTimesAt1 !== undefined && favTimesAt1 > 0 ? (
                <div
                  className={cn(
                    'bg-gray-900/70 rounded-xl p-3 text-center border border-gray-700 min-w-[110px] flex-1 md:flex-initial',
                    highlight === 'favorite'
                      ? 'border-yellow-400 ring-4 ring-yellow-400/20'
                      : 'border border-gray-700',
                  )}
                >
                  {' '}
                  <div className="text-lg font-black text-yellow-400">{favTimesAt1}</div>
                  <div className="text-xs text-gray-400 mt-1">🥇 #1 Fav</div>
                </div>
              ) : (
                <div className="bg-gray-900/70 rounded-xl p-3 text-center border border-gray-700 min-w-[110px] flex-1 md:flex-initial">
                  <div className="text-lg font-black text-gray-500">0</div>
                  <div className="text-xs text-gray-400 mt-1">🥇 #1 Fav</div>
                </div>
              )}

              {leastTimesAt1 !== undefined && leastTimesAt1 > 0 ? (
                <div className={cn(
                  'bg-gray-900/70 rounded-xl p-3 text-center border border-gray-700 min-w-[110px] flex-1 md:flex-initial',
                  highlight === 'least'
                    ? 'border-red-400 ring-4 ring-red-400/20'
                    : 'border border-gray-700',
                )}>
                  <div className="text-lg font-black text-red-400">{leastTimesAt1}</div>
                  <div className="text-xs text-gray-400 mt-1">💔 #1 Menos</div>
                </div>
              ) : (
                <div className="bg-gray-900/70 rounded-xl p-3 text-center border border-gray-700 min-w-[110px] flex-1 md:flex-initial">
                  <div className="text-lg font-black text-gray-500">0</div>
                  <div className="text-xs text-gray-400 mt-1">💔 #1 Menos</div>
                </div>
              )}

              {(bestRank !== undefined || worstRank !== undefined) && (
                <div className="bg-gray-900/70 rounded-xl p-3 text-center border border-gray-700 min-w-[110px] flex-1 md:flex-initial">
                  <div className="text-xs text-gray-400">
                    {bestRank && <div className="text-blue-400 font-bold">↑#{bestRank}</div>}
                    {worstRank && <div className="text-red-400 font-bold">↓#{worstRank}</div>}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Rango</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
