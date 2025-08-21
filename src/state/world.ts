import type { Entity, EntityId } from './entities';

export type World = {
  entities: Entity[];
  add: (e: Omit<Entity, 'id'>) => Entity;
  remove: (id: EntityId) => void;
  findByTag: (tag: Entity['tag']) => Entity[];
};

export function createWorld(): World {
  const entities: Entity[] = [];

  function add(e: Omit<Entity, 'id'>): Entity {
    const id = (Math.random() * 1e9) | 0; // id simple (o usa newId())
    const ent: Entity = { id, ...e };
    entities.push(ent);
    return ent;
  }

  function remove(id: EntityId) {
    const idx = entities.findIndex(e => e.id === id);
    if (idx >= 0) entities.splice(idx, 1);
  }

  function findByTag(tag: Entity['tag']) {
    return entities.filter(e => e.tag === tag);
  }

  return { entities, add, remove, findByTag };
}
