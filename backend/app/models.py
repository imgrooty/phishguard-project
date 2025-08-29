from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Float
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EmailAnalysis(Base):
    __tablename__ = "email_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    email_content = Column(Text, nullable=False)
    is_phishing = Column(Boolean, nullable=False)
    confidence_score = Column(Float, nullable=False)
    threats_detected = Column(Text)  # JSON string
    recommendations = Column(Text)  # JSON string
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, nullable=True)  # Optional user association

class URLAnalysis(Base):
    __tablename__ = "url_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    is_malicious = Column(Boolean, nullable=False)
    confidence_score = Column(Float, nullable=False)
    risk_factors = Column(Text)  # JSON string
    analyzed_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, nullable=True)