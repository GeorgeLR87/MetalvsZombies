import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import { createWorld, makePlayer, makeEnemy } from '@state/world';
import { inputSystem } from '@systems/input';
import { movementSystem } from '@systems/movement';
import { boundsSystem } from '@systems/bounds';
import { collisionSystem } from '@systems/collision';
import { renderingSystem } from '@systems/rendering';

export function createPlayScene(game: Game): Scene {
  const world = createWorld();

  // Player
  world.add(makePlayer());

  // Enemy de prueba para validar colisiones
  world.add(makeEnemy(300, 260));

  return {
    update(dt) {
      // 1) Input → actualiza kinematics del player
      inputSystem(world, game);
      // 2) Movement → aplica kinematics al transform
      movementSystem(world, dt);
      // 3) Bounds → mantiene entidades dentro del canvas
      boundsSystem(world, game.ctx.canvas);
      // 4) Collisions → detecta AABB (marca color de debug)
      collisionSystem(world);
    },
    render(ctx) {
      // 5) Render → dibuja entidades
      renderingSystem(world, ctx);
      ctx.fillStyle = '#0f0';
      ctx.font = '14px monospace';
      ctx.fillText('Block 4: bounds + collision (enemy dummy)', 16, 20);
    }
  };
}
