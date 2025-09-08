// src/core/event-bus.ts
export type EventMap = Record<string, unknown>;

export type EventBus<TEvents extends EventMap> = {
  on<K extends keyof TEvents>(type: K, cb: (payload: TEvents[K]) => void): () => void;
  emit<K extends keyof TEvents>(type: K, payload: TEvents[K]): void;
};

export function createEventBus<TEvents extends EventMap>(): EventBus<TEvents> {
  // Usamos unknown para evitar 'any'
  const listeners = new Map<keyof TEvents, Set<unknown>>();

  function on<K extends keyof TEvents>(type: K, cb: (payload: TEvents[K]) => void) {
    let set = listeners.get(type);
    if (!set) {
      set = new Set();
      listeners.set(type, set);
    }
    (set as Set<(payload: TEvents[K]) => void>).add(cb);
    return () => {
      (set as Set<(payload: TEvents[K]) => void>).delete(cb);
    };
  }

  function emit<K extends keyof TEvents>(type: K, payload: TEvents[K]) {
    const set = listeners.get(type) as Set<(payload: TEvents[K]) => void> | undefined;
    if (!set) return;
    for (const cb of set) cb(payload);
  }

  return { on, emit };
}
