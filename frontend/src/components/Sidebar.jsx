const agents = [
  { name: 'Vision Agent', icon: 'visibility', desc: 'Qwen2.5-VL image analysis' },
  { name: 'RAG Agent', icon: 'database', desc: 'PubMed literature retrieval' },
  { name: 'Report Agent', icon: 'description', desc: 'Llama 3.1 report generation' },
  { name: 'QA Agent', icon: 'fact_check', desc: 'Grounded follow-up chat' },
]

const supported = ['Chest X-rays', 'Brain MRI', 'Bone X-rays', 'Skin lesions', 'Retinal scans']

export default function Sidebar({ activeAgent, setActiveAgent, onReset }) {
  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0,
      height: '100%', width: '256px', zIndex: 40,
      backgroundColor: '#0d1117',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      padding: '80px 12px 24px',
      overflowY: 'auto', scrollbarWidth: 'none',
    }}>

      {/* Title */}
      <div style={{ marginBottom: '32px', padding: '0 4px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#e2e8f0', marginBottom: '4px' }}>
          Clinical Agent Pipeline
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px rgba(16,185,129,0.5)',
            display: 'inline-block'
          }}></span>
          <p style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
            Active Session
          </p>
        </div>
      </div>

      {/* New Diagnostic Button */}
      <button
        onClick={onReset}
        style={{
          marginBottom: '24px', width: '100%',
          padding: '12px 16px',
          background: 'linear-gradient(135deg, #c1c7ce, #41474d)',
          color: '#3b4147', fontWeight: 700,
          borderRadius: '8px', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          cursor: 'pointer', fontSize: '14px',
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
        New Diagnostic
      </button>

      {/* Agent Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
        {agents.map((agent) => (
          <div
            key={agent.name}
            onClick={() => setActiveAgent(agent.name)}
            onMouseEnter={e => {
              if (activeAgent !== agent.name) {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              }
            }}
            onMouseLeave={e => {
              if (activeAgent !== agent.name) {
                e.currentTarget.style.backgroundColor = '#0d1421'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
              }
            }}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: activeAgent === agent.name
                ? '1px solid rgba(124,97,255,0.6)'
                : '1px solid rgba(255,255,255,0.06)',
              backgroundColor: activeAgent === agent.name
                ? 'rgba(124,97,255,0.08)'
                : '#0d1421',
              cursor: 'pointer',
              transition: 'all 0.2s',
              borderLeft: activeAgent === agent.name
                ? '3px solid #7b61ff'
                : '3px solid transparent',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: activeAgent === agent.name ? '#a78bfa' : '#9f9d9d' }}>
                {agent.icon}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: activeAgent === agent.name ? '#e2e8f0' : '#cbd5e1' }}>
                {agent.name}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#6b7280', marginLeft: '24px', marginBottom: 0 }}>
              {agent.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }}></div>

      {/* Supported Images */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '12px', padding: '0 4px' }}>
          📋 Supported Images
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {supported.map(item => (
            <li key={item} style={{ fontSize: '12px', color: '#6b7280', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#4b5563', display: 'inline-block' }}></span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: '20px' }}></div>

      {/* Runtime Status */}
      <div style={{ padding: '0 4px' }}>
        <h3 style={{ fontSize: '12px', fontWeight: 600, color: '#9ca3af', marginBottom: '12px' }}>
          ⚙️ Runtime
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[['ROCm', 'enabled'], ['vLLM', 'serving'], ['FAISS', 'index loaded']].map(([label, status]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{label}</span>
              <span style={{ color: '#6b7280' }}>{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom links */}
      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[['menu_book', 'Docs'], ['logout', 'Logout']].map(([icon, label]) => (
          <div
            key={label}
            onMouseEnter={e => e.currentTarget.style.color = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', cursor: 'pointer', borderRadius: '8px',
              color: '#6b7280', fontSize: '13px', transition: 'color 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </aside>
  )
}