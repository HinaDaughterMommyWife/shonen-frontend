export const electionVsBarStyles = {
  root: 'w-full max-w-[720px] mx-auto mt-medium px-2',

  candidatesRow: 'flex items-stretch justify-between gap-2 sm:gap-4 mb-3',

  candidate: 'flex-1 flex flex-col items-center text-center min-w-0',
  candidateLogo: 'size-12 sm:size-14 object-contain mb-1.5 drop-shadow-md',
  candidateName: 'text-xs sm:text-sm font-bold uppercase tracking-wide text-gray-200 leading-tight',
  candidateParty: 'text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider leading-tight mt-0.5',

  vsBadge:
    'flex-shrink-0 self-center flex items-center justify-center size-9 sm:size-10 rounded-full bg-gray-800 border border-gray-600 text-xs sm:text-sm font-black text-gray-300 shadow-inner',

  barTrack: 'relative w-full h-5 sm:h-6 rounded-full overflow-hidden flex election-vs-bar-track',
  barLeft: 'h-full election-vs-bar-left transition-all duration-700',
  barRight: 'h-full flex-1 election-vs-bar-right',

  statsRow: 'flex justify-between mt-2 gap-2',
  statBlock: 'flex flex-col min-w-0',
  statBlockRight: 'flex flex-col items-end min-w-0',
  statPercent: 'text-sm sm:text-base font-bold tabular-nums',
  statPercentLeft: 'text-[#a78bfa]',
  statPercentRight: 'text-[#fb923c]',
  statVotes: 'text-[10px] sm:text-xs text-gray-500 tabular-nums',
} as const;
