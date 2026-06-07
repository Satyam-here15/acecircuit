import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Engineer'];
const levels = ['Fresher', 'Junior (1-2 yrs)', 'Mid (3-5 yrs)', 'Senior (5+ yrs)'];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    targetRole: user?.targetRole || '',
    experienceLevel: user?.experienceLevel || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      const res = await userAPI.updateProfile(form);
      updateUser(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to update profile');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// ACCOUNT SETTINGS</div>
        <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>MY PROFILE</h1>
      </div>

      {/* Avatar card */}
      <div className="card animate-fadeInUp" style={{ padding: '28px', marginBottom: '20px', opacity: 0, animationFillMode: 'forwards', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-electric))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron', fontWeight: '800', fontSize: '1.8rem', color: '#fff', flexShrink: 0, boxShadow: '0 0 30px #7c3aed40' }}>
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <div className="orbitron" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>{user?.username}</div>
          <div className="mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{user?.email}</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="tag tag-topic">{user?.targetRole || 'No role set'}</span>
            <span className="tag tag-easy">{user?.experienceLevel || 'No level set'}</span>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div className="orbitron" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-cyan)' }}>{user?.totalPoints || 0}</div>
          <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>TOTAL POINTS</div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'SESSIONS', value: user?.totalSessions || 0, color: 'var(--accent-cyan)' },
          { label: 'AVG SCORE', value: `${user?.averageScore || 0}/10`, color: 'var(--accent-neon)' },
          { label: 'POINTS', value: user?.totalPoints || 0, color: 'var(--accent-electric)' },
        ].map((s, i) => (
          <div key={i} className="card animate-fadeInUp" style={{ padding: '16px', textAlign: 'center', opacity: 0, animationDelay: `${i * 0.1}s`, animationFillMode: 'forwards' }}>
            <div className="orbitron" style={{ fontSize: '1.4rem', fontWeight: '900', color: s.color }}>{s.value}</div>
            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <div className="card animate-fadeInUp" style={{ padding: '28px', opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-purple), var(--accent-electric), transparent)' }} />
        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ EDIT PROFILE ]</div>

        {error && <div style={{ background: '#ff6b3510', border: '1px solid #ff6b3530', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.88rem' }}>⚠ {error}</div>}
        {saved && <div style={{ background: '#00ff8810', border: '1px solid #00ff8830', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', color: 'var(--accent-neon)', fontFamily: 'Rajdhani', fontSize: '0.88rem', fontWeight: '600' }}>✓ Profile updated successfully!</div>}

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>FULL NAME</label>
            <input className="input-field" type="text" placeholder="Your full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>TARGET ROLE</label>
            <select className="input-field" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })} style={{ cursor: 'pointer' }}>
              <option value="" style={{ background: '#060d14' }}>Select role...</option>
              {roles.map(r => <option key={r} value={r} style={{ background: '#060d14' }}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '7px', letterSpacing: '0.1em' }}>EXPERIENCE LEVEL</label>
            <select className="input-field" value={form.experienceLevel} onChange={e => setForm({ ...form, experienceLevel: e.target.value })} style={{ cursor: 'pointer' }}>
              <option value="" style={{ background: '#060d14' }}>Select level...</option>
              {levels.map(l => <option key={l} value={l} style={{ background: '#060d14' }}>{l}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px' }} disabled={saving}>
            {saving ? '[ SAVING... ]' : '[ SAVE CHANGES ]'}
          </button>
        </form>
      </div>
    </div>
  );
}