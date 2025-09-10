import type { World } from '@state/world';
import type { EventBus } from '@core/event-bus';
import type { UIEvents } from '@ui/adapter';
import type { PlayState } from '@scenes/play.state';
import { addScore } from '@scenes/play.state';

export function createScoreOnKillSystem(bus: EventBus<UIEvents>, state: PlayState) {
  let prevEnemyIds = new Set<number>();
  const awardedIds = new Set<number>();

  return function scoreOnKillSystem(world: World) {
    const currEnemyIds = new Set(
      world.entities.filter(e => e.tag === 'enemy').map(e => e.id)
    );

    for (const id of prevEnemyIds) {
      if (!currEnemyIds.has(id) && !awardedIds.has(id)) {
        addScore(bus, state, 1);
        awardedIds.add(id);
      }
    }

    prevEnemyIds = currEnemyIds;
  };
}
