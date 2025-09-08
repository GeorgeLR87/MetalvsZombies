import type { World } from '@state/world';
import { aabbOverlap } from '@utils/aabb';

export function playerHitSystem(world: World): boolean {
  const player = world.entities.find(e => e.tag === 'player' && e.transform && e.collider);
  if (!player) return false;

  const enemies = world.entities.filter(e => e.tag === 'enemy' && e.transform && e.collider);

  for (const en of enemies) {
    const pt = player.transform!, pc = player.collider!;
    const et = en.transform!, ec = en.collider!;
    if (aabbOverlap(pt.x, pt.y, pc.w, pc.h, et.x, et.y, ec.w, ec.h)) {
      return true; // hubo choque player-enemy
    }
  }
  return false;
}
