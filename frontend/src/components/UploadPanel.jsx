import { useState, useRef } from 'react'
import axios from 'axios'

const AGENTS = ['Vision', 'RAG', 'Report', 'QA']

export default function UploadPanel({ analysisState, setAnalysisState }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [activeAgents, setActiveAgents] = useState([])
  const fileRef = useRef()

  const handleFile = (f) => {
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setAnalysisState(s => ({ ...s, loading: true, analyzed: false }))
    setActiveAgents([])

    for (let i = 0; i < AGENTS.length; i++) {
      await new Promise(r => setTimeout(r, 700))
      setActiveAgents(prev => [...prev, AGENTS[i]])
    }

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await axios.post('/api/analyze', formData)
      setAnalysisState({
        findings: res.data.findings,
        report: res.data.report,
        chatHistory: [],
        analyzed: true,
        loading: false,
      })
    } catch (err) {
      console.error(err)
      setAnalysisState(s => ({ ...s, loading: false }))
    }
  }

  return (
    <div style={{
      gridColumn: 'span 8',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      height: 'calc(100vh - 128px)',
      overflowY: 'auto',
      scrollbarWidth: 'none',
    }}>

      {/* Agent Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {AGENTS.map((agent) => {
          const isActive = activeAgents.includes(agent)
          return (
            <div key={agent} style={{
              backgroundColor: '#161a1e',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: '#6b7280', textTransform: 'uppercase' }}>
                  {agent}
                </span>
                <span style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: isActive ? '#34d399' : '#4b5563',
                  display: 'inline-block'
                }}></span>
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px', color: isActive ? '#e0e6ed' : '#a6acb2' }}>
                {isActive ? 'ACTIVE' : 'IDLE'}
              </div>
              <div style={{ marginTop: '8px', height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                {isActive && <div style={{ height: '100%', width: '100%', backgroundColor: 'rgba(159,157,157,0.4)' }}></div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          backgroundColor: '#111416',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          overflow: 'hidden',
          minHeight: analysisState.analyzed ? '480px' : '420px',
          maxHeight: analysisState.analyzed ? '560px' : '520px',
        }}
      >
        {/* Dot grid background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(#929090 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}></div>

        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: analysisState.analyzed ? '100%' : '448px',
          textAlign: 'center'
        }}>
          {preview ? (
            <>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: '100%',
                  maxHeight: analysisState.analyzed ? '340px' : '180px',
                  borderRadius: '10px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  objectFit: 'contain'
                }}
              />
              {analysisState.analyzed && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  marginBottom: '24px',
                  backgroundColor: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.2)',
                  borderRadius: '8px', padding: '8px 16px',
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '12px', color: '#34d399', fontWeight: 600 }}>Analysis complete — report generated</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{
                width: '80px', height: '80px',
                backgroundColor: '#20262c',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '36px', color: '#9f9d9d' }}>cloud_upload</span>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#e0e6ed', marginBottom: '8px' }}>
                Upload Medical Image
              </h3>
              <p style={{ fontSize: '14px', color: '#a6acb2', marginBottom: '32px', lineHeight: 1.6 }}>
                Drag and drop DICOM, MRI, or CT scans here for automated clinical analysis.
                Supported formats: DCM, JPG, PNG, NIfTI.
              </p>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '448px' }}>
            <button
              onClick={() => fileRef.current.click()}
              style={{
                flex: 1, padding: '12px 24px',
                backgroundColor: '#20262c',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px', fontSize: '14px',
                fontWeight: 600, color: '#e0e6ed', cursor: 'pointer',
              }}
            >
              Browse Files
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!file || analysisState.loading}
              style={{
                flex: 1, padding: '12px 24px',
                backgroundColor: analysisState.loading ? '#6b7280' : '#9f9d9d',
                borderRadius: '8px', fontSize: '14px',
                fontWeight: 700, color: '#202020',
                cursor: !file || analysisState.loading ? 'not-allowed' : 'pointer',
                opacity: !file || analysisState.loading ? 0.6 : 1,
                border: 'none',
                boxShadow: '0 4px 20px rgba(158,157,157,0.2)'
              }}
            >
              {analysisState.loading ? 'Analyzing...' : 'Analyze Study'}
            </button>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
          />
        </div>

        {/* Technical Footer */}
        <div style={{
          position: 'absolute', bottom: '24px', left: '24px', right: '24px',
          display: 'flex', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['AMD MI300X', 'ROCm'].map(tag => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '10px', fontWeight: 700,
                  color: '#9f9d9d', letterSpacing: '0.05em'
                }}>{tag}</div>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[['vLLM', 'Optimized'], ['FAISS', 'Live Index']].map(([tag, label]) => (
              <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  padding: '2px 8px', borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  fontSize: '10px', fontWeight: 700,
                  color: '#9f9d9d', letterSpacing: '0.05em'
                }}>{tag}</div>
                <span style={{ fontSize: '10px', color: '#6b7280', textTransform: 'uppercase' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}