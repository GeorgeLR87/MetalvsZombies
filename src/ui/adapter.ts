import type { createEventBus } from '@core/event-bus';
import { useUIStore } from './store';

type UIEvents = {
  'ui:score:set': number;
  'ui:lives:set': number;
  'ui:paused:set': boolean;
};

export function wireUI(bus: ReturnType<typeof createEventBus<UIEvents>>) {
  bus.on('ui:score:set', (n) => useUIStore.getState().setScore(n));
  bus.on('ui:lives:set', (n) => useUIStore.getState().setLives(n));
  bus.on('ui:paused:set', (v) => useUIStore.getState().setPaused(v));
}

export type { UIEvents };
