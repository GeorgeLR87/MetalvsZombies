export type EventMap = Record<string, unknown>;

export function createEventBus<TEvents extends EventMap>() {
  const listeners = new Map<keyof TEvents, Set<(payload: any) => void>>();

  function on<K extends keyof TEvents>(type: K, cb: (payload: TEvents[K]) => void) {
    let set = listeners.get(type);
    if (!set) listeners.set(type, (set = new Set()));
    set.add(cb as any);
    return () => set!.delete(cb as any);
  }

  function emit<K extends keyof TEvents>(type: K, payload: TEvents[K]) {
    const set = listeners.get(type);
    if (!set) return;
    for (const cb of set) cb(payload);
  }

  return { on, emit };
}
