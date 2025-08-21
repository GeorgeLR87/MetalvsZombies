import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import { createWorld } from '@state/world';
import { movementSystem } from '@systems/movement';
import { renderingSystem } from '@systems/rendering';

export function createPlayScene(_game: Game): Scene {
  const world = createWorld();

  // demo: jugador como rectángulo
  world.add({
    tag: 'player',
    transform: { x: 100, y: 300, vx: 40, vy: 0 },
    sprite: { w: 24, h: 24, color: '#ff0' }
  });

  return {
    update(dt) {
      movementSystem(world, dt);
    },
    render(ctx) {
      renderingSystem(world, ctx);
      ctx.fillStyle = '#0f0';
      ctx.font = '16px monospace';
      ctx.fillText('Play Scene (FP systems)', 20, 30);
    }
  };
}
