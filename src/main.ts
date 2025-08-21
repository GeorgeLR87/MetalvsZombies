import { createGame } from '@core/game';
import { createBootScene } from '@scenes/boot';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = createGame(canvas);

game.scenes.change(createBootScene(game));
game.start();

