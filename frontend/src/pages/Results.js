import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

export default function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    interviewAPI.getSessionDetails(sessionId).then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, [sessionId]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}><div className="orbitron" style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', letterSpacing: '0.1em', animation: 'blink 1s infinite' }}>LOADING RESULTS...</div></div>;
  if (!data) return <div style={{ color: 'var(--accent-warning)', fontFamily: 'Rajdhani', padding: '20px' }}>Failed to load results.</div>;

  const { session, questions } = data;
  const avg = session.totalQuestions > 0 ? (session.totalScore / session.totalQuestions).toFixed(1) : 0;
  const scoreColor = avg >= 7 ? 'var(--accent-neon)' : avg >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)';

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// SESSION RESULTS</div>
        <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)' }}>INTERVIEW REPORT</h1>
      </div>

      {/* Score Card */}
      <div className="card animate-fadeInUp" style={{ padding: '32px', marginBottom: '24px', textAlign: 'center', opacity: 0, animationFillMode: 'forwards', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, transparent, ${scoreColor}, transparent)` }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '24px' }}>
          <div>
            <div className="orbitron" style={{ fontSize: '3.5rem', fontWeight: '900', color: scoreColor, lineHeight: 1 }}>{avg}</div>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>AVG SCORE /10</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-dim)' }} />
          <div>
            <div className="orbitron" style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--accent-electric)', lineHeight: 1 }}>{session.pointsEarned || 0}</div>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>POINTS EARNED</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-dim)' }} />
          <div>
            <div className="orbitron" style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--accent-purple)', lineHeight: 1 }}>{session.totalQuestions}</div>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>QUESTIONS</div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <span className="tag tag-topic">{session.topic}</span>
          <span className={`tag ${session.difficulty === 'Easy' ? 'tag-easy' : session.difficulty === 'Medium' ? 'tag-medium' : 'tag-hard'}`}>{session.difficulty}</span>
        </div>
        {session.feedback && (
          <div style={{ background: '#0a1628', border: '1px solid var(--border-dim)', borderRadius: '8px', padding: '16px 20px', textAlign: 'left' }}>
            <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '8px' }}>[ AI OVERALL FEEDBACK ]</div>
            <p style={{ fontFamily: 'Rajdhani', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{session.feedback}</p>
          </div>
        )}
      </div>

      {/* Questions Breakdown */}
      <div className="card animate-fadeInUp" style={{ padding: '28px', opacity: 0, animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ QUESTION BREAKDOWN ]</div>
        {questions?.map((q, i) => {
          const qColor = q.score >= 7 ? 'var(--accent-neon)' : q.score >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)';
          return (
            <div key={i} style={{ marginBottom: '16px', padding: '18px', background: '#040c18', borderRadius: '8px', border: '1px solid var(--border-dim)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Q{q.questionNumber}</div>
                <div className="orbitron" style={{ fontSize: '1.1rem', fontWeight: '800', color: qColor }}>{q.score}<span style={{ fontSize: '0.6rem', opacity: 0.6 }}>/10</span></div>
              </div>
              <p style={{ fontFamily: 'Rajdhani', fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.5 }}>{q.questionText}</p>
              <p style={{ fontFamily: 'Rajdhani', fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}><span style={{ color: 'var(--text-muted)' }}>Your answer: </span>{q.userAnswer}</p>
              <div style={{ background: '#060d14', borderRadius: '4px', padding: '10px 14px', borderLeft: `3px solid ${qColor}` }}>
                <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: '4px', letterSpacing: '0.08em' }}>AI FEEDBACK</div>
                <p style={{ fontFamily: 'Rajdhani', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{q.aiFeedback}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button className="btn-primary" onClick={() => navigate('/interview')} style={{ flex: 1, padding: '14px' }}>[ NEW INTERVIEW ]</button>
        <button className="btn-secondary" onClick={() => navigate('/dashboard')} style={{ flex: 1 }}>[ DASHBOARD ]</button>
      </div>
    </div>
  );
}