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

 const updates = buildUpdatePipeline({ bus: g.bus, state });

  const renders = buildRenderPipeline(world, g.ctx);

  let prevP = false;

  return {
    update(dt) {
      if (state.gameOver) return;
      const p = g.input.pressed('p') || g.input.pressed('P');
      if (p && !prevP) togglePause(g.bus, state);
      prevP = p;
      if (state.paused) return;
      state.invulnTimer = Math.max(0, state.invulnTimer - dt);
      for (const step of updates) step({ dt, game: g, world });      
      if (state.invulnTimer <= 0 && playerHitSystem(world)) {
        loseLife(g.bus, state);
        if (state.gameOver) {
          g.bus.emit('ui:paused:set', true);
          game.scenes.change(createGameOverScene(game, state.score));
          return;
        }
      }
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
      for (const draw of renders) draw();
    }
  };
}
