import type { Game } from '@core/game';
import type { World } from '@state/world';

import { inputSystem } from './input';
import { enemyAISystem } from './enemyAI';
import { movementSystem } from './movement';
import { projectilesCleanupSystem } from './projectiles';
import { boundsSystem } from './bounds';
import { damageSystem } from './damage';
import { renderingSystem } from './rendering';
import { createShootingSystem } from './shooting';
import { createSpawnSystem } from './spawn';
import { createScoreOnKillSystem } from './score';

import type { EventBus } from '@core/event-bus';
import type { UIEvents } from '@ui/adapter';
import type { PlayState } from '@scenes/play.state';

export type UpdateCtx = { dt: number; game: Game; world: World };
export type UpdateStep = (ctx: UpdateCtx) => void;

export function buildUpdatePipeline(
  opts?: { bus?: EventBus<UIEvents>; state?: PlayState }
): UpdateStep[] {
  const shootingSystem = createShootingSystem();
  const spawnSystem = createSpawnSystem();
  const scoreSystem =
    opts?.bus && opts?.state ? createScoreOnKillSystem(opts.bus, opts.state) : null;

  const steps: UpdateStep[] = [
    ({ game, world }) => inputSystem(world, game),
    ({ dt, game, world }) => shootingSystem(world, game, dt),
    ({ world }) => enemyAISystem(world),
    ({ dt, world }) => movementSystem(world, dt),
    ({ game, world }) => projectilesCleanupSystem(world, game.ctx.canvas),
    ({ dt, game, world }) => spawnSystem(world, game, dt),
    ({ game, world }) => boundsSystem(world, game.ctx.canvas),
    ({ world }) => damageSystem(world),
    ({ world }) => { if (scoreSystem) scoreSystem(world); },
  ];

  return steps;
}

export function buildRenderPipeline(world: World, ctx: CanvasRenderingContext2D) {
  return [() => renderingSystem(world, ctx)];
}
