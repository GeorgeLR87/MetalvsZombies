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
import { enemyAISystem } from '@systems/enemyAI';
import { createGameOverScene } from './gameOverScene'; 

export function createPlayScene(game: Game): Scene {
  const world = createWorld();

  world.add(makePlayer());

  const spawnSystem = createSpawnSystem();
  const shootingSystem = createShootingSystem();

  let score = 0;
  let lives = 3;

  // ⏳ Invulnerabilidad
  let invulnTimer = 0;       // segundos restantes
  const invulnDuration = 1;  // 1s de i-frames

  // ⏸️ Pausa (toggle con P)
  let paused = false;
  let prevP = false;

  // Acumulador para el “flash” visual
  let tAccum = 0;

  function togglePauseIfNeeded() {
    const p = game.input.pressed('p') || game.input.pressed('P');
    if (p && !prevP) paused = !paused;
    prevP = p;
  }

  function setPlayerTint(invulnerable: boolean) {
    const player = world.entities.find(e => e.tag === 'player' && e.sprite);
    if (!player || !player.sprite) return;
    if (!invulnerable) {
      player.sprite.color = '#ff0'; // color normal
      return;
    }
    // parpadeo: alterna color con la “frecuencia” 10 Hz aprox
    const blink = (Math.floor(tAccum * 10) % 2) === 0;
    player.sprite.color = blink ? '#fff' : '#ff0';
  }

  return {
    update(dt) {
      // Toggle pausa
      togglePauseIfNeeded();
      if (paused) {
        // aún así permitimos salir de pausa con P en frames siguientes
        return;
      }

      tAccum += dt;
      if (invulnTimer > 0) invulnTimer -= dt;

      inputSystem(world, game);
      shootingSystem(world, game, dt);

      // 👇 IA enemigo calcula kinematics hacia el player
      enemyAISystem(world);

      movementSystem(world, dt);
      projectilesCleanupSystem(world, game.ctx.canvas);
      spawnSystem(world, game, dt);
      boundsSystem(world, game.ctx.canvas);

      // Balas vs enemigo → score
      const before = world.entities.length;
      damageSystem(world);
      const after = world.entities.length;
      if (after < before) score += before - after;

      // Player vs enemy → pierde vida (si no está invulnerable)
      if (invulnTimer <= 0 && playerHitSystem(world)) {
        lives -= 1;
        invulnTimer = invulnDuration;
        if (lives <= 0) {
          game.scenes.change(createGameOverScene(game, score));
          return;
        }
      }

      // Regla adicional (si un enemigo sale del canvas, cuenta como daño)
      if (invulnTimer <= 0 && checkGameOver(world, game.ctx.canvas)) {
        lives -= 1;
        invulnTimer = invulnDuration;
        if (lives <= 0) {
          game.scenes.change(createGameOverScene(game, score));
        }
      }
    },
    render(ctx) {
      // Tint del player según invulnerabilidad (parpadeo)
      setPlayerTint(invulnTimer > 0);

      renderingSystem(world, ctx);
      hudSystem(ctx, score, lives);

      if (paused) {
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '22px monospace';
        ctx.fillText('PAUSED (press P)', ctx.canvas.width / 2 - 120, ctx.canvas.height / 2);
      }
    }
  };
}
