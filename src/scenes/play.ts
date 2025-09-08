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
import { checkGameOver } from '@systems/gameOverSystem';
import { playerHitSystem } from '@systems/playerHit';
import { enemyAISystem } from '@systems/enemyAI';
import { createGameOverScene } from './gameOverScene'; 

import type { EventBus } from '@core/event-bus';
import type { UIEvents } from '@ui/adapter';

// Game extendido con bus tipado (opcional)
type GameWithBus = Game & { bus?: EventBus<UIEvents> };

export function createPlayScene(game: Game): Scene {
  const g = game as GameWithBus; // 👈 cast específico (sin any)
  const world = createWorld();

  world.add(makePlayer());

  const spawnSystem = createSpawnSystem();
  const shootingSystem = createShootingSystem();

  let score = 0;
  let lives = 3;

  let invulnTimer = 0;
  const invulnDuration = 1;

  let paused = false;
  let prevP = false;
  let gameOver = false;

  // Inicializar UI
  g.bus?.emit('ui:score:set', score);
  g.bus?.emit('ui:lives:set', lives);
  g.bus?.emit('ui:paused:set', paused);

  function togglePauseIfNeeded() {
    const p = game.input.pressed('p') || game.input.pressed('P');
    if (p && !prevP) {
      paused = !paused;
      g.bus?.emit('ui:paused:set', paused);
    }
    prevP = p;
  }

  function loseLife() {
    lives = Math.max(0, lives - 1);
    g.bus?.emit('ui:lives:set', lives);
    invulnTimer = invulnDuration;
    if (lives <= 0) {
      g.bus?.emit('ui:paused:set', true);
      game.scenes.change(createGameOverScene(game, score));
      gameOver = true;
    }
  }

  return {
    update(dt) {
      if (gameOver) return;

      togglePauseIfNeeded();
      if (paused) return;

      invulnTimer = Math.max(0, invulnTimer - dt);

      inputSystem(world, game);
      shootingSystem(world, game, dt);
      enemyAISystem(world);

      movementSystem(world, dt);
      projectilesCleanupSystem(world, game.ctx.canvas);
      spawnSystem(world, game, dt);
      boundsSystem(world, game.ctx.canvas);

      const before = world.entities.length;
      damageSystem(world);
      const after = world.entities.length;
      if (after < before) {
        score += before - after;
        g.bus?.emit('ui:score:set', score);
      }

      if (invulnTimer <= 0 && playerHitSystem(world)) {
        loseLife();
        if (gameOver) return;
      }
      if (invulnTimer <= 0 && checkGameOver(world, game.ctx.canvas)) {
        loseLife();
        if (gameOver) return;
      }
    },
    render(ctx) {
      renderingSystem(world, ctx);
    }
  };
}
