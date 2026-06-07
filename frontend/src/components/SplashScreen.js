import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING...');

  const steps = [
    'INITIALIZING SYSTEM...',
    'LOADING AI ENGINE...',
    'CONNECTING DATABASE...',
    'CALIBRATING CIRCUITS...',
    'READY.',
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress(step * 20);
      setStatusText(steps[step] || 'READY.');
      if (step >= 5) {
        clearInterval(interval);
        setTimeout(onDone, 400);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div className="circuit-bg" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '30%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, #0066ff06 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, #00d4ff06 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Scan line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', animation: 'scan 3s linear infinite' }} />

      {/* Logo */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{
          width: '90px', height: '90px',
          background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-cyan))',
          borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem', margin: '0 auto 28px',
          boxShadow: '0 0 60px #00d4ff40, 0 0 120px #0066ff20',
          animation: 'float 2s ease-in-out infinite',
        }}>⚡</div>

        <h1 className="orbitron" style={{
          fontSize: '3rem', fontWeight: '900', letterSpacing: '0.15em',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-electric))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: '6px', animation: 'glitch 4s infinite',
        }}>ACECIRCUIT</h1>

        <p className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '48px' }}>
          CIRCUIT YOUR WAY TO YOUR DREAM JOB
        </p>

        {/* Progress bar */}
        <div style={{ width: '320px', margin: '0 auto 16px' }}>
          <div style={{ height: '3px', background: 'var(--border-dim)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent-electric), var(--accent-cyan))',
              borderRadius: '2px', transition: 'width 0.4s ease',
              boxShadow: '0 0 12px #00d4ff60',
            }} />
          </div>
        </div>

        {/* Status text */}
        <div className="mono" style={{ fontSize: '0.62rem', color: 'var(--accent-cyan)', letterSpacing: '0.15em', height: '20px' }}>
          {statusText}
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '32px' }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: progress >= (i + 1) * 20 ? 'var(--accent-cyan)' : 'var(--border-dim)',
              boxShadow: progress >= (i + 1) * 20 ? '0 0 8px var(--accent-cyan)' : 'none',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}