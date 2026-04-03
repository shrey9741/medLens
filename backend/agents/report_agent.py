from backend.models.vllm_client import text_inference

SYSTEM_PROMPT = """You are a clinical AI assistant that generates 
structured medical diagnostic reports. Be thorough, accurate, 
and always recommend consulting a qualified physician."""

def run_report_agent(findings: str, literature: str) -> str:
    prompt = f"""Based on the following medical image findings and 
supporting literature, generate a structured diagnostic report.

VISUAL FINDINGS:
{findings}

SUPPORTING LITERATURE:
{literature}

Generate a report with these sections:
## Summary
## Key Findings
## Differential Diagnosis
## Supporting Evidence
## Recommended Next Steps
## Disclaimer"""

    return text_inference(prompt, system=SYSTEM_PROMPT)