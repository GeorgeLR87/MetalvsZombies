import type { World } from '@state/world';
import type { Game } from '@core/game';
import { makeEnemy } from '@state/world';

export function createSpawnSystem() {
  let t = 0;
  const interval = 1.5; // seconds

  return function spawnSystem(world: World, game: Game, dt: number) {
    t += dt;
    if (t < interval) return;
    t = 0;

    const { width, height } = game.ctx.canvas;
    // spawn cerca del borde derecho, altura aleatoria
    const x = Math.max(200, width - 80);
    const y = Math.floor(60 + Math.random() * (height - 120));

    world.add(makeEnemy(x, y));
  };
}
