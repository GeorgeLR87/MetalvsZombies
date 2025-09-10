// src/scenes/play.ts
import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import type { EventBus } from '@core/event-bus';
import type { UIEvents } from '@ui/adapter';

import { createWorld, makePlayer } from '@state/world';
import { buildUpdatePipeline, buildRenderPipeline } from '@systems/index';
import { createPlayState, syncUI, togglePause, loseLife } from './play.state';
import { playerHitSystem } from '@systems/playerHit';
import { checkGameOver } from '@systems/gameOverSystem';
import { createGameOverScene } from './gameOverScene';

type GameWithBus = Game & { bus: EventBus<UIEvents> };

export function createPlayScene(game: Game): Scene {
  const g = game as GameWithBus;
  const world = createWorld();
  world.add(makePlayer());

  const state = createPlayState();
  syncUI(g.bus, state);

  // Update pipeline con contexto (ya recibe { bus, state } vía opts)
  const updates = buildUpdatePipeline({ bus: g.bus, state });

  // Render pipeline con contexto (sin args; el ctx real se pasa al ejecutar)
  const renders = buildRenderPipeline();

  let prevP = false;

  return {
    update(dt) {
      if (state.gameOver) return;

      // Pausa (toggle con P)
      const p = g.input.pressed('p') || g.input.pressed('P');
      if (p && !prevP) togglePause(g.bus, state);
      prevP = p;
      if (state.paused) return;

      // Timers (i-frames)
      state.invulnTimer = Math.max(0, state.invulnTimer - dt);

      // Update pipeline
      for (const step of updates) step({ dt, game: g, world });

      // Player hits → pierde vida
      if (state.invulnTimer <= 0 && playerHitSystem(world)) {
        loseLife(g.bus, state);
        if (state.gameOver) {
          g.bus.emit('ui:paused:set', true);
          game.scenes.change(createGameOverScene(game, state.score));
          return;
        }
      }

      // Enemigo cruza borde izquierdo → también cuenta como daño
      if (state.invulnTimer <= 0 && checkGameOver(world, g.ctx.canvas)) {
        loseLife(g.bus, state);
        if (state.gameOver) {
          g.bus.emit('ui:paused:set', true);
          game.scenes.change(createGameOverScene(game, state.score));
          return;
        }
      }
    },
    render() {
      // Render pipeline con contexto
      for (const draw of renders) draw({ game: g, world, ctx: g.ctx });
    }
  };
}
