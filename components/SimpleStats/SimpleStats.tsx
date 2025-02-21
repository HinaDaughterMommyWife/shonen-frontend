'use client';

interface StatItemProps {
  title: string;
  score: number;
  team: string;
}

interface SimpleStatsProps {
  stats: StatItemProps[];
}

export default function SimpleStats({ stats }: SimpleStatsProps) {
  const teamRed = stats.filter((stat) => stat.team === 'red').sort((a, b) => b.score - a.score);
  const teamBlue = stats.filter((stat) => stat.team === 'blue').sort((a, b) => b.score - a.score);

  return (
    <div className="flex justify-center pt-2xlarge flex-col items-center">
      <div className="text-center w-full max-w-lg mb-4">
        <div className="grid grid-cols-2 text-lg font-bold">
          <div className="text-blue-500">
            Equipo Azul - {teamBlue.reduce((acc, curr) => acc + curr.score, 0)}
          </div>
          <div className="text-red-500">
            Equipo Rojo - {teamRed.reduce((acc, curr) => acc + curr.score, 0)}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_2px_1fr] gap-4 border-t border-gray-300 w-full max-w-lg text-center">
        <div className="flex flex-col items-end pr-2xlarge pt-large gap-medium">
          {teamBlue.map((player, index) => (
            <div
              key={player.title}
              className={`text-blue-500 ${index === 0 ? 'font-bold text-xl' : ''}`}
            >
              {player.title} - {player.score}
            </div>
          ))}
        </div>
        <div className="w-px bg-gray-300"></div>
        <div className="flex flex-col items-start text-nowrap pl-2xlarge pt-large gap-medium">
          {teamRed.map((player, index) => (
            <div
              key={player.title}
              className={`text-red-500 text-nowrap ${index === 0 ? 'font-bold text-xl' : ''}`}
            >
              {player.title} - {player.score}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
