import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import { createWorld, makePlayer } from '@state/world';
import { inputSystem } from '@systems/input';
import { movementSystem } from '@systems/movement';
import { projectilesCleanupSystem } from '@systems/projectiles';
import { createSpawnSystem } from '@systems/spawn';
import { boundsSystem } from '@systems/bounds';
import { damageSystem } from '@systems/damage';
import { renderingSystem } from '@systems/rendering';
import { createShootingSystem } from '@systems/shooting';

export function createPlayScene(game: Game): Scene {
  const world = createWorld();

  // Entities iniciales
  world.add(makePlayer());

  // Systems con estado interno (spawn, shooting)
  const spawnSystem = createSpawnSystem();
  const shootingSystem = createShootingSystem();

  // (Opcional) marcador local
  let score = 0;

  return {
    update(dt) {
      inputSystem(world, game);                         // teclado → kinematics
      shootingSystem(world, game, dt);                 // genera balas (cooldown)
      movementSystem(world, dt);                       // aplica kinematics
      projectilesCleanupSystem(world, game.ctx.canvas);// limpia balas offscreen
      spawnSystem(world, game, dt);                    // spawnea enemigos
      boundsSystem(world, game.ctx.canvas);            // clamp entidades (no balas)
      const before = world.entities.length;
      damageSystem(world);                              // balas destruyen enemigos
      const after = world.entities.length;
      if (after < before) score += (before - after);    // demo: sumar por entidades removidas
    },
    render(ctx) {
      renderingSystem(world, ctx);
      // HUD mínimo
      ctx.fillStyle = '#fff';
      ctx.font = '14px monospace';
      ctx.fillText(`Score: ${score}`, 16, 20);
      ctx.fillText(`Block 5: shooting + spawn + damage`, 16, 38);
    }
  };
}
