import { createFixedLoop } from './Loop'; 
import { createSceneManager } from './scene';
import { createAssets } from './assets';
import { createInput } from './input';

export type Game = ReturnType<typeof createGame>;

export function createGame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context not available');

  const scenes = createSceneManager();
  const assets = createAssets();
  const input = createInput();

  const loop = createFixedLoop(
    (dt) => scenes.update(dt),
    (ctx2) => scenes.render(ctx2),
    ctx
  );

  return {
    ctx,
    start: () => loop.start(),
    stop: () => loop.stop(),
    scenes,
    assets,
    input,
    dispose: () => input.destroy()
  };
}
