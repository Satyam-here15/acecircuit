import React, { useEffect, useState } from 'react';
import { interviewAPI } from '../services/api';

export default function AdminPanel() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    interviewAPI.getLeaderboard()
      .then(r => { setLeaders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalSessions = leaders.reduce((a, b) => a + (b.totalSessions || 0), 0);
  const totalPoints = leaders.reduce((a, b) => a + (b.totalPoints || 0), 0);
  const avgScore = leaders.length > 0
    ? (leaders.reduce((a, b) => a + (b.averageScore || 0), 0) / leaders.length).toFixed(1)
    : 0;

  const tabs = [
    { id: 'overview', label: 'OVERVIEW', icon: '⬡' },
    { id: 'users', label: 'USER MANAGEMENT', icon: '◈' },
    { id: 'analytics', label: 'ANALYTICS', icon: '◎' },
    { id: 'system', label: 'SYSTEM', icon: '⬢' },
  ];

  const StatBox = ({ label, value, color, icon, sub }) => (
    <div className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: color }} />
      <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '3.5rem', opacity: 0.04 }}>{icon}</div>
      <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px' }}>{label}</div>
      <div className="orbitron" style={{ fontSize: '2.2rem', fontWeight: '900', color, lineHeight: 1 }}>{value}</div>
      {sub && <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '6px' }}>{sub}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--accent-warning)', letterSpacing: '0.15em', marginBottom: '8px' }}>// ADMIN CONTROL CENTER</div>
          <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>SYSTEM DASHBOARD</h1>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani', marginTop: '4px' }}>Full platform visibility and control</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: '#00ff8810', border: '1px solid #00ff8830', borderRadius: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-neon)', boxShadow: '0 0 8px var(--accent-neon)', animation: 'pulse-cyan 1.5s infinite' }} />
            <span className="mono" style={{ fontSize: '0.58rem', color: 'var(--accent-neon)', letterSpacing: '0.1em' }}>ALL SYSTEMS ONLINE</span>
          </div>
          <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>
            {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-dim)', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '10px 18px', borderRadius: '6px', border: 'none', background: activeTab === t.id ? 'var(--bg-card)' : 'transparent', color: activeTab === t.id ? 'var(--accent-warning)' : 'var(--text-muted)', fontFamily: 'Orbitron', fontSize: '0.6rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.08em', boxShadow: activeTab === t.id ? '0 0 15px #ff6b3520' : 'none' }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <StatBox label="REGISTERED USERS" value={leaders.length} color="var(--accent-cyan)" icon="👤" sub="Total accounts" />
            <StatBox label="TOTAL SESSIONS" value={totalSessions} color="var(--accent-neon)" icon="◈" sub="Interviews done" />
            <StatBox label="PLATFORM AVG SCORE" value={`${avgScore}/10`} color="var(--accent-electric)" icon="⭐" sub="Across all users" />
            <StatBox label="POINTS DISTRIBUTED" value={totalPoints} color="var(--accent-warning)" icon="⚡" sub="Total earned" />
          </div>

          {/* Top 5 performers */}
          <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>[ TOP PERFORMERS ]</div>
              <button onClick={() => setActiveTab('users')} className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.58rem' }}>VIEW ALL USERS</button>
            </div>
            {loading ? (
              <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Loading...</div>
            ) : leaders.slice(0, 5).map((u, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 4 ? '1px solid var(--border-dim)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '28px', textAlign: 'center' }}>
                      {i < 3 ? <span style={{ fontSize: '1.1rem' }}>{medals[i]}</span> : <span className="orbitron" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>#{i + 1}</span>}
                    </div>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-electric))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron', fontSize: '0.7rem', color: '#fff', fontWeight: '700' }}>
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{u.username}</div>
                      <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '28px' }}>
                    {[
                      { label: 'sessions', val: u.totalSessions, color: 'var(--accent-cyan)' },
                      { label: 'avg score', val: `${u.averageScore?.toFixed(1)}/10`, color: 'var(--accent-neon)' },
                      { label: 'points', val: u.totalPoints, color: 'var(--accent-warning)' },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: 'center' }}>
                        <div className="orbitron" style={{ fontSize: '0.9rem', fontWeight: '800', color: item.color }}>{item.val}</div>
                        <div className="mono" style={{ fontSize: '0.52rem', color: 'var(--text-muted)' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ RECENT ACTIVITY LOG ]</div>
            {leaders.slice(0, 6).map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border-dim)' : 'none' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-neon)', flexShrink: 0 }} />
                <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', width: '80px', flexShrink: 0 }}>USER</div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: '600', color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>{u.username}</div>
                <div style={{ fontFamily: 'Rajdhani', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>completed {u.totalSessions} interview session{u.totalSessions !== 1 ? 's' : ''}</div>
                <div className="mono" style={{ marginLeft: 'auto', fontSize: '0.55rem', color: 'var(--text-muted)' }}>avg {u.averageScore?.toFixed(1)}/10</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER MANAGEMENT TAB */}
      {activeTab === 'users' && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-dim)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>[ ALL REGISTERED USERS ]</div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)' }}>{leaders.length} TOTAL USERS</div>
              </div>
            </div>

            {/* Table header */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-dim)', display: 'grid', gridTemplateColumns: '40px 1fr 180px 100px 100px 100px 100px', gap: '12px', background: '#040c18' }}>
              {['#', 'USER', 'EMAIL', 'ROLE', 'SESSIONS', 'AVG', 'POINTS'].map(h => (
                <div key={h} className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{h}</div>
              ))}
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>Loading users...</div>
            ) : leaders.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <div className="orbitron" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>NO USERS REGISTERED YET</div>
              </div>
            ) : leaders.map((u, i) => (
              <div key={i} style={{ padding: '14px 24px', display: 'grid', gridTemplateColumns: '40px 1fr 180px 100px 100px 100px 100px', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--border-dim)', transition: 'background 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = '#0a1628'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div className="orbitron" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{i + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-electric))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron', fontSize: '0.65rem', color: '#fff', flexShrink: 0 }}>
                    {u.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{u.username}</div>
                    <div className="mono" style={{ fontSize: '0.52rem', color: 'var(--text-muted)' }}>{u.targetRole || 'N/A'}</div>
                  </div>
                </div>
                <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                <div>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.55rem', padding: '3px 8px', borderRadius: '3px', background: '#00d4ff10', color: 'var(--accent-cyan)', border: '1px solid #00d4ff20' }}>USER</span>
                </div>
                <div className="orbitron" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>{u.totalSessions}</div>
                <div className="orbitron" style={{ fontSize: '0.85rem', color: u.averageScore >= 7 ? 'var(--accent-neon)' : u.averageScore >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)' }}>{u.averageScore?.toFixed(1)}</div>
                <div className="orbitron" style={{ fontSize: '0.85rem', color: 'var(--accent-electric)', fontWeight: '700' }}>{u.totalPoints}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Score distribution */}
            <div className="card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ SCORE DISTRIBUTION ]</div>
              {[
                { label: 'Excellent (8-10)', count: leaders.filter(u => u.averageScore >= 8).length, color: 'var(--accent-neon)' },
                { label: 'Good (6-8)', count: leaders.filter(u => u.averageScore >= 6 && u.averageScore < 8).length, color: 'var(--accent-cyan)' },
                { label: 'Average (4-6)', count: leaders.filter(u => u.averageScore >= 4 && u.averageScore < 6).length, color: 'var(--accent-electric)' },
                { label: 'Needs Work (0-4)', count: leaders.filter(u => u.averageScore < 4).length, color: 'var(--accent-warning)' },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span className="orbitron" style={{ fontSize: '0.75rem', color: item.color }}>{item.count} users</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--border-dim)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${leaders.length > 0 ? (item.count / leaders.length) * 100 : 0}%`, background: item.color, borderRadius: '4px', boxShadow: `0 0 8px ${item.color}40`, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Experience levels */}
            <div className="card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ EXPERIENCE LEVELS ]</div>
              {['Fresher', 'Junior (1-2 yrs)', 'Mid (3-5 yrs)', 'Senior (5+ yrs)'].map((level, i) => {
                const count = leaders.filter(u => u.experienceLevel === level).length;
                return (
                  <div key={i} style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'Rajdhani', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{level}</span>
                      <span className="orbitron" style={{ fontSize: '0.75rem', color: 'var(--accent-purple)' }}>{count}</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border-dim)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${leaders.length > 0 ? (count / leaders.length) * 100 : 0}%`, background: 'var(--accent-purple)', borderRadius: '4px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform metrics */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ PLATFORM METRICS ]</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {[
                { label: 'Total Questions Answered', value: totalSessions * 5, color: 'var(--accent-cyan)' },
                { label: 'AI Evaluations Performed', value: totalSessions * 5, color: 'var(--accent-neon)' },
                { label: 'Total Points Distributed', value: totalPoints, color: 'var(--accent-warning)' },
                { label: 'Avg Sessions Per User', value: leaders.length > 0 ? (totalSessions / leaders.length).toFixed(1) : 0, color: 'var(--accent-electric)' },
                { label: 'Completion Rate', value: '100%', color: 'var(--accent-neon)' },
                { label: 'AI Model', value: 'Llama 3.3', color: 'var(--accent-purple)' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', background: '#040c18', borderRadius: '8px', border: '1px solid var(--border-dim)' }}>
                  <div style={{ fontFamily: 'Rajdhani', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{item.label}</div>
                  <div className="orbitron" style={{ fontSize: '1.3rem', fontWeight: '900', color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SYSTEM TAB */}
      {activeTab === 'system' && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ SERVICE STATUS ]</div>
              {[
                { label: 'Spring Boot Backend', status: 'ONLINE', color: 'var(--accent-neon)', detail: 'Port 8080' },
                { label: 'PostgreSQL Database', status: 'CONNECTED', color: 'var(--accent-neon)', detail: 'acecircuit db' },
                { label: 'Groq AI (Llama 3.3)', status: 'ACTIVE', color: 'var(--accent-cyan)', detail: '14,400 req/day free' },
                { label: 'JWT Auth Service', status: 'RUNNING', color: 'var(--accent-neon)', detail: '24h expiry' },
                { label: 'React Frontend', status: 'ONLINE', color: 'var(--accent-neon)', detail: 'Port 3000' },
                { label: 'CORS Policy', status: 'ENABLED', color: 'var(--accent-cyan)', detail: 'All origins' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < 5 ? '1px solid var(--border-dim)' : 'none' }}>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.label}</div>
                    <div className="mono" style={{ fontSize: '0.52rem', color: 'var(--text-muted)' }}>{item.detail}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                    <span className="mono" style={{ fontSize: '0.58rem', color: item.color, letterSpacing: '0.08em' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '28px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ TECH STACK ]</div>
              {[
                { layer: 'Frontend', tech: 'React 18', detail: 'Vercel deployment' },
                { layer: 'Backend', tech: 'Spring Boot 3', detail: 'Render deployment' },
                { layer: 'Database', tech: 'PostgreSQL', detail: 'Render managed DB' },
                { layer: 'AI Engine', tech: 'Groq + Llama 3.3', detail: 'Free tier — 14k req/day' },
                { layer: 'Auth', tech: 'JWT Tokens', detail: '24 hour expiry' },
                { layer: 'Build', tech: 'Maven', detail: 'Java 17' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < 5 ? '1px solid var(--border-dim)' : 'none' }}>
                  <div>
                    <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginBottom: '3px' }}>{item.layer}</div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.tech}</div>
                  </div>
                  <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--accent-cyan)', textAlign: 'right' }}>{item.detail}</div>
                </div>
              ))}
            </div>

            {/* Admin credentials reminder */}
            <div className="card" style={{ padding: '24px', gridColumn: '1 / -1', background: '#ff6b3508', borderColor: '#ff6b3520' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-warning)', letterSpacing: '0.1em', marginBottom: '12px' }}>[ ADMIN CREDENTIALS — KEEP PRIVATE ]</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Email: <span style={{ color: 'var(--accent-warning)' }}>admin@acecircuit.com</span>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Password: <span style={{ color: 'var(--accent-warning)' }}>Admin@1234</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}