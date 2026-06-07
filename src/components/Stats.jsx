export default function Stats({ tasks }) {
  const total = tasks.length
  const done = tasks.filter(t => t.done).length
  const pending = total - done
  const percent = total ? Math.round((done / total) * 100) : 0

  return (
    <div style={styles.grid}>
      <div style={styles.card}>
        <p style={styles.label}>Total</p>
        <p style={styles.val}>{total}</p>
        <div style={styles.barWrap}>
          <div style={{ ...styles.barFill, width: `${percent}%` }} />
        </div>
      </div>
      <div style={styles.card}>
        <p style={styles.label}>Completed</p>
        <p style={{ ...styles.val, color: '#4fffb0' }}>{done}</p>
      </div>
      <div style={styles.card}>
        <p style={styles.label}>Pending</p>
        <p style={{ ...styles.val, color: '#EF9F27' }}>{pending}</p>
      </div>
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
    padding: '18px 24px 0',
  },
  card: {
    background: '#161619',
    border: '0.5px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '14px 16px',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  val: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 22,
    fontWeight: 700,
    color: '#fff',
  },
  barWrap: {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 4,
    height: 4,
    overflow: 'hidden',
    marginTop: 6,
  },
  barFill: {
    height: '100%',
    background: '#4fffb0',
    borderRadius: 4,
    transition: 'width 0.4s ease',
  },
}
