import type { World } from '@state/world';

export function selectPlayer(world: World) {
  return world.entities.find(e => e.tag === 'player' && e.transform && e.collider);
}

export function selectEnemies(world: World) {
  return world.entities.filter(e => e.tag === 'enemy' && e.transform && e.collider);
}
