import type { World } from '@state/world';

export function movementSystem(world: World, dt: number) {
  for (const e of world.entities) {
    const t = e.transform;
    if (!t) continue;
    if (t.vx) t.x += t.vx * dt;
    if (t.vy) t.y += t.vy * dt;
  }
}
