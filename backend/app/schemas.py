from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Email analysis schemas
class EmailAnalysisCreate(BaseModel):
    email_content: str

class EmailAnalysisResponse(BaseModel):
    id: int
    is_phishing: bool
    confidence_score: float
    threats_detected: List[str]
    recommendations: List[str]
    analyzed_at: datetime
    
    class Config:
        from_attributes = True

# URL analysis schemas
class URLAnalysisCreate(BaseModel):
    url: str

class URLAnalysisResponse(BaseModel):
    id: int
    url: str
    is_malicious: bool
    confidence_score: float
    risk_factors: List[str]
    analyzed_at: datetime
    
    class Config:
        from_attributes = True

# Legacy schema for compatibility
class InputData(BaseModel):
    name: str
    age: int