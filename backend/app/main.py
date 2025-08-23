from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

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
