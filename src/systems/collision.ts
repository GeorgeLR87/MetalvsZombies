import type { World } from '@state/world';

export type CollisionPair = { a: number; b: number }; // ids de entidades

function aabbOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function collisionSystem(world: World) {
  const ents = world.entities.filter(e => e.transform && e.collider);

  for (let i = 0; i < ents.length; i++) {
    for (let j = i + 1; j < ents.length; j++) {
      const A = ents[i];
      const B = ents[j];

      const at = A.transform!, ac = A.collider!;
      const bt = B.transform!, bc = B.collider!;

      if (aabbOverlap(at.x, at.y, ac.w, ac.h, bt.x, bt.y, bc.w, bc.h)) {
        if (A.sprite) A.sprite.color = '#f66';
        if (B.sprite) B.sprite.color = '#f66';
      }
    }
  }
}
