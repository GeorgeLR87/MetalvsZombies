import type { World } from '@state/world';

export function boundsSystem(world: World, canvas: HTMLCanvasElement) {
  const maxX = canvas.width;
  const maxY = canvas.height;

  for (const e of world.entities) {
    if (!e.transform || !e.collider) continue;

    const { w, h } = e.collider;
    const minX = 0;
    const minY = 0;

    // clamp AABB completo dentro del canvas
    if (e.transform.x < minX) e.transform.x = minX;
    if (e.transform.y < minY) e.transform.y = minY;
    if (e.transform.x + w > maxX) e.transform.x = maxX - w;
    if (e.transform.y + h > maxY) e.transform.y = maxY - h;
  }
}
