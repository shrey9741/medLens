export default function TopBar() {
  return (
    <header style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 50,
      backgroundColor: '#0c0e10',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 24px', height: '64px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.05em', color: '#e2e8f0' }}>
          MedLens Clinical
        </span>
        <div style={{
          display: 'flex', alignItems: 'center',
          backgroundColor: 'rgba(32,38,44,0.5)',
          padding: '6px 12px', borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#9f9d9d', marginRight: '8px' }}>search</span>
          <input
            style={{
              backgroundColor: 'transparent', border: 'none', outline: 'none',
              fontSize: '14px', color: '#a6acb2', width: '192px',
            }}
            placeholder="Patient ID or Study..."
            type="text"
          />
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {['memory', 'terminal', 'settings'].map(icon => (
            <span key={icon} className="material-symbols-outlined" style={{ fontSize: '20px', color: '#929090', cursor: 'pointer' }}>{icon}</span>
          ))}
        </div>
        <div style={{
          height: '32px', width: '32px', borderRadius: '50%',
          backgroundColor: '#1b2025', border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1' }}>SK</span>
        </div>
      </div>
    </header>
  )
}