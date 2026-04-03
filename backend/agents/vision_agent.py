from backend.models.vllm_client import vision_inference

VISION_PROMPT = """You are an expert medical imaging AI assistant.
Analyze this medical image carefully and provide:
1. Image type (X-ray, MRI, CT scan, skin lesion, etc.)
2. Key visual findings and observations
3. Any abnormalities, anomalies, or regions of interest
4. Anatomical structures visible
Be specific and use clinical terminology."""

def run_vision_agent(image_path: str) -> str:
    findings = vision_inference(image_path, VISION_PROMPT)
    return findings