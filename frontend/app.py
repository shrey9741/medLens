import streamlit as st
import requests

API_URL = "http://localhost:8000"

st.set_page_config(
    page_title="MedLens",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
    .main { padding: 0rem 1rem; }
    .stApp { background-color: #0a0f1e; }
    
    .hero-container {
        background: linear-gradient(135deg, #0d1b2a 0%, #1a1f3a 50%, #0d2137 100%);
        border: 1px solid #1e3a5f;
        border-radius: 16px;
        padding: 2.5rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    .hero-title {
        font-size: 3rem;
        font-weight: 800;
        background: linear-gradient(90deg, #00d4ff, #7b61ff, #00d4ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }
    .hero-subtitle {
        color: #8892b0;
        font-size: 1.1rem;
        margin-top: 0.5rem;
    }
    .badge {
        display: inline-block;
        background: rgba(0, 212, 255, 0.1);
        border: 1px solid rgba(0, 212, 255, 0.3);
        color: #00d4ff;
        padding: 0.3rem 0.9rem;
        border-radius: 20px;
        font-size: 0.8rem;
        margin: 0.3rem;
    }

    .stat-card {
        background: linear-gradient(135deg, #0d1b2a, #1a1f3a);
        border: 1px solid #1e3a5f;
        border-radius: 12px;
        padding: 1.2rem;
        text-align: center;
    }
    .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: #00d4ff;
    }
    .stat-label {
        color: #8892b0;
        font-size: 0.85rem;
        margin-top: 0.2rem;
    }

    .agent-card {
        background: linear-gradient(135deg, #0d1b2a, #1a1f3a);
        border: 1px solid #1e3a5f;
        border-radius: 12px;
        padding: 1rem 1.2rem;
        margin-bottom: 0.7rem;
        border-left: 3px solid #7b61ff;
    }
    .agent-title {
        color: #ccd6f6;
        font-weight: 600;
        font-size: 0.95rem;
    }
    .agent-desc {
        color: #8892b0;
        font-size: 0.8rem;
        margin-top: 0.2rem;
    }

    .upload-section {
        background: linear-gradient(135deg, #0d1b2a, #1a1f3a);
        border: 2px dashed #1e3a5f;
        border-radius: 16px;
        padding: 2rem;
        text-align: center;
        transition: border-color 0.3s;
    }
    .section-header {
        color: #ccd6f6;
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #1e3a5f;
    }
    .report-container {
        background: linear-gradient(135deg, #0d1b2a, #1a1f3a);
        border: 1px solid #1e3a5f;
        border-radius: 16px;
        padding: 1.5rem;
    }
    .stButton > button {
        background: linear-gradient(90deg, #7b61ff, #00d4ff) !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        padding: 0.6rem 2rem !important;
        font-weight: 600 !important;
        width: 100% !important;
    }
    div[data-testid="stChatMessage"] {
        background: #0d1b2a !important;
        border: 1px solid #1e3a5f !important;
        border-radius: 12px !important;
        margin-bottom: 0.5rem !important;
    }
</style>
""", unsafe_allow_html=True)

# Session state init
for key in ["findings", "report", "chat_history", "analyzed"]:
    if key not in st.session_state:
        st.session_state[key] = "" if key != "chat_history" else []
        if key == "analyzed":
            st.session_state[key] = False

# ── Hero ──────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero-container">
    <p class="hero-title">🔬 MedLens</p>
    <p class="hero-subtitle">Multimodal Medical Imaging Assistant</p>
    <div style="margin-top:1rem">
        <span class="badge">⚡ AMD MI300X</span>
        <span class="badge">🧠 Qwen2.5-VL</span>
        <span class="badge">📚 RAG + PubMed</span>
        <span class="badge">🤖 4-Agent Pipeline</span>
        <span class="badge">🦙 Llama 3.1</span>
    </div>
</div>
""", unsafe_allow_html=True)

# ── Stats row ─────────────────────────────────────────────────────────
c1, c2, c3, c4 = st.columns(4)
with c1:
    st.markdown('<div class="stat-card"><div class="stat-number">4</div><div class="stat-label">AI Agents</div></div>', unsafe_allow_html=True)
with c2:
    st.markdown('<div class="stat-card"><div class="stat-number">192GB</div><div class="stat-label">MI300X VRAM</div></div>', unsafe_allow_html=True)
with c3:
    st.markdown('<div class="stat-card"><div class="stat-number">3</div><div class="stat-label">Image Types</div></div>', unsafe_allow_html=True)
with c4:
    st.markdown('<div class="stat-card"><div class="stat-number">15+</div><div class="stat-label">PubMed Sources</div></div>', unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# ── Sidebar ───────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🤖 Agent Pipeline")
    agents = [
        ("👁️ Vision Agent", "Qwen2.5-VL image analysis"),
        ("📚 RAG Agent", "PubMed literature retrieval"),
        ("📋 Report Agent", "Llama 3.1 report generation"),
        ("💬 QA Agent", "Grounded follow-up chat"),
    ]
    for title, desc in agents:
        st.markdown(f"""
        <div class="agent-card">
            <div class="agent-title">{title}</div>
            <div class="agent-desc">{desc}</div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("### 📋 Supported Images")
    st.markdown("- 🫁 Chest X-rays\n- 🧠 Brain MRI\n- 🦴 Bone X-rays\n- 🔬 Skin lesions\n- 👁️ Retinal scans")

    st.markdown("---")
    st.markdown("### ⚙️ Runtime")
    st.markdown("🟢 **ROCm** enabled  \n🟢 **vLLM** serving  \n🟢 **FAISS** index loaded")

# ── Main layout ───────────────────────────────────────────────────────
left, right = st.columns([1, 1], gap="large")

with left:
    st.markdown('<div class="section-header">📤 Upload Medical Image</div>', unsafe_allow_html=True)

    uploaded_file = st.file_uploader(
        "Drag and drop or click to upload",
        type=["jpg", "jpeg", "png"],
        label_visibility="collapsed"
    )

    if uploaded_file:
        st.image(uploaded_file, caption=f"📎 {uploaded_file.name}", use_column_width=True)
        st.info(f"**File:** {uploaded_file.name}  \n**Size:** {uploaded_file.size / 1024:.1f} KB")

        if st.button("🔬 Analyze Image", type="primary"):
            with st.spinner("🧠 Running 4-agent pipeline..."):
                progress = st.progress(0, text="Initializing agents...")

                progress.progress(25, text="👁️ Vision Agent analyzing image...")
                response = requests.post(
                    f"{API_URL}/analyze",
                    files={"file": (
                        uploaded_file.name,
                        uploaded_file.getvalue(),
                        uploaded_file.type
                    )}
                )
                progress.progress(75, text="📋 Generating diagnostic report...")

                if response.status_code == 200:
                    data = response.json()
                    st.session_state.findings = data["findings"]
                    st.session_state.report = data["report"]
                    st.session_state.analyzed = True
                    st.session_state.chat_history = []
                    progress.progress(100, text="✅ Analysis complete!")
                    st.success("Analysis complete! See report on the right.")
                else:
                    progress.empty()
                    st.error(f"Error: {response.text}")
    else:
        st.markdown("""
        <div class="upload-section">
            <p style="font-size:3rem;margin:0">🩻</p>
            <p style="color:#8892b0;margin-top:0.5rem">Upload an X-ray, MRI, CT scan,<br>or skin lesion image to begin</p>
        </div>
        """, unsafe_allow_html=True)

with right:
    st.markdown('<div class="section-header">📊 Diagnostic Report & Q&A</div>', unsafe_allow_html=True)

    if st.session_state.analyzed:
        tab1, tab2 = st.tabs(["📋 Report", "💬 Follow-up Q&A"])

        with tab1:
            st.markdown('<div class="report-container">', unsafe_allow_html=True)
            st.markdown(st.session_state.report)
            st.markdown('</div>', unsafe_allow_html=True)

        with tab2:
            for msg in st.session_state.chat_history:
                with st.chat_message(msg["role"]):
                    st.write(msg["content"])

            question = st.chat_input("Ask about the findings, e.g. 'What does the opacity indicate?'")
            if question:
                st.session_state.chat_history.append({"role": "user", "content": question})
                with st.spinner("🤔 Thinking..."):
                    res = requests.post(
                        f"{API_URL}/chat",
                        json={
                            "question": question,
                            "findings": st.session_state.findings,
                            "report": st.session_state.report,
                            "chat_history": st.session_state.chat_history
                        }
                    )
                    if res.status_code == 200:
                        answer = res.json()["answer"]
                        st.session_state.chat_history.append({"role": "assistant", "content": answer})
                        st.rerun()
    else:
        st.markdown("""
        <div style="background:linear-gradient(135deg,#0d1b2a,#1a1f3a);border:1px solid #1e3a5f;
        border-radius:16px;padding:3rem;text-align:center;height:400px;
        display:flex;flex-direction:column;align-items:center;justify-content:center;">
            <p style="font-size:3rem;margin:0">📊</p>
            <p style="color:#ccd6f6;font-size:1.1rem;font-weight:600;margin-top:1rem">
                Awaiting Analysis</p>
            <p style="color:#8892b0;font-size:0.9rem;margin-top:0.5rem">
                Upload a medical image and click<br>Analyze to see the diagnostic report here</p>
        </div>
        """, unsafe_allow_html=True)