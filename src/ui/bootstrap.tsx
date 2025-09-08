import { createRoot } from 'react-dom/client';
import HUD from './HUD';

export function mountHUD() {
  const host = document.getElementById('hud-root');
  if (!host) return;
  const root = createRoot(host);
  root.render(<HUD />);
}
