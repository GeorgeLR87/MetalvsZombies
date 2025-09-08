import type { Entity } from './entities';

export type World = {
  entities: Entity[];
  add: (e: Omit<Entity, 'id'>) => Entity;
  remove: (id: number) => void;
  findByTag: (tag: Entity['tag']) => Entity[];
};

export function createWorld(): World {
  const entities: Entity[] = [];
  let nextId = 1;

  function add(e: Omit<Entity, 'id'>): Entity {
    const ent: Entity = { id: nextId++, ...e };
    entities.push(ent);
    return ent;
  }
  function remove(id: number) {
    const idx = entities.findIndex(e => e.id === id);
    if (idx >= 0) entities.splice(idx, 1);
  }
  function findByTag(tag: Entity['tag']) {
    return entities.filter(e => e.tag === tag);
  }

  return { entities, add, remove, findByTag };
}

// Factory: player
export function makePlayer() {
  return {
    tag: 'player' as const,
    transform: { x: 100, y: 300 },
    kinematics: { vx: 0, vy: 0, speed: 180 },
    collider: { w: 24, h: 24, solid: true },
    sprite: { w: 24, h: 24, color: '#ff0' }
  };
}

// --- Enemy factory (dummy) ---
export function makeEnemy(x = 300, y = 260) {
  return {
    tag: 'enemy' as const,
    transform: { x, y },
    // sin kinematics por ahora (enemigo estático)
    collider: { w: 28, h: 28, solid: true },
    sprite: { w: 28, h: 28, color: '#0af' }
  };
}

// --- Projectile factory ---
export function makeProjectile(x: number, y: number, dir: 'right'|'left' = 'right') {
  const speed = 360;
  return {
    tag: 'projectile' as const,
    transform: { x, y },
    kinematics: { vx: dir === 'right' ? speed : -speed, vy: 0, speed },
    collider: { w: 8, h: 4, solid: false },
    sprite: { w: 8, h: 4, color: '#fff' }
  };
}
