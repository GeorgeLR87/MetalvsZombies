import type { World } from '@state/world';

// Normaliza un vector (dx, dy) y lo escala por "speed".
function steer(dx: number, dy: number, speed: number) {
  const len = Math.hypot(dx, dy) || 1;
  return { vx: (dx / len) * speed, vy: (dy / len) * speed };
}

export function enemyAISystem(world: World) {
  const player = world.entities.find(e => e.tag === 'player' && e.transform && e.kinematics);
  if (!player?.transform) return;

  for (const e of world.entities) {
    if (e.tag !== 'enemy' || !e.transform) continue;

    // si el enemigo no tiene kinematics, asume speed por defecto
    const speed = e.kinematics?.speed ?? 80;

    // objetivo: posición del jugador
    const dx = player.transform.x - e.transform.x;
    const dy = player.transform.y - e.transform.y;

    const { vx, vy } = steer(dx, dy, speed);

    // crea kinematics si no existe, o actualiza la existente
    if (e.kinematics) {
      e.kinematics.vx = vx;
      e.kinematics.vy = vy;
    } else {
      e.kinematics = { vx, vy, speed };
    }
  }
}
