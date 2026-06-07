import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const ADMIN_EMAIL = 'admin@acecircuit.com';
const ADMIN_PASSWORD = 'Admin@1234';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [adminForm, setAdminForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data, res.data.token, false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminError('');
    if (adminForm.email === ADMIN_EMAIL && adminForm.password === ADMIN_PASSWORD) {
      login({ username: 'Admin', email: ADMIN_EMAIL, fullName: 'AceCircuit Admin' }, 'admin-token-acecircuit', true);
      navigate('/admin');
    } else {
      setAdminError('Invalid admin credentials');
    }
  };

  return (
    <div className="circuit-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: '400px', height: '400px', background: 'radial-gradient(circle, #0066ff08 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '300px', height: '300px', background: 'radial-gradient(circle, #00d4ff08 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Scan line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-cyan), transparent)', animation: 'scan 4s linear infinite', pointerEvents: 'none' }} />

      {/* ADMIN MODAL */}
      {showAdminModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(6px)', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '20px', animation: 'fadeInUp 0.4s ease' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid #ff6b3540', borderRadius: '12px', padding: '36px', position: 'relative', overflow: 'hidden' }}>

              {/* Top accent */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, var(--accent-warning), #ff6b35, transparent)' }} />

              {/* Close button */}
              <button onClick={() => { setShowAdminModal(false); setAdminError(''); setAdminForm({ email: '', password: '' }); }}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: '1px solid var(--border-dim)', borderRadius: '4px', color: 'var(--text-muted)', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-warning)'; e.currentTarget.style.color = 'var(--accent-warning)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >✕</button>

              {/* Icon + title */}
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: '#ff6b3515', border: '1px solid #ff6b3540', borderRadius: '12px', marginBottom: '16px', fontSize: '1.6rem' }}>⬢</div>
                <h2 className="orbitron" style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-warning)', letterSpacing: '0.12em', marginBottom: '4px' }}>ADMIN ACCESS</h2>
                <p className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>RESTRICTED — AUTHORIZED PERSONNEL ONLY</p>
              </div>

              {adminError && (
                <div style={{ background: '#ff6b3510', border: '1px solid #ff6b3540', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.88rem', fontWeight: '600' }}>
                  ⚠ {adminError}
                </div>
              )}

              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>ADMIN EMAIL</label>
                  <input className="input-field" type="email" placeholder="admin@acecircuit.com"
                    value={adminForm.email}
                    onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                    style={{ borderColor: '#ff6b3520' }}
                    required />
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>ADMIN PASSWORD</label>
                  <input className="input-field" type="password" placeholder="••••••••"
                    value={adminForm.password}
                    onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                    style={{ borderColor: '#ff6b3520' }}
                    required />
                </div>
                <button type="submit" style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg, #ff6b35, #ff8c42)', border: 'none', borderRadius: '4px', color: '#000', fontFamily: 'Orbitron', fontWeight: '800', fontSize: '0.72rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s', textTransform: 'uppercase' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 25px #ff6b3540'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  ⬢ ENTER ADMIN PANEL
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MAIN LOGIN CARD */}
      <div style={{ width: '100%', maxWidth: '420px', padding: '20px', animation: 'fadeInUp 0.7s ease' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '70px', height: '70px', background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-cyan))', borderRadius: '16px', marginBottom: '20px', fontSize: '2rem', animation: 'float 3s ease-in-out infinite', boxShadow: '0 0 40px #00d4ff30' }}>⚡</div>
          <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-electric))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.1em', marginBottom: '6px' }}>ACECIRCUIT</h1>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', letterSpacing: '0.15em' }}>CIRCUIT YOUR WAY TO YOUR DREAM JOB</p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dim)', borderRadius: '12px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-electric), var(--accent-cyan), transparent)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <h2 className="orbitron" style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '0.1em' }}>SIGN IN</h2>
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', background: '#0a1628', padding: '4px 10px', borderRadius: '4px', border: '1px solid var(--border-dim)' }}>v2.0.1</span>
          </div>

          {error && (
            <div style={{ background: '#ff6b3510', border: '1px solid #ff6b3530', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.9rem', fontWeight: '600' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>EMAIL ADDRESS</label>
              <input className="input-field" type="email" placeholder="user@domain.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>PASSWORD</label>
              <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? '[ AUTHENTICATING... ]' : '[ INITIALIZE SESSION ]'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-dim)' }} />
            <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-dim)' }} />
          </div>

          {/* Admin Button */}
          <button onClick={() => setShowAdminModal(true)}
            style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #ff6b3540', borderRadius: '6px', color: 'var(--accent-warning)', fontFamily: 'Orbitron', fontWeight: '700', fontSize: '0.68rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#ff6b3510'; e.currentTarget.style.borderColor = '#ff6b3580'; e.currentTarget.style.boxShadow = '0 0 20px #ff6b3520'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#ff6b3540'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <span>⬢</span> LOGIN AS ADMIN
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>Register →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}