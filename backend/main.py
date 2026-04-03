import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.agents.vision_agent import run_vision_agent
from backend.agents.rag_agent import run_rag_agent
from backend.agents.report_agent import run_report_agent
from backend.agents.qa_agent import run_qa_agent

app = FastAPI(title="MedLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class QARequest(BaseModel):
    question: str
    findings: str
    report: str
    chat_history: list = []

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    try:
        image_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(image_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        findings = run_vision_agent(image_path)
        literature = run_rag_agent(findings)
        report = run_report_agent(findings, literature)

        return {
            "findings": findings,
            "literature": literature,
            "report": report
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: QARequest):
    try:
        answer = run_qa_agent(
            request.question,
            request.findings,
            request.report,
            request.chat_history
        )
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health():
    return {"status": "ok"}