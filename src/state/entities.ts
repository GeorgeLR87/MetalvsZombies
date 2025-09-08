// Componentes base
export type Transform = { x: number; y: number };
export type Kinematics = { vx: number; vy: number; speed: number };

// AABB en coordenadas del mundo
export type Collider = { w: number; h: number, solid?: boolean }; 

export type Sprite = { w: number; h: number; color?: string; imageKey?: string };
export type Tag = 'player' | 'enemy' | 'projectile';

// Entidad
export type Entity = {
  id: number;
  tag?: Tag;
  transform?: Transform;
  kinematics?: Kinematics;
  collider?: Collider;
  sprite?: Sprite;
};
