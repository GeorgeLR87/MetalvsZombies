import { create } from 'zustand';

type UIState = {
  score: number;
  lives: number;
  paused: boolean;
  setScore: (n: number) => void;
  setLives: (n: number) => void;
  setPaused: (v: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  score: 0,
  lives: 3,
  paused: false,
  setScore: (n) => set({ score: n }),
  setLives: (n) => set({ lives: n }),
  setPaused: (v) => set({ paused: v }),
}));
