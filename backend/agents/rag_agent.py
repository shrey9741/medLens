import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
INDEX_PATH = "backend/data/pubmed.index"
ABSTRACTS_PATH = "backend/data/abstracts.json"

_index = None
_abstracts = None

def load_index():
    global _index, _abstracts
    if _index is None:
        _index = faiss.read_index(INDEX_PATH)
        with open(ABSTRACTS_PATH, "r") as f:
            _abstracts = json.load(f)

def run_rag_agent(findings: str, top_k: int = 3) -> str:
    load_index()
    query_embedding = EMBEDDING_MODEL.encode([findings])
    distances, indices = _index.search(
        np.array(query_embedding).astype("float32"), top_k
    )
    results = []
    for i, idx in enumerate(indices[0]):
        if idx < len(_abstracts):
            results.append(f"[{i+1}] {_abstracts[idx]}")
    return "\n\n".join(results) if results else "No relevant literature found."