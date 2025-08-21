const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctxMaybe = canvas.getContext('2d');
if (!ctxMaybe) throw new Error('2D context not available');
const ctx: CanvasRenderingContext2D = ctxMaybe; // 👈 a partir de aquí no es null

let last = performance.now();

function frame(now: number) {
  const dt = (now - last) / 1000;
  last = now;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f0';
  ctx.font = '16px monospace';
  ctx.fillText(`Running... dt=${dt.toFixed(3)}s`, 16, 24);

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
