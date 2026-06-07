import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI, userAPI } from '../services/api';

const StatCard = ({ label, value, unit, color, delay }) => (
  <div className="card animate-fadeInUp" style={{ padding: '24px', animationDelay: delay, opacity: 0, animationFillMode: 'forwards', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: color }} />
    <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px' }}>{label}</div>
    <div className="orbitron" style={{ fontSize: '2rem', fontWeight: '800', color, lineHeight: 1 }}>{value}<span style={{ fontSize: '0.9rem', marginLeft: '4px', opacity: 0.6 }}>{unit}</span></div>
  </div>
);

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      interviewAPI.getSessions(),
      userAPI.getProfile()
    ]).then(([sessionsRes, profileRes]) => {
      setSessions(sessionsRes.data);
      updateUser(profileRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const topics = ['DSA', 'System Design', 'Java', 'Spring Boot', 'SQL', 'OS'];
  const recentSessions = sessions.slice(0, 5);

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '36px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// WELCOME BACK</div>
        <h1 className="orbitron" style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '0.05em', marginBottom: '6px' }}>
          {user?.fullName || user?.username}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani', fontSize: '1.05rem' }}>
          Ready to circuit your way to your dream job?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
        <StatCard label="TOTAL SESSIONS" value={user?.totalSessions || 0} color="var(--accent-cyan)" delay="0.1s" />
        <StatCard label="AVG SCORE" value={user?.averageScore || 0} unit="/10" color="var(--accent-neon)" delay="0.2s" />
        <StatCard label="TOTAL POINTS" value={user?.totalPoints || 0} color="var(--accent-electric)" delay="0.3s" />
        <StatCard label="RANK" value={sessions.length > 0 ? 'TOP' : 'NEW'} unit={sessions.length > 0 ? '10%' : ''} color="var(--accent-warning)" delay="0.4s" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '36px' }}>
        <div className="card animate-fadeInUp" style={{ padding: '28px', animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'radial-gradient(circle, #0066ff15 0%, transparent 70%)', borderRadius: '50%' }} />
          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-electric)', letterSpacing: '0.1em', marginBottom: '12px' }}>[ QUICK START ]</div>
          <h2 className="orbitron" style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', letterSpacing: '0.05em' }}>START INTERVIEW</h2>
          <p style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.5 }}>
            AI-powered technical interview with real-time evaluation and detailed feedback.
          </p>
          <button className="btn-primary" onClick={() => navigate('/interview')}>◈ BEGIN SESSION</button>
        </div>

        <div className="card animate-fadeInUp" style={{ padding: '28px', animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ AVAILABLE TOPICS ]</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {topics.map((topic) => (
              <button key={topic} onClick={() => navigate('/interview')}
                style={{ padding: '10px 14px', background: '#040c18', border: '1px solid var(--border-dim)', borderRadius: '6px', color: 'var(--text-secondary)', fontFamily: 'Rajdhani', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', letterSpacing: '0.03em' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-glow)'; e.currentTarget.style.color = 'var(--accent-cyan)'; e.currentTarget.style.background = '#0a1628'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = '#040c18'; }}
              >
                <span style={{ marginRight: '8px', opacity: 0.5 }}>◦</span>{topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card animate-fadeInUp" style={{ padding: '28px', animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>[ RECENT SESSIONS ]</div>
          <button onClick={() => navigate('/history')} className="btn-secondary" style={{ padding: '7px 16px', fontSize: '0.6rem' }}>VIEW ALL</button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>Loading sessions...</div>
        ) : recentSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.3 }}>◎</div>
            <div className="orbitron" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>NO SESSIONS YET</div>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'Rajdhani', marginTop: '8px' }}>Start your first interview to see results here</p>
          </div>
        ) : (
          <div>
            {recentSessions.map((s) => {
              const avg = s.totalQuestions > 0 ? (s.totalScore / s.totalQuestions).toFixed(1) : 0;
              const scoreColor = avg >= 7 ? 'var(--accent-neon)' : avg >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)';
              return (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', marginBottom: '8px', background: '#040c18', borderRadius: '6px', border: '1px solid var(--border-dim)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => navigate(`/results/${s.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-glow)'; e.currentTarget.style.background = '#0a1628'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-dim)'; e.currentTarget.style.background = '#040c18'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.status === 'COMPLETED' ? 'var(--accent-neon)' : 'var(--accent-warning)', boxShadow: `0 0 6px ${s.status === 'COMPLETED' ? 'var(--accent-neon)' : 'var(--accent-warning)'}` }} />
                    <div>
                      <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{s.topic}</div>
                      <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)' }}>{new Date(s.createdAt).toLocaleDateString()} • {s.difficulty}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span className="tag tag-topic">{s.topic}</span>
                    <div className="orbitron" style={{ fontSize: '1rem', fontWeight: '800', color: scoreColor }}>{avg}<span style={{ fontSize: '0.6rem', opacity: 0.6 }}>/10</span></div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}