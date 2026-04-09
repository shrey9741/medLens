import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import UploadPanel from './components/UploadPanel'
import ReportPanel from './components/ReportPanel'

export default function App() {
  const [activeAgent, setActiveAgent] = useState('Vision Agent')
  const [analysisState, setAnalysisState] = useState({
    findings: '',
    report: '',
    chatHistory: [],
    analyzed: false,
    loading: false,
  })

  const handleReset = () => {
    setAnalysisState({
      findings: '',
      report: '',
      chatHistory: [],
      analyzed: false,
      loading: false,
    })
  }

  return (
    <div className="dark min-h-screen" style={{ backgroundColor: '#0c0e10', color: '#e0e6ed' }}>
      <TopBar />
      <Sidebar
        activeAgent={activeAgent}
        setActiveAgent={setActiveAgent}
        onReset={handleReset}
      />
      <main style={{
        marginLeft: '256px',
        marginTop: '64px',
        padding: '32px',
        minHeight: 'calc(100vh - 64px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '32px',
        alignItems: 'start',
      }}>
        <UploadPanel
          analysisState={analysisState}
          setAnalysisState={setAnalysisState}
        />
        <ReportPanel
          analysisState={analysisState}
          setAnalysisState={setAnalysisState}
        />
      </main>
    </div>
  )
}