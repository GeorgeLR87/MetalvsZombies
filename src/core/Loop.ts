export type UpdateFn = (dt: number) => void;
export type RenderFn = (ctx: CanvasRenderingContext2D) => void;

export function createFixedLoop(update: UpdateFn, render: RenderFn, ctx: CanvasRenderingContext2D) {
  const step = 1 / 60; // 60Hz fijo
  let acc = 0;
  let last = performance.now();
  let rafId = 0;

  function frame(now: number) {
    acc += (now - last) / 1000;
    last = now;

    // varias updates si hace falta (capped para evitar spiral of death)
    let iter = 0;
    while (acc >= step && iter < 5) {
      update(step);
      acc -= step;
      iter++;
    }

    render(ctx);
    rafId = requestAnimationFrame(frame);
  }

  return {
    start() { last = performance.now(); rafId = requestAnimationFrame(frame); },
    stop()  { cancelAnimationFrame(rafId); }
  };
}
