import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import { createWorld, makePlayer } from '@state/world';
import { inputSystem } from '@systems/input';
import { movementSystem } from '@systems/movement';
import { renderingSystem } from '@systems/rendering';

export function createPlayScene(game: Game): Scene {
  const world = createWorld();
  world.add(makePlayer());

  return {
    update(dt) {
      inputSystem(world, game);
      movementSystem(world, dt);
      // (en el siguiente bloque: boundsSystem, collisionSystem, etc.)
    },
    render(ctx) {
      renderingSystem(world, ctx);
      ctx.fillStyle = '#0f0';
      ctx.font = '14px monospace';
      ctx.fillText('Play Scene – Player + InputSystem', 16, 20);
    }
  };
}
