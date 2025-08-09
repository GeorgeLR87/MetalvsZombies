// src/main.ts
const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
canvas.width = 640;
canvas.height = 360;

let last = 0;
let t = 0;         // tiempo acumulado
let x = 16;        // posición de prueba

function loop(now: number) {
  const dt = (now - last) / 1000;       // dt real
  last = now;
  t += dt;

  // fondo
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // texto
  const fps = (1 / Math.max(dt, 1e-6)).toFixed(0);
  ctx.fillStyle = "#eee";
  ctx.font = "16px monospace";
  ctx.fillText(`t: ${t.toFixed(2)}s | dt: ${dt.toFixed(3)}s | ~${fps} FPS`, 16, 24);

  // movimiento visible (va y viene)
  x += 120 * dt; // px/s
  if (x > canvas.width - 32 || x < 16) {
    x = Math.max(16, Math.min(x, canvas.width - 32));
    // invierte dirección
    (globalThis as any)._dir = ((globalThis as any)._dir ?? 1) * -1;
  }
  const dir = (globalThis as any)._dir ?? 1;
  x += 120 * dt * dir;

  // dibuja un rectángulo que se mueve
  ctx.fillStyle = "#4ade80";
  ctx.fillRect(x, canvas.height / 2 - 16, 32, 32);

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
