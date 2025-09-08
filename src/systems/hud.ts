export function hudSystem(ctx: CanvasRenderingContext2D, score: number, lives: number) {
  ctx.fillStyle = '#fff';
  ctx.font = '14px monospace';
  ctx.fillText(`Score: ${score}`, 16, 20);
  ctx.fillText(`Lives: ${lives}`, 16, 40);
}
