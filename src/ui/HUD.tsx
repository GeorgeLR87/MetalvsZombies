import { useUIStore } from './store';

export default function HUD() {
  const score = useUIStore(s => s.score);
  const lives = useUIStore(s => s.lives);
  const paused = useUIStore(s => s.paused);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          color: '#fff',
          fontFamily: 'monospace',
          fontSize: 14,
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 1px 2px rgba(0,0,0,0.6)'
        }}
      >
        <div>Score: {score}</div>
        <div>Lives: {lives}</div>
      </div>

      {paused && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontFamily: 'monospace',
            fontSize: 22
          }}
        >
          PAUSED (press P)
        </div>
      )}
    </>
  );
}
