import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface StatItemProp {
  title: string;
  value: number;
  icon: string;
  index: number;
  maxValue: number;
  team: string;
}

export default function StatItem({ title, value, icon, index, maxValue, team }: StatItemProp) {
  const percentage = Math.min(100, (value / maxValue) * 100);
  const bgColor = team === 'red' ? 'bg-red-500/50' : 'bg-blue-500/50';

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl border p-4 overflow-hidden `}
    >
      <div className={`absolute inset-0 ${bgColor}`} style={{ width: `${percentage}%` }}></div>
      <div className="relative flex items-center w-full">
        <div className="relative sm:block hidden">
          <Avatar className="sm:w-28 sm:h-28 w-12 h-12">
            <AvatarImage src={icon} className="object-cover" loading="lazy" />
            <AvatarFallback>SS</AvatarFallback>
          </Avatar>
          {index === 0 && (
            <span className="absolute -top-2 -right-0 h-6 w-6 sm:text-4xl text-2xl">👑</span>
          )}
        </div>
        <div className="sm:ml-2xlarge ml-medium flex-grow overflow-hidden">
          <h3 className="text-lg font-semibold text-white text-nowrap">{title}</h3>
        </div>
        <div className="sm:ml-2xlarge ml-medium sm:mr-large mr-small text-2xl font-bold text-white">
          {value}
        </div>
      </div>
    </div>
  );
}
