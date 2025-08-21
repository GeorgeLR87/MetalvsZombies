// Component-style light: cada entidad es un objeto con componentes opcionales
export type EntityId = number;

export type Transform = { x: number; y: number; vx?: number; vy?: number };
export type Sprite = { w: number; h: number; color?: string; imageKey?: string };

export type Entity = {
  id: EntityId;
  transform?: Transform;
  sprite?: Sprite;
  tag?: 'player' | 'enemy' | 'projectile';
};

let nextId = 1;
export const newId = () => nextId++;
