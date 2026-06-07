import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

 const navItems = isAdmin ? [
  { path: '/admin', label: 'Dashboard', icon: '⬡' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '◆' },
] : [
  { path: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { path: '/interview', label: 'Interview', icon: '◈' },
  { path: '/history', label: 'History', icon: '◎' },
  { path: '/leaderboard', label: 'Leaderboard', icon: '◆' },
  { path: '/profile', label: 'Profile', icon: '◉' },
  { path: '/resume', label: 'Resume', icon: '◑' },
];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '240px', minHeight: '100vh',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-dim)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, zIndex: 100,
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid var(--border-dim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-cyan))',
              borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '800', color: '#000', fontFamily: 'Orbitron',
              animation: 'pulse-cyan 2s infinite',
            }}>A</div>
            <div>
              <div className="orbitron" style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>ACE</div>
              <div className="orbitron" style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.1em', marginTop: '-4px' }}>CIRCUIT</div>
            </div>
          </div>
          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>CIRCUIT YOUR WAY TO SUCCESS</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 14px', marginBottom: '4px', borderRadius: '6px',
                  background: active ? 'linear-gradient(135deg, #0066ff15, #00d4ff10)' : 'transparent',
                  border: active ? '1px solid var(--border-glow)' : '1px solid transparent',
                  color: active ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontFamily: 'Rajdhani', fontWeight: '600', fontSize: '0.95rem',
                  letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#0a1628'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <span style={{ fontSize: '1rem', opacity: active ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
                {active && <div style={{ marginLeft: 'auto', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }} />}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-dim)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-electric))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Orbitron', fontWeight: '700', fontSize: '0.8rem', color: '#fff',
            }}>{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.username}</div>
              <div className="mono" style={{ fontSize: '0.6rem', color: isAdmin ? 'var(--accent-warning)' : 'var(--text-muted)' }}>{isAdmin ? '[ ADMIN ]' : '[ USER ]'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-danger" style={{ width: '100%', fontSize: '0.65rem' }}>
            ⏻ Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: '240px', flex: 1, minHeight: '100vh', padding: '32px', maxWidth: 'calc(100vw - 240px)' }}>
        {children}
      </main>
    </div>
  );
}