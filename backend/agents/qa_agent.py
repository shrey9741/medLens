from backend.models.vllm_client import text_inference

SYSTEM_PROMPT = """You are a medical AI assistant. You have analyzed 
a medical image and generated a diagnostic report. Answer follow-up 
questions based on the image findings and report provided. 
Always recommend consulting a qualified physician for medical decisions."""

def run_qa_agent(
    question: str,
    findings: str,
    report: str,
    chat_history: list
) -> str:
    history_text = ""
    for msg in chat_history[-4:]:
        role = msg["role"].upper()
        history_text += f"{role}: {msg['content']}\n"

    prompt = f"""MEDICAL IMAGE FINDINGS:
{findings}

DIAGNOSTIC REPORT:
{report}

CONVERSATION HISTORY:
{history_text}

USER QUESTION: {question}

Answer the question based on the findings and report above."""

    return text_inference(prompt, system=SYSTEM_PROMPT)