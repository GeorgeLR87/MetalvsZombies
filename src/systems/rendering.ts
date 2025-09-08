import type { World } from '@state/world';

export function renderingSystem(world: World, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Fondo
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Entidades
  for (const e of world.entities) {
    const t = e.transform;
    const s = e.sprite;
    if (!t || !s) continue;

    ctx.fillStyle = s.color ?? '#0f0';
    ctx.fillRect(t.x, t.y, s.w, s.h);
  }
}
