import type { World } from '@state/world';

export function boundsSystem(world: World, canvas: HTMLCanvasElement) {
  const maxX = canvas.width;
  const maxY = canvas.height;

  for (const e of world.entities) {
    if (e.tag === 'projectile') continue; 
    if (!e.transform || !e.collider) continue;

    const { w, h } = e.collider;
    if (e.transform.x < 0) e.transform.x = 0;
    if (e.transform.y < 0) e.transform.y = 0;
    if (e.transform.x + w > maxX) e.transform.x = maxX - w;
    if (e.transform.y + h > maxY) e.transform.y = maxY - h;
  }
}
