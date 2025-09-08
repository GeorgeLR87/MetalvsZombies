import { createGame } from '@core/game';
import { createBootScene } from '@scenes/boot';
import { mountHUD } from '@ui/bootstrap';
import { createEventBus, type EventBus } from '@core/event-bus';
import { wireUI, type UIEvents } from '@ui/adapter';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const game = createGame(canvas);

// Tipado del bus
const bus = createEventBus<UIEvents>();
wireUI(bus);
mountHUD();

// Extensión tipada del Game para incluir bus (opcional)
type GameWithBus = typeof game & { bus: EventBus<UIEvents> };
(game as GameWithBus).bus = bus;

game.scenes.change(createBootScene(game));
game.start();
