import { useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'

export default function ReportPanel({ analysisState, setAnalysisState }) {
  const [question, setQuestion] = useState('')
  const [qaLoading, setQaLoading] = useState(false)
  const { findings, report, chatHistory, analyzed, loading } = analysisState

  const handleSend = async () => {
    if (!question.trim() || !analyzed) return
    const q = question
    setQuestion('')
    setQaLoading(true)
    const updatedHistory = [...chatHistory, { role: 'user', content: q }]
    setAnalysisState(s => ({ ...s, chatHistory: updatedHistory }))
    try {
      const res = await axios.post('/api/chat', {
        question: q, findings, report,
        chat_history: updatedHistory,
      })
      setAnalysisState(s => ({
        ...s,
        chatHistory: [...updatedHistory, { role: 'assistant', content: res.data.answer }],
      }))
    } catch (err) {
      console.error(err)
    } finally {
      setQaLoading(false)
    }
  }

  return (
    <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Diagnostic Report Card */}
      <div style={{
        flex: 1, backgroundColor: '#161a1e',
        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        minHeight: '500px',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: 'rgba(27,32,37,0.3)'
        }}>
          <h3 style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#9ca3af' }}>
            Diagnostic Report
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 700, padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: analyzed ? 'rgba(52,211,153,0.1)' : 'rgba(159,157,157,0.1)',
              color: analyzed ? '#34d399' : '#9f9d9d'
            }}>
              {analyzed ? 'COMPLETE' : 'AWAITING'}
            </span>
            <span className="material-symbols-outlined" style={{ color: '#4b5563', fontSize: '16px' }}>more_vert</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', scrollbarWidth: 'none' }}>
          {/* Awaiting state with skeleton */}
          {!loading && !analyzed && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(159,157,157,0.4)', marginBottom: '24px' }}
                className="animate-pulse">
                <span className="material-symbols-outlined">hourglass_empty</span>
                <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '-0.01em' }}>Awaiting Analysis...</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ height: '12px', width: '33%', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '100%', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '83%', borderRadius: '4px' }}></div>
                </div>
                <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ height: '12px', width: '25%', borderRadius: '4px' }}></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '48px', borderRadius: '8px' }}></div>
                    <div className="skeleton" style={{ height: '48px', borderRadius: '8px' }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div className="skeleton" style={{ height: '12px', width: '50%', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '100%', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '80%', borderRadius: '4px' }}></div>
                  <div className="skeleton" style={{ height: '16px', width: '75%', borderRadius: '4px' }}></div>
                </div>
              </div>
            </>
          )}

          {/* Loading state */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(159,157,157,0.4)' }}
              className="animate-pulse">
              <span className="material-symbols-outlined">hourglass_empty</span>
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Running pipeline...</span>
            </div>
          )}

          {/* Report content */}
          {analyzed && (
            <div>
              <div style={{ fontSize: '13px', color: '#a6acb2', lineHeight: 1.7 }}>
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>

              {/* Chat history */}
              {chatHistory.length > 0 && (
                <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{
                      fontSize: '12px', borderRadius: '8px', padding: '12px',
                      backgroundColor: msg.role === 'user' ? '#20262c' : '#111416',
                      color: msg.role === 'user' ? '#cbd5e1' : '#a6acb2',
                      marginLeft: msg.role === 'user' ? '16px' : '0',
                      marginRight: msg.role === 'assistant' ? '16px' : '0',
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, display: 'block', marginBottom: '4px' }}>
                        {msg.role === 'user' ? 'You' : 'MedLens'}
                      </span>
                      {msg.content}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* QA Input */}
        <div style={{ padding: '16px', backgroundColor: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#9f9d9d' }}>robot_2</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>QA Assistant</span>
          </div>
          <div style={{ position: 'relative' }}>
            <textarea
              rows={2}
              value={question}
              disabled={!analyzed}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder={analyzed ? 'Ask about the clinical findings...' : 'Upload and analyze an image first...'}
              style={{
                width: '100%', backgroundColor: '#20262c',
                border: 'none', borderRadius: '8px',
                fontSize: '14px', color: '#e0e6ed',
                padding: '12px 48px 12px 16px',
                resize: 'none', outline: 'none',
                opacity: !analyzed ? 0.5 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!analyzed || !question.trim() || qaLoading}
              style={{
                position: 'absolute', bottom: '8px', right: '8px',
                padding: '6px', backgroundColor: 'rgba(159,157,157,0.1)',
                color: '#9f9d9d', borderRadius: '6px', border: 'none',
                cursor: !analyzed || !question.trim() ? 'not-allowed' : 'pointer',
                opacity: !analyzed || !question.trim() ? 0.3 : 1,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resource Stats Card */}
      <div style={{
        backgroundColor: '#111416', padding: '20px',
        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Resource Allocation</span>
          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: '#10b981' }}>92% EFFICIENCY</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#a6acb2' }}>VRAM Usage</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e0e6ed' }}>142GB / 192GB</span>
          </div>
          <div style={{ height: '4px', width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '74%', backgroundColor: 'rgba(159,157,157,0.6)' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#a6acb2' }}>Latent Ops</span>
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#e0e6ed' }}>4.2ms avg</span>
          </div>
        </div>
      </div>
    </div>
  )
}