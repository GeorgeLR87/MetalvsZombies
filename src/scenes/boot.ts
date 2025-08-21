import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import { createPlayScene } from './play'; 

export function createBootScene(game: Game): Scene {
  return {
    async init() {
      // Ejemplo de precarga:
      // await game.assets.loadImage('player', '/img/player.png');
      // transición directa por ahora
      game.scenes.change(createPlayScene(game));
    },
    update() {},
    render(ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#fff';
      ctx.fillText('Booting...', 20, 30);
    }
  };
}
