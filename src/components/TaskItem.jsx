export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      style={{
        ...styles.item,
        opacity: task.done ? 0.5 : 1,
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
    >
      {/* Checkbox */}
      <div
        style={{
          ...styles.check,
          background: task.done ? '#4fffb0' : 'transparent',
          borderColor: task.done ? '#4fffb0' : 'rgba(255,255,255,0.2)',
        }}
        onClick={() => onToggle(task.id, task.done)}
      >
        {task.done && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#0d0d0f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      {/* Text */}
      <span style={{
        ...styles.text,
        textDecoration: task.done ? 'line-through' : 'none',
        color: task.done ? 'rgba(255,255,255,0.3)' : '#e8e6e0',
      }}>
        {task.text}
      </span>

      {/* Delete */}
      <button
        style={styles.deleteBtn}
        onClick={() => onDelete(task.id)}
        onMouseEnter={e => { e.currentTarget.style.color = '#f09595'; e.currentTarget.style.background = 'rgba(226,75,74,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'transparent' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>
  )
}

const styles = {
  item: {
    background: '#161619',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '13px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    transition: 'border-color 0.2s',
    animation: 'fadeIn 0.25s ease',
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    border: '1.5px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  text: {
    flex: 1,
    fontSize: 14,
    transition: 'color 0.2s',
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.2)',
    cursor: 'pointer',
    padding: '2px 4px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s, background 0.2s',
  },
}
