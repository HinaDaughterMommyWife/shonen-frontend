import { Section, useSectionStore } from '@/store';
import { useHistoricalStore } from '@/store/historical';
import { ChevronDown, ChevronUp, EqualApproximately } from 'lucide-react';
import ScoreComparison from './ScoreComparison';
import Image from 'next/image';
import { Avatar } from '../ui/custom/avatar';

export interface StatItemProp {
  id: string;
  title: string;
  value: number;
  icon: string;
  index: number;
  maxValue: number;
  team: string;
  position: number;
}

export default function StatItem({
  id,
  title,
  value,
  icon,
  index,
  maxValue,
  team,
  position,
}: StatItemProp) {
  const { section } = useSectionStore();
  const {
    historical: { favorite_chapters, least_favorite_chapters },
  } = useHistoricalStore();

  const currentArray = section === Section.LIKED ? favorite_chapters : least_favorite_chapters;

  const percentage = Math.min(100, (value / maxValue) * 100);
  const bgColor = team === 'red' ? 'bg-red-500/50' : 'bg-blue-500/50';

  const bgColorIcon = team === 'red' ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="flex w-full gap-small">
      <div
        className={`flex items-center justify-center sm:text-2xl text-sm px-3 font-semibold ${bgColor} rounded-l-2xl border sm:hidden`}
      >
        {position}
      </div>

      <div
        className={`relative flex items-center justify-center sm:rounded-l-2xl rounded-y-2xl border sm:p-4 px-2 overflow-hidden w-full`}
      >
        <div className={`absolute inset-0 ${bgColor}`} style={{ width: `${percentage}%` }}></div>
        <div className="relative flex items-center w-full">
          <div className="relative sm:block hidden">
            <Avatar src={icon} className="sm:w-28 sm:h-28 w-12 h-12" size={100} alt={title} />
            {index === 0 && (
              <span className="absolute -top-2 -right-0 h-6 w-6 sm:text-4xl text-2xl">
                {section === Section.LIKED ? <>👑</> : <>💩</>}
              </span>
            )}
            <div
              className={`absolute bottom-0 right-0 flex items-center justify-center ${bgColorIcon} rounded-full w-8 h-8 sm:text-xl text-xs font-bold text-white`}
            >
              {position}
            </div>
          </div>
          <div className="sm:ml-2xlarge ml-medium flex-grow overflow-hidden">
            <h3 className="sm:text-lg text-sm font-semibold text-white text-nowrap">{title}</h3>
          </div>
          <div className="sm:ml-2xlarge ml-medium sm:mr-large mr-small sm:text-2xl text-sm font-bold text-white">
            {value}
          </div>
        </div>
      </div>
      <ScoreComparison position={position} previousPosition={currentArray[id]} />
    </div>
  );
}
