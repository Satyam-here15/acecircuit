import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '', fullName: '', targetRole: 'Software Engineer', experienceLevel: 'Fresher' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data, res.data.token, false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Engineer'];
  const levels = ['Fresher', 'Junior (1-2 yrs)', 'Mid (3-5 yrs)', 'Senior (5+ yrs)'];

  return (
    <div className="circuit-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, #00ff8806 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '480px', animation: 'fadeInUp 0.7s ease' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="orbitron" style={{ fontSize: '1.6rem', fontWeight: '900', background: 'linear-gradient(135deg, var(--accent-neon), var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.1em', marginBottom: '6px' }}>JOIN ACECIRCUIT</h1>
          <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>INITIALIZE YOUR PROFILE</p>
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-dim)', borderRadius: '12px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-neon), var(--accent-cyan), transparent)' }} />

          {error && <div style={{ background: '#ff6b3510', border: '1px solid #ff6b3530', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.9rem' }}>⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            {[
              { key: 'fullName', label: 'FULL NAME', type: 'text', placeholder: 'John Doe' },
              { key: 'username', label: 'USERNAME', type: 'text', placeholder: 'johndoe' },
              { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'john@domain.com' },
              { key: 'password', label: 'PASSWORD', type: 'password', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>{field.label}</label>
                <input className="input-field" type={field.type} placeholder={field.placeholder} value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} required />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>TARGET ROLE</label>
                <select className="input-field" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })} style={{ cursor: 'pointer' }}>
                  {roles.map(r => <option key={r} value={r} style={{ background: '#060d14' }}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>EXPERIENCE</label>
                <select className="input-field" value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })} style={{ cursor: 'pointer' }}>
                  {levels.map(l => <option key={l} value={l} style={{ background: '#060d14' }}>{l}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
              {loading ? '[ CREATING PROFILE... ]' : '[ CREATE ACCOUNT ]'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Have account? <Link to="/login" style={{ color: 'var(--accent-cyan)', textDecoration: 'none', fontWeight: '600' }}>Sign In →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}