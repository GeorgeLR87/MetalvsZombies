import type { World } from '@state/world';
import type { Game } from '@core/game';
import { makeProjectile } from '@state/world';

export function createShootingSystem() {
  let cooldown = 0;          // seconds remaining
  const cadence = 0.25;      // shots per 0.25s

  return function shootingSystem(world: World, game: Game, dt: number) {
    // reduce cooldown
    if (cooldown > 0) cooldown -= dt;

    const fire = game.input.pressed(' ') || game.input.pressed('Enter');
    if (!fire || cooldown > 0) return;

    const player = world.entities.find(e => e.tag === 'player' && e.transform && e.sprite);
    if (!player?.transform || !player.sprite) return;

    // spawn from front of the player
    const px = player.transform.x + (player.sprite.w ?? 16);
    const py = player.transform.y + (player.sprite.h ?? 16) / 2;

    world.add(makeProjectile(px, py - 2, 'right'));
    cooldown = cadence;
  };
}
