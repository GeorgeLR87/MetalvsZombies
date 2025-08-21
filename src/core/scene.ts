export type Scene = {
  init?: () => Promise<void> | void;
  update: (dt: number) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
  dispose?: () => void;
};

export function createSceneManager() {
  let current: Scene | null = null;
  return {
    change(next: Scene) {
      current?.dispose?.();
      current = next;
      current?.init?.();
    },
    update(dt: number) { current?.update(dt); },
    render(ctx: CanvasRenderingContext2D) { current?.render(ctx); }
  };
}
