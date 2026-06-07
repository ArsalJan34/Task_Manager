import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Stats from './Stats'
import TaskItem from './TaskItem'

export default function Dashboard({ session }) {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const user = session.user
  const name = user.user_metadata?.full_name || user.email.split('@')[0]
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const firstName = name.split(' ')[0]

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setTasks(data)
    setLoading(false)
  }

  const addTask = async () => {
    const text = newTask.trim()
    if (!text) return
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ text, done: false, user_id: user.id }])
      .select()
    if (!error) {
      setTasks(prev => [data[0], ...prev])
      setNewTask('')
    }
  }

  const toggleTask = async (id, done) => {
    const { error } = await supabase
      .from('tasks')
      .update({ done: !done })
      .eq('id', id)
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !done } : t))
  }

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(prev => prev.filter(t => t.id !== id))
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const filtered = tasks.filter(t => {
    if (filter === 'done') return t.done
    if (filter === 'pending') return !t.done
    return true
  })

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>
          <span style={styles.logoDot} />
          Taskflow
        </div>
        <div style={styles.navRight}>
          <div style={styles.userPill}>
            <div style={styles.avatar}>{initials}</div>
            <span style={styles.userName}>{firstName}</span>
          </div>
          <button style={styles.logoutBtn} onClick={logout}>Sign out</button>
        </div>
      </nav>

      {/* Greeting */}
      <div style={styles.header}>
        <div>
          <p style={styles.headerSub}>Good to see you,</p>
          <p style={styles.greeting}>
            Hey, <span style={{ color: '#4fffb0' }}>{firstName}</span> 👋
          </p>
        </div>
      </div>

      {/* Stats */}
      <Stats tasks={tasks} />

      {/* Task section */}
      <div style={styles.section}>
        {/* Header row */}
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTitle}>My Tasks</p>
          <div style={styles.filterTabs}>
            {['all', 'pending', 'done'].map(f => (
              <button
                key={f}
                style={{
                  ...styles.filterTab,
                  ...(filter === f ? styles.filterTabActive : {}),
                }}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Add task */}
        <div style={styles.addRow}>
          <input
            style={styles.addInput}
            placeholder="Add a new task…"
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
          />
          <button style={styles.btnAdd} onClick={addTask}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
        </div>

        {/* Task list */}
        <div style={styles.list}>
          {loading ? (
            <p style={styles.empty}>Loading...</p>
          ) : filtered.length === 0 ? (
            <p style={styles.empty}>No tasks here yet.</p>
          ) : (
            filtered.map(task => (
              <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
            ))
          )}
        </div>
      </div>

      {/* Supabase badge */}
      <div style={styles.badge}>
        <span style={styles.badgeDot} />
        Connected to Supabase — data synced
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0d0d0f',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 560,
    margin: '0 auto',
  },
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 24px',
    borderBottom: '0.5px solid rgba(255,255,255,0.08)',
    position: 'sticky',
    top: 0,
    background: '#0d0d0f',
    zIndex: 10,
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
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  userPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#161619',
    border: '0.5px solid rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: '5px 12px 5px 5px',
  },
  avatar: {
    width: 26, height: 26,
    borderRadius: '50%',
    background: 'rgba(79,255,176,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: '#4fffb0',
  },
  userName: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
  },
  header: {
    padding: '22px 24px 0',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 3,
  },
  greeting: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  section: {
    flex: 1,
    padding: '18px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
  },
  filterTabs: { display: 'flex', gap: 6 },
  filterTab: {
    background: 'transparent',
    border: '0.5px solid rgba(255,255,255,0.12)',
    color: 'rgba(255,255,255,0.45)',
    borderRadius: 8,
    padding: '5px 13px',
    fontSize: 12,
    transition: 'all 0.15s',
  },
  filterTabActive: {
    background: 'rgba(79,255,176,0.12)',
    borderColor: 'rgba(79,255,176,0.35)',
    color: '#4fffb0',
  },
  addRow: { display: 'flex', gap: 8 },
  addInput: {
    flex: 1,
    background: '#161619',
    border: '0.5px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '10px 14px',
    color: '#e8e6e0',
    fontSize: 14,
    outline: 'none',
  },
  btnAdd: {
    background: '#4fffb0',
    color: '#0d0d0f',
    border: 'none',
    borderRadius: 10,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minHeight: 80,
  },
  empty: {
    textAlign: 'center',
    padding: '32px 0',
    color: 'rgba(255,255,255,0.25)',
    fontSize: 13,
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    padding: '0 24px 20px',
  },
  badgeDot: {
    width: 6, height: 6,
    borderRadius: '50%',
    background: '#3ECF8E',
    animation: 'pulse 2s infinite',
    display: 'inline-block',
  },
}
