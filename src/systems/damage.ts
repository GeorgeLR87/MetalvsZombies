import type { World } from '@state/world';
import { aabbOverlap } from '@utils/aabb'; 

export function damageSystem(world: World) {
  const bullets = world.entities.filter(e => e.tag === 'projectile' && e.transform && e.collider);
  const enemies = world.entities.filter(e => e.tag === 'enemy' && e.transform && e.collider);

  for (const b of bullets) {
    for (const en of enemies) {
      const bt = b.transform!, bc = b.collider!;
      const et = en.transform!, ec = en.collider!;
      if (aabbOverlap(bt.x, bt.y, bc.w, bc.h, et.x, et.y, ec.w, ec.h)) {
        // remove both
        world.remove(b.id);
        world.remove(en.id);
        break; // bullet is gone; next bullet
      }
    }
  }
}
