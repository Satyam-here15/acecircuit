import React, { useState } from 'react';
import { resumeAPI } from '../services/api';

const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Data Engineer', 'ML Engineer'];

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);

  const handleAnalyze = async () => {
    if (!file || !targetRole) { setError('Please select a PDF and target role'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await resumeAPI.analyze(file, targetRole);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || 'Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith('.pdf')) setFile(dropped);
    else setError('Only PDF files are supported');
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--accent-neon)';
    if (score >= 50) return 'var(--accent-cyan)';
    return 'var(--accent-warning)';
  };

  const getRecommendationColor = (rec) => {
    if (rec === 'Strong Yes') return 'var(--accent-neon)';
    if (rec === 'Yes') return 'var(--accent-cyan)';
    if (rec === 'Maybe') return 'var(--accent-electric)';
    return 'var(--accent-warning)';
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'fadeInUp 0.5s ease' }}>
        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>// AI POWERED</div>
        <h1 className="orbitron" style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '6px' }}>RESUME ANALYZER</h1>
        <p style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani', fontSize: '1rem' }}>Upload your resume and get instant AI feedback, ATS score, and improvement tips</p>
      </div>

      {/* Upload Card */}
      <div className="card animate-fadeInUp" style={{ padding: '28px', marginBottom: '20px', opacity: 0, animationFillMode: 'forwards' }}>
        <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '20px' }}>[ UPLOAD RESUME ]</div>

        {/* Drop Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('resumeInput').click()}
          style={{
            border: `2px dashed ${drag ? 'var(--accent-cyan)' : file ? 'var(--accent-neon)' : 'var(--border-dim)'}`,
            borderRadius: '10px', padding: '40px', textAlign: 'center', cursor: 'pointer',
            background: drag ? '#00d4ff08' : file ? '#00ff8808' : 'transparent',
            transition: 'all 0.3s', marginBottom: '20px'
          }}
        >
          <input id="resumeInput" type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={e => { setFile(e.target.files[0]); setError(''); }} />
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{file ? '✅' : '📄'}</div>
          {file ? (
            <>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: '700', color: 'var(--accent-neon)', fontSize: '1rem' }}>{file.name}</div>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {(file.size / 1024).toFixed(1)} KB • Click to change
              </div>
            </>
          ) : (
            <>
              <div style={{ fontFamily: 'Rajdhani', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '1rem' }}>Drop your PDF here or click to browse</div>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '6px' }}>PDF files only • Max 10MB</div>
            </>
          )}
        </div>

        {/* Role Select */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontFamily: 'JetBrains Mono', fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.1em' }}>TARGET ROLE</label>
          <select className="input-field" value={targetRole} onChange={e => setTargetRole(e.target.value)} style={{ cursor: 'pointer' }}>
            <option value="" style={{ background: '#060d14' }}>Select your target role...</option>
            {roles.map(r => <option key={r} value={r} style={{ background: '#060d14' }}>{r}</option>)}
          </select>
        </div>

        {error && (
          <div style={{ background: '#ff6b3510', border: '1px solid #ff6b3530', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', color: 'var(--accent-warning)', fontFamily: 'Rajdhani', fontSize: '0.88rem' }}>
            ⚠ {error}
          </div>
        )}

        <button className="btn-primary" style={{ width: '100%', padding: '14px' }} onClick={handleAnalyze} disabled={loading || !file || !targetRole}>
          {loading ? '[ ANALYZING RESUME... ]' : '[ ANALYZE WITH AI ]'}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card" style={{ padding: '40px', textAlign: 'center', animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px', animation: 'float 1.5s ease-in-out infinite' }}>🤖</div>
          <div className="orbitron" style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '8px' }}>AI IS ANALYZING YOUR RESUME</div>
          <div className="mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Checking skills, experience, ATS compatibility...</div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ animation: 'fadeInUp 0.5s ease' }}>
          {/* Score Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'OVERALL SCORE', value: `${result.overall_score}`, unit: '/100', color: getScoreColor(result.overall_score) },
              { label: 'ATS SCORE', value: `${result.ats_score}`, unit: '/100', color: getScoreColor(result.ats_score) },
              { label: 'HIRE RECOMMENDATION', value: result.hire_recommendation, unit: '', color: getRecommendationColor(result.hire_recommendation) },
            ].map((s, i) => (
              <div key={i} className="card" style={{ padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: s.color }} />
                <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '10px' }}>{s.label}</div>
                <div className="orbitron" style={{ fontSize: '1.6rem', fontWeight: '900', color: s.color }}>{s.value}<span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{s.unit}</span></div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '12px' }}>[ AI SUMMARY ]</div>
            <p style={{ fontFamily: 'Rajdhani', fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.summary}</p>
          </div>

          {/* Strengths & Weaknesses */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-neon)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ STRENGTHS ]</div>
              {(result.strengths || []).map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-neon)', flexShrink: 0, marginTop: '2px' }}>✓</span>
                  <span style={{ fontFamily: 'Rajdhani', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{s}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-warning)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ WEAKNESSES ]</div>
              {(result.weaknesses || []).map((w, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent-warning)', flexShrink: 0, marginTop: '2px' }}>⚠</span>
                  <span style={{ fontFamily: 'Rajdhani', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-electric)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ MISSING SKILLS TO ADD ]</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(result.missing_skills || []).map((skill, i) => (
                <span key={i} style={{ padding: '6px 14px', background: '#0066ff10', border: '1px solid #0066ff30', borderRadius: '20px', fontFamily: 'Rajdhani', fontSize: '0.88rem', color: 'var(--accent-electric)', fontWeight: '600' }}>
                  + {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="card" style={{ padding: '24px' }}>
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: '16px' }}>[ IMPROVEMENT TIPS ]</div>
            {(result.improvements || []).map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', padding: '12px', background: '#040c18', borderRadius: '6px', border: '1px solid var(--border-dim)', alignItems: 'flex-start' }}>
                <span className="orbitron" style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem', flexShrink: 0, marginTop: '2px' }}>0{i + 1}</span>
                <span style={{ fontFamily: 'Rajdhani', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}