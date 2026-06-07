import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

export default function History() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    interviewAPI.getSessions().then(r => { setSessions(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const topics = ['ALL', ...new Set(sessions.map(s => s.topic))];
  const filtered = filter === 'ALL' ? sessions : sessions.filter(s => s.topic === filter);

  return (
    <div style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// SESSION ARCHIVE</div>
        <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>INTERVIEW HISTORY</h1>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {topics.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding: '8px 16px', borderRadius: '4px', border: `1px solid ${filter === t ? 'var(--accent-cyan)' : 'var(--border-dim)'}`, background: filter === t ? '#00d4ff15' : 'transparent', color: filter === t ? 'var(--accent-cyan)' : 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.65rem', cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.05em' }}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <div className="orbitron" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>NO SESSIONS FOUND</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map((s, i) => {
            const avg = s.totalQuestions > 0 ? (s.totalScore / s.totalQuestions).toFixed(1) : 0;
            const scoreColor = avg >= 7 ? 'var(--accent-neon)' : avg >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)';
            return (
              <div key={s.id} className="card animate-fadeInUp" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', opacity: 0, animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
                onClick={() => navigate(`/results/${s.id}`)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-glow)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: `${scoreColor}15`, border: `1px solid ${scoreColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="orbitron" style={{ fontSize: '0.75rem', fontWeight: '800', color: scoreColor }}>{avg}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '2px' }}>{s.topic}</div>
                    <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {s.totalQuestions} questions</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`tag ${s.difficulty === 'Easy' ? 'tag-easy' : s.difficulty === 'Medium' ? 'tag-medium' : 'tag-hard'}`}>{s.difficulty}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="orbitron" style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent-electric)' }}>{s.pointsEarned || 0} pts</div>
                    <div className="mono" style={{ fontSize: '0.55rem', color: s.status === 'COMPLETED' ? 'var(--accent-neon)' : 'var(--accent-warning)' }}>{s.status}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}