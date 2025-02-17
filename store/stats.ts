import { create } from 'zustand'

export enum ViewType {
    BAR = 'bar',
    SIMPLE = 'simple',
}

export interface StatsState {
    viewType: ViewType
    setViewType: (viewType: ViewType) => void
}

export const useStatsStore = create<StatsState>((set) => ({
    viewType: ViewType.BAR,
    setViewType: (viewType) => set(() => ({ viewType }))
}))