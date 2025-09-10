import type { EventBus } from '@core/event-bus';
import type { UIEvents } from '@ui/adapter';

export type PlayState = {
  score: number;
  lives: number;
  paused: boolean;
  invulnTimer: number;
  invulnDuration: number;
  gameOver: boolean;
};

export function createPlayState() : PlayState {
  return {
    score: 0,
    lives: 3,
    paused: false,
    invulnTimer: 0,
    invulnDuration: 1,
    gameOver: false,
  };
}

export function syncUI(bus: EventBus<UIEvents>, s: PlayState) {
  bus.emit('ui:score:set', s.score);
  bus.emit('ui:lives:set', s.lives);
  bus.emit('ui:paused:set', s.paused);
}

export function addScore(bus: EventBus<UIEvents>, s: PlayState, n: number) {
  s.score += n;
  bus.emit('ui:score:set', s.score);
}

export function togglePause(bus: EventBus<UIEvents>, s: PlayState) {
  s.paused = !s.paused;
  bus.emit('ui:paused:set', s.paused);
}

export function loseLife(bus: EventBus<UIEvents>, s: PlayState) {
  s.lives = Math.max(0, s.lives - 1);
  s.invulnTimer = s.invulnDuration;
  bus.emit('ui:lives:set', s.lives);
  if (s.lives <= 0) {
    s.gameOver = true;
    bus.emit('ui:paused:set', true);
  }
}
