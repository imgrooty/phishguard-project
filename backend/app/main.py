from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
# 👇 Allow your frontend domain (replace with your actual Vercel domain)
origins = [
    "http://localhost:3000",  # local dev
    "https://phishguard-project.vercel.app",  # deployed frontend
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # only allow these
    allow_credentials=True,
    allow_methods=["*"],          # allow all methods (GET, POST, etc.)
    allow_headers=["*"],          # allow all headers
)
# Example schema
class InputData(BaseModel):
    name: str
    age: int

@app.get("/")
def home():
    return {"message": "FastAPI is running!"}

@app.post("/predict")
def predict(data: InputData):
    # Fake ML logic: classify as "young" or "old"
    label = "young" if data.age < 30 else "old"
    return {"name": data.name, "age": data.age, "category": label}
