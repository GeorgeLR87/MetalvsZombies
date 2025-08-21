export type Input = { pressed: (key: string) => boolean; destroy: () => void };

export function createInput(target: Window = window): Input {
  const keys = new Set<string>();
  const kd = (e: KeyboardEvent) => keys.add(e.key);
  const ku = (e: KeyboardEvent) => keys.delete(e.key);
  target.addEventListener('keydown', kd);
  target.addEventListener('keyup', ku);
  return {
    pressed: (k: string) => keys.has(k),
    destroy: () => {
      target.removeEventListener('keydown', kd);
      target.removeEventListener('keyup', ku);
    }
  };
}
