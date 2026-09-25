'use client';

import React from 'react';
import type { NomineeEntry } from '@/common/resultdata';

interface ResultsTableProps {
  nominees: [string, NomineeEntry][];
}


export default function ResultsTable({ nominees }: ResultsTableProps) {
  const sorted = [...nominees].sort((a, b) => b[1].votes - a[1].votes);

  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`w-full max-w-[600px] mx-auto mt-8 transition-opacity duration-700 ease-out ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <h3
        className="text-2xl md:text-3xl font-bold text-center mb-6"
        style={{
          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Resultados
      </h3>
      <div className="flex flex-col gap-3">
        {sorted.map(([name, data], index) => {
          const maxVotes = sorted[0][1].votes;
          const percentage = (data.votes / maxVotes) * 100;
          const isFirst = index === 0;

          return (
            <div
              key={name}
              className="flex items-center gap-4 rounded-xl px-4 py-3 bg-white/5 border border-white/10"
            >
              <span
                className={`text-lg font-bold w-8 text-center ${isFirst ? 'text-yellow-400' : 'text-white/60'}`}
              >
                {index + 1}
              </span>
              {data.img && (
                <img src={data.img} alt={name} className="w-10 h-10 rounded-full object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold truncate ${isFirst ? 'text-yellow-400' : 'text-white'}`}>
                    {name}
                  </span>
                  <span className="text-white/70 text-sm ml-2 shrink-0">{data.votes} votos</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${percentage}%`,
                      background: isFirst
                        ? 'linear-gradient(90deg, #FFD700, #FFA500)'
                        : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
