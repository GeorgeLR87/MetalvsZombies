import type { World } from '@state/world';

export function renderingSystem(world: World, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (const e of world.entities) {
    const t = e.transform;
    const s = e.sprite;
    if (!t || !s) continue;

    if (s.imageKey) {
      // si luego usas assets.getImage(s.imageKey) pásalos por injection
      // por ahora demo: rectángulo
    }
    ctx.fillStyle = s.color ?? '#0f0';
    ctx.fillRect(t.x, t.y, s.w, s.h);
  }
}
