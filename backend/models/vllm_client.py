import os
import base64
from pathlib import Path
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

MODE = os.getenv("MODEL_MODE", "groq")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_client = Groq(api_key=GROQ_API_KEY)

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def vision_inference(image_path: str, prompt: str) -> str:
    b64 = encode_image(image_path)
    ext = Path(image_path).suffix.lstrip(".")

    if MODE == "groq":
        response = groq_client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/{ext};base64,{b64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            max_tokens=1024
        )
        return response.choices[0].message.content

    elif MODE == "vllm":
        import requests
        payload = {
            "model": "Qwen/Qwen2.5-VL-7B-Instruct",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/{ext};base64,{b64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ],
            "max_tokens": 1024
        }
        response = requests.post(
            "http://localhost:8001/v1/chat/completions",
            json=payload
        )
        return response.json()["choices"][0]["message"]["content"]


def text_inference(prompt: str, system: str = "") -> str:
    if MODE == "groq":
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        response = groq_client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            max_tokens=1024
        )
        return response.choices[0].message.content

    elif MODE == "vllm":
        import requests
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "meta-llama/Llama-3.1-8B-Instruct",
            "messages": messages,
            "max_tokens": 1024
        }
        response = requests.post(
            "http://localhost:8001/v1/chat/completions",
            json=payload
        )
        return response.json()["choices"][0]["message"]["content"]