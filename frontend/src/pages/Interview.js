import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';

const topics = ['DSA', 'System Design', 'Java', 'Spring Boot', 'SQL', 'Operating System', 'DBMS', 'Computer Networks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function Interview() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup'); // setup | active | submitting
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const startSession = async () => {
    if (!topic || !difficulty) { setError('Please select topic and difficulty'); return; }
    setLoading(true); setError('');
    try {
      const res = await interviewAPI.startSession({ topic, difficulty });
      setSession(res.data);
      setCurrentQuestion(res.data.question);
      setQuestionNumber(1);
      setPhase('active');
    } catch { setError('Failed to start session. Is backend running?'); }
    finally { setLoading(false); }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) { setError('Please write an answer'); return; }
    setLoading(true); setError(''); setPhase('submitting');
    try {
      const res = await interviewAPI.submitAnswer({
        sessionId: session.sessionId,
        answer, question: currentQuestion, questionNumber,
      });
      setFeedback(res.data);
      setShowFeedback(true);
      if (res.data.isComplete) {
        setTimeout(() => navigate(`/results/${session.sessionId}`), 3000);
      }
    } catch { setError('Failed to submit. Try again.'); setPhase('active'); }
    finally { setLoading(false); }
  };

  const nextQuestion = () => {
    setCurrentQuestion(feedback.nextQuestion);
    setQuestionNumber(feedback.nextQuestionNumber);
    setAnswer(''); setFeedback(null); setShowFeedback(false);
    setPhase('active');
  };

  const progress = ((questionNumber - 1) / 5) * 100;

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// INTERVIEW ENGINE</div>
        <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>MOCK INTERVIEW</h1>
      </div>

      {/* SETUP PHASE */}
      {phase === 'setup' && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div className="card" style={{ padding: '32px', marginBottom: '20px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ SELECT TOPIC ]</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '28px' }}>
              {topics.map(t => (
                <button key={t} onClick={() => setTopic(t)}
                  style={{ padding: '14px 10px', borderRadius: '6px', border: `1px solid ${topic === t ? 'var(--accent-cyan)' : 'var(--border-dim)'}`, background: topic === t ? '#00d4ff10' : '#040c18', color: topic === t ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontFamily: 'Rajdhani', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: topic === t ? '0 0 15px #00d4ff20' : 'none' }}>
                  {t}
                </button>
              ))}
            </div>

            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ SELECT DIFFICULTY ]</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {difficulties.map(d => {
                const colors = { Easy: 'var(--accent-neon)', Medium: 'var(--accent-cyan)', Hard: 'var(--accent-warning)' };
                const c = colors[d];
                return (
                  <button key={d} onClick={() => setDifficulty(d)}
                    style={{ padding: '16px', borderRadius: '6px', border: `1px solid ${difficulty === d ? c : 'var(--border-dim)'}`, background: difficulty === d ? `${c}10` : '#040c18', color: difficulty === d ? c : 'var(--text-secondary)', fontFamily: 'Orbitron', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: difficulty === d ? `0 0 15px ${c}20` : 'none' }}>
                    {d.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div style={{ background: '#ff6b3510', border: '1px solid #ff6b3530', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.9rem' }}>⚠ {error}</div>}

          <button className="btn-primary" onClick={startSession} disabled={loading} style={{ width: '100%', padding: '16px', fontSize: '0.85rem' }}>
            {loading ? '[ CONNECTING TO AI... ]' : '[ LAUNCH INTERVIEW SESSION ]'}
          </button>
        </div>
      )}

      {/* ACTIVE PHASE */}
      {(phase === 'active' || phase === 'submitting') && !showFeedback && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          {/* Progress */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>QUESTION {questionNumber} OF 5</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span className="tag tag-topic">{session?.topic}</span>
                <span className={`tag ${difficulty === 'Easy' ? 'tag-easy' : difficulty === 'Medium' ? 'tag-medium' : 'tag-hard'}`}>{difficulty}</span>
              </div>
            </div>
            <div style={{ height: '4px', background: 'var(--border-dim)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent-electric), var(--accent-cyan))', borderRadius: '2px', transition: 'width 0.5s ease', boxShadow: '0 0 10px #00d4ff40' }} />
            </div>
          </div>

          {/* Question */}
          <div className="card" style={{ padding: '28px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-electric), transparent)' }} />
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-electric)', letterSpacing: '0.1em', marginBottom: '14px' }}>[ AI INTERVIEWER ]</div>
            <p style={{ fontFamily: 'Rajdhani', fontSize: '1.15rem', fontWeight: '500', color: 'var(--text-primary)', lineHeight: 1.7 }}>{currentQuestion}</p>
          </div>

          {/* Answer */}
          <div className="card" style={{ padding: '28px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '14px' }}>[ YOUR ANSWER ]</div>
            <textarea
              className="input-field"
              rows={7}
              placeholder="Type your answer here... Be detailed and specific."
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              style={{ resize: 'vertical', lineHeight: 1.6, fontSize: '0.95rem' }}
            />
            {error && <div style={{ color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.85rem', marginTop: '10px' }}>⚠ {error}</div>}
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button className="btn-primary" onClick={submitAnswer} disabled={loading} style={{ flex: 1, padding: '14px' }}>
                {loading ? '[ AI EVALUATING... ]' : '[ SUBMIT ANSWER ]'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK PHASE */}
      {showFeedback && feedback && (
        <div className="animate-fadeInUp" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          {/* Score */}
          <div className="card" style={{ padding: '28px', marginBottom: '20px', textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ AI EVALUATION RESULT ]</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100px', height: '100px', borderRadius: '50%', border: `3px solid ${feedback.score >= 7 ? 'var(--accent-neon)' : feedback.score >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)'}`, boxShadow: `0 0 30px ${feedback.score >= 7 ? '#00ff8840' : feedback.score >= 5 ? '#00d4ff40' : '#ff6b3540'}`, marginBottom: '20px', flexDirection: 'column' }}>
              <div className="orbitron" style={{ fontSize: '2rem', fontWeight: '900', color: feedback.score >= 7 ? 'var(--accent-neon)' : feedback.score >= 5 ? 'var(--accent-cyan)' : 'var(--accent-warning)' }}>{feedback.score}</div>
              <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>/10</div>
            </div>
            <div style={{ fontFamily: 'Rajdhani', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '600px', margin: '0 auto 16px' }}>{feedback.feedback}</div>
            {feedback.correctAnswer && (
              <div style={{ background: '#00ff8808', border: '1px solid #00ff8820', borderRadius: '6px', padding: '14px 18px', textAlign: 'left' }}>
                <div className="mono" style={{ fontSize: '0.58rem', color: 'var(--accent-neon)', letterSpacing: '0.1em', marginBottom: '8px' }}>[ IDEAL ANSWER ]</div>
                <div style={{ fontFamily: 'Rajdhani', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{feedback.correctAnswer}</div>
              </div>
            )}
          </div>

          {feedback.isComplete ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div className="orbitron" style={{ fontSize: '1rem', color: 'var(--accent-neon)', letterSpacing: '0.1em', marginBottom: '8px' }}>SESSION COMPLETE!</div>
              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Redirecting to results...</div>
            </div>
          ) : (
            <button className="btn-primary" onClick={nextQuestion} style={{ width: '100%', padding: '14px' }}>
              [ NEXT QUESTION → ]
            </button>
          )}
        </div>
      )}
    </div>
  );
}