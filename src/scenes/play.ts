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
import { checkGameOver } from '@systems/gameOverSystem'; // <-- usa el nombre real
import { playerHitSystem } from '@systems/playerHit';
import { enemyAISystem } from '@systems/enemyAI';
import { createGameOverScene } from './gameOverScene';

type WithBus = Game & { bus?: { emit: (t: any, p: any) => void } };

export function createPlayScene(game: Game): Scene {
  const world = createWorld();

  world.add(makePlayer());

  const spawnSystem = createSpawnSystem();
  const shootingSystem = createShootingSystem();

  let score = 0;
  let lives = 3;

  // Invulnerabilidad
  let invulnTimer = 0;
  const invulnDuration = 1;

  // Pausa
  let paused = false;
  let prevP = false;

  // Flag para no procesar más frames tras game over
  let gameOver = false;

  // Inicializa UI
  (game as WithBus).bus?.emit('ui:score:set', score);
  (game as WithBus).bus?.emit('ui:lives:set', lives);
  (game as WithBus).bus?.emit('ui:paused:set', paused);

  function togglePauseIfNeeded() {
    const p = game.input.pressed('p') || game.input.pressed('P');
    if (p && !prevP) {
      paused = !paused;
      (game as WithBus).bus?.emit('ui:paused:set', paused);
    }
    prevP = p;
  }

  function loseLife() {
    // Clampea vidas, emite y decide game over
    lives = Math.max(0, lives - 1);
    (game as WithBus).bus?.emit('ui:lives:set', lives);
    invulnTimer = invulnDuration;
    if (lives <= 0) {
      // Opcional: también podrías emitir paused=true aquí
      (game as WithBus).bus?.emit('ui:paused:set', true);
      game.scenes.change(createGameOverScene(game, score));
      gameOver = true;
    }
  }

  return {
    update(dt) {
      if (gameOver) return; // no más lógica tras game over

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

      // Balas vs enemigo → score
      const before = world.entities.length;
      damageSystem(world);
      const after = world.entities.length;
      if (after < before) {
        score += (before - after);
        (game as WithBus).bus?.emit('ui:score:set', score);
      }

      // Player vs enemy → pierde 1 vida (respetando i-frames)
      if (invulnTimer <= 0 && playerHitSystem(world)) {
        loseLife();
        if (gameOver) return; // corta el frame si llegó a 0
      }

      // Reglas adicionales: enemigo “escapa” del canvas → cuenta como daño
      if (invulnTimer <= 0 && checkGameOver(world, game.ctx.canvas)) {
        loseLife();
        if (gameOver) return;
      }
    },
    render(ctx) {
      // Solo canvas del juego; HUD está en React
      renderingSystem(world, ctx);
    }
  };
}
