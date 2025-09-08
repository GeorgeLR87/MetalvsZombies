import type { Scene } from '@core/scene';
import type { Game } from '@core/game';
import { createPlayScene } from './play';

export function createGameOverScene(game: Game, finalScore: number): Scene {
  return {
    update() {
      // reinicia con Enter
      if (game.input.pressed('Enter')) {
        game.scenes.change(createPlayScene(game));
      }
    },
    render(ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#f00';
      ctx.font = '24px monospace';
      ctx.fillText('GAME OVER', ctx.canvas.width / 2 - 80, ctx.canvas.height / 2);
      ctx.fillStyle = '#fff';
      ctx.fillText(`Score: ${finalScore}`, ctx.canvas.width / 2 - 60, ctx.canvas.height / 2 + 40);
      ctx.fillText('Press Enter to restart', ctx.canvas.width / 2 - 100, ctx.canvas.height / 2 + 80);
    }
  };
}
