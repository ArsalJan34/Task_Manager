import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setError('')
    setMessage('')
    setLoading(true)

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      if (!name.trim()) { setError('Please enter your name'); setLoading(false); return }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) setError(error.message)
      else setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoDot} />
          Taskflow
        </div>
        <div style={styles.navActions}>
          <button style={styles.btnLogin} onClick={() => { setIsLogin(true); setError('') }}>Login</button>
          <button style={styles.btnSignup} onClick={() => { setIsLogin(false); setError('') }}>Sign up</button>
        </div>
      </nav>

      {/* Card */}
      <div style={styles.center}>
        <div style={styles.card}>
          <p style={styles.cardTitle}>{isLogin ? 'Welcome back.' : 'Create account.'}</p>
          <p style={styles.cardSub}>{isLogin ? 'Sign in to your workspace' : 'Start organizing your work'}</p>

          {error && <div style={styles.errorBox}>{error}</div>}
          {message && <div style={styles.successBox}>{message}</div>}

          {!isLogin && (
            <div style={styles.field}>
              <label style={styles.label}>Full name</label>
              <input
                style={styles.input}
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email address</label>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>

          <button style={styles.btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Please wait...' : isLogin ? 'Sign in' : 'Get started'}
          </button>

          <p style={styles.switchText}>
            {isLogin ? "No account? " : "Already have one? "}
            <span style={styles.switchLink} onClick={() => { setIsLogin(!isLogin); setError('') }}>
              {isLogin ? 'Create one' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0d0d0f',
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    background: '#0d0d0f',
  },
  logo: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: -0.5,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#4fffb0',
    display: 'inline-block',
  },
  navActions: { display: 'flex', gap: 10, alignItems: 'center' },
  btnLogin: {
    background: 'transparent',
    border: '0.5px solid rgba(255,255,255,0.2)',
    color: '#e8e6e0',
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 13,
  },
  btnSignup: {
    background: '#fff',
    border: 'none',
    color: '#0d0d0f',
    padding: '7px 16px',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 500,
  },
  center: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    background: '#161619',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: '32px 28px',
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 6,
  },
  cardSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 28,
  },
  errorBox: {
    background: 'rgba(226,75,74,0.12)',
    border: '0.5px solid rgba(226,75,74,0.3)',
    color: '#f09595',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 13,
    marginBottom: 16,
  },
  successBox: {
    background: 'rgba(79,255,176,0.1)',
    border: '0.5px solid rgba(79,255,176,0.3)',
    color: '#4fffb0',
    borderRadius: 8,
    padding: '10px 13px',
    fontSize: 13,
    marginBottom: 16,
  },
  field: { marginBottom: 16 },
  label: {
    display: 'block',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    width: '100%',
    background: '#0d0d0f',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: 8,
    padding: '10px 13px',
    color: '#e8e6e0',
    fontSize: 14,
    outline: 'none',
  },
  btnPrimary: {
    width: '100%',
    background: '#fff',
    color: '#0d0d0f',
    border: 'none',
    borderRadius: 8,
    padding: 11,
    fontSize: 14,
    fontWeight: 500,
    marginTop: 8,
  },
  switchText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  switchLink: {
    color: '#4fffb0',
    cursor: 'pointer',
  },
}
