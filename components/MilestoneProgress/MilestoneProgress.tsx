
interface MilestoneProgressProps {
  current: number;
  goal: number;
  label?: string;
}

export default function MilestoneProgress({
  current,
  goal,
  label = '#Darkraimola1M — El viaje ha empezado.',
}: MilestoneProgressProps) {
  const percent = Math.min(100, Math.round((current / goal) * 100));

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
      : n >= 1_000
      ? `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`
      : String(n);

  return (
    <div className="w-full max-w-[600px] mx-auto px-2 mt-medium">
      <p className="text-sm font-semibold text-center mb-2 tracking-wide text-[#c0c0c0] [text-shadow:0_0_6px_rgba(192,192,192,0.4)] flex items-center justify-center gap-1">
        <img
          src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9f77774abc4f4978b1a4fae87a64d099/animated/light/3.0"
          alt="emote"
          className="inline-block h-6 w-auto"
        />
        {label}
        <img
          src="https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9f77774abc4f4978b1a4fae87a64d099/animated/light/3.0"
          alt="emote"
          className="inline-block h-6 w-auto scale-x-[-1]"
        />
      </p>

      <div className="relative w-full h-3 rounded-full overflow-hidden bar-track">
        <div
          className="h-full rounded-full bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs font-medium text-[#9ca3af]">{fmt(current)}</span>
        <span className="text-xs font-semibold text-[#e5e7eb] [text-shadow:0_0_4px_rgba(229,231,235,0.5)]">{percent}%</span>
        <span className="text-xs font-medium text-[#9ca3af]">{fmt(goal)}</span>
      </div>
    </div>
  );
}
