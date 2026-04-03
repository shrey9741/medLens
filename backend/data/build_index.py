import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

abstracts = [
    "Pneumonia presents as consolidation or ground-glass opacity in chest X-rays, often with air bronchograms visible in affected lobes.",
    "Pleural effusion appears as blunting of the costophrenic angle on chest X-ray, with a meniscus sign in larger effusions.",
    "Cardiomegaly is diagnosed when the cardiothoracic ratio exceeds 0.5 on a posteroanterior chest radiograph.",
    "Pulmonary edema shows bilateral perihilar infiltrates in a butterfly pattern with Kerley B lines on chest X-ray.",
    "Pneumothorax appears as a visible pleural line with absent lung markings beyond it on chest radiograph.",
    "Atelectasis presents as linear or plate-like opacities, often with volume loss and shift of mediastinal structures.",
    "Lung nodules appear as rounded opacities; those under 6mm are typically benign while larger ones warrant CT follow-up.",
    "Melanoma in dermoscopy shows asymmetry, irregular borders, multiple colors, and diameter greater than 6mm.",
    "Basal cell carcinoma presents as a pearly or waxy bump with visible blood vessels on dermoscopy.",
    "Diabetic retinopathy shows microaneurysms, hemorrhages, and neovascularization on fundus examination.",
    "Glaucoma is characterized by increased cup-to-disc ratio and optic nerve head changes on fundus imaging.",
    "Bone fractures on X-ray appear as cortical disruption, periosteal reaction, or abnormal lucent lines.",
    "Osteoporosis shows decreased bone density and trabecular thinning on X-ray with increased fracture risk.",
    "Brain MRI T2 hyperintensities may indicate white matter disease, demyelination, or ischemic changes.",
    "Appendicitis on CT shows a distended appendix over 6mm with periappendiceal fat stranding.",
]

print("Building FAISS index...")
model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = model.encode(abstracts, show_progress_bar=True)

index = faiss.IndexFlatL2(embeddings.shape[1])
index.add(np.array(embeddings).astype("float32"))

faiss.write_index(index, "backend/data/pubmed.index")
with open("backend/data/abstracts.json", "w") as f:
    json.dump(abstracts, f, indent=2)

print(f"Index built with {len(abstracts)} abstracts.")