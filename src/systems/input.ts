import type { World } from '@state/world';
import type { Game } from '@core/game';

export function inputSystem(world: World, game: Game) {
  // único player
  const player = world.entities.find(e => e.tag === 'player');
  if (!player?.kinematics) return;

  const { pressed } = game.input;
  const k = player.kinematics;

  const right = pressed('ArrowRight') || pressed('d') || pressed('D');
  const left  = pressed('ArrowLeft')  || pressed('a') || pressed('A');
  const down  = pressed('ArrowDown')  || pressed('s') || pressed('S');
  const up    = pressed('ArrowUp')    || pressed('w') || pressed('W');

  const dx = (right ? 1 : 0) - (left ? 1 : 0);
  const dy = (down  ? 1 : 0) - (up   ? 1 : 0);

  k.vx = dx * k.speed;
  k.vy = dy * k.speed;
}
