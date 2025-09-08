import type { World } from '@state/world';

export function projectilesCleanupSystem(world: World, canvas: HTMLCanvasElement) {
  const maxX = canvas.width;
  const maxY = canvas.height;

  for (const e of [...world.entities]) {
    if (e.tag !== 'projectile' || !e.transform) continue;
    const { x, y } = e.transform;
    if (x < -32 || x > maxX + 32 || y < -32 || y > maxY + 32) {
      world.remove(e.id);
    }
  }
}
