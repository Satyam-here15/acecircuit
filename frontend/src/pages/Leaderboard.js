import React, { useEffect, useState } from 'react';
import { interviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    interviewAPI.getLeaderboard().then(r => { setLeaders(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];
  const rankColors = ['#ffd700', '#c0c0c0', '#cd7f32'];

  return (
    <div style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// GLOBAL RANKINGS</div>
        <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>LEADERBOARD</h1>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-dim)', display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px', gap: '16px' }}>
          {['RANK', 'USER', 'SESSIONS', 'POINTS'].map(h => (
            <div key={h} className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>Loading...</div>
        ) : leaders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <div className="orbitron" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>NO DATA YET</div>
          </div>
        ) : leaders.map((l, i) => {
          const isMe = l.email === user?.email;
          return (
            <div key={i} className="animate-fadeInUp" style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--border-dim)', background: isMe ? '#00d4ff05' : 'transparent', opacity: 0, animationDelay: `${i * 0.07}s`, animationFillMode: 'forwards', transition: 'background 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {i < 3 ? <span style={{ fontSize: '1.2rem' }}>{medals[i]}</span> : <div className="orbitron" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>#{i + 1}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: i < 3 ? `${rankColors[i]}20` : 'var(--bg-card-hover)', border: `1px solid ${i < 3 ? rankColors[i] + '40' : 'var(--border-dim)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Orbitron', fontWeight: '700', fontSize: '0.7rem', color: i < 3 ? rankColors[i] : 'var(--text-secondary)' }}>
                  {l.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '0.95rem', color: isMe ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>{l.username} {isMe && <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--accent-cyan)' }}>(you)</span>}</div>
                  <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>avg {l.averageScore?.toFixed(1)}/10</div>
                </div>
              </div>
              <div className="orbitron" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{l.totalSessions}</div>
              <div className="orbitron" style={{ fontSize: '1rem', fontWeight: '800', color: i < 3 ? rankColors[i] : 'var(--accent-electric)' }}>{l.totalPoints}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}