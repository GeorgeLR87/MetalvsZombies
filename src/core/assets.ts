export type Assets = {
  images: Map<string, HTMLImageElement>;
  loadImage: (key: string, path: string) => Promise<HTMLImageElement>;
  getImage: (key: string) => HTMLImageElement;
};

export function createAssets(): Assets {
  const images = new Map<string, HTMLImageElement>();

  async function loadImage(key: string, path: string) {
    const img = new Image();
    img.src = path;
    await img.decode();
    images.set(key, img);
    return img;
  }

  function getImage(key: string) {
    const img = images.get(key);
    if (!img) throw new Error(`Image not found: ${key}`);
    return img;
  }

  return { images, loadImage, getImage };
}
