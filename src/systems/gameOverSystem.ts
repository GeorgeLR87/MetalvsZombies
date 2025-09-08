import type { World } from '@state/world';

export function checkGameOver(world: World, canvas: HTMLCanvasElement): boolean {
  for (const e of world.entities) {
    if (e.tag === 'enemy' && e.transform) {
      const t = e.transform;
      // si enemigo sale de cualquier borde
      if (t.x < 0 || t.x > canvas.width || t.y < 0 || t.y > canvas.height) {
        return true;
      }
    }
  }
  return false;
}
