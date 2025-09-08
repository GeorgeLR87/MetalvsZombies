import { createGame } from '@core/game';
import { createBootScene } from '@scenes/boot';
import { mountHUD } from '@ui/bootstrap';
import { createEventBus } from '@core/event-bus';
import { wireUI } from '@ui/adapter';
import type { UIEvents } from '@ui/adapter';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = createGame(canvas);

// UI: montar HUD y bus
const bus = createEventBus<UIEvents>();
wireUI(bus);
mountHUD();
(game as any).bus = bus;

game.scenes.change(createBootScene(game));
game.start();
