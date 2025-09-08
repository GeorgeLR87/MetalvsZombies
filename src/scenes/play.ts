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
import { hudSystem } from '@systems/hud';
import { checkGameOver } from '@systems/gameOverSystem';
import { playerHitSystem } from '@systems/playerHit';
import { createGameOverScene } from './gameOverScene'; 

export function createPlayScene(game: Game): Scene {
  const world = createWorld();

  world.add(makePlayer());

  const spawnSystem = createSpawnSystem();
  const shootingSystem = createShootingSystem();

  let score = 0;
  let lives = 3;

  return {
    update(dt) {
      inputSystem(world, game);
      shootingSystem(world, game, dt);
      movementSystem(world, dt);
      projectilesCleanupSystem(world, game.ctx.canvas);
      spawnSystem(world, game, dt);
      boundsSystem(world, game.ctx.canvas);

      // balas destruyen enemigos y suman score
      const before = world.entities.length;
      damageSystem(world);
      const after = world.entities.length;
      if (after < before) score += before - after;

      // player golpea enemigo → pierde vida
      if (playerHitSystem(world)) {
        lives -= 1;
        if (lives <= 0) {
          game.scenes.change(createGameOverScene(game, score));
          return; // salimos para no seguir procesando este frame
        }
        // opcional: empuja un poco al player o pinta flash
        // (de momento, sin knockback para mantenerlo simple)
      }

      // condición adicional de game over (enemigo cruza borde)
      if (checkGameOver(world, game.ctx.canvas)) {
        lives -= 1;
        if (lives <= 0) {
          game.scenes.change(createGameOverScene(game, score));
        }
      }
    },
    render(ctx) {
      renderingSystem(world, ctx);
      hudSystem(ctx, score, lives); // 👈 HUD sin 'game'
    }
  };
}
