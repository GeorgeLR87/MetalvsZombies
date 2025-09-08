import type { World } from '@state/world';

export function movementSystem(world: World, dt: number) {
  for (const e of world.entities) {
    if (!e.transform) continue;
    if (!e.kinematics) continue;
    e.transform.x += e.kinematics.vx * dt;
    e.transform.y += e.kinematics.vy * dt;
  }
}
