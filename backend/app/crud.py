from sqlalchemy.orm import Session
from . import models, schemas
import json

def create_email_analysis(db: Session, email_data: schemas.EmailAnalysisCreate):
    db_analysis = models.EmailAnalysis(
        email_content=email_data.email_content,
        is_phishing=False,  # Will be updated by ML logic
        confidence_score=0.0,  # Will be updated by ML logic
        threats_detected="[]",
        recommendations="[]"
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def get_email_analyses(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.EmailAnalysis).offset(skip).limit(limit).all()

def create_url_analysis(db: Session, url_data: schemas.URLAnalysisCreate):
    db_analysis = models.URLAnalysis(
        url=url_data.url,
        is_malicious=False,  # Will be updated by ML logic
        confidence_score=0.0,  # Will be updated by ML logic
        risk_factors="[]"
    )
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis

def get_url_analyses(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.URLAnalysis).offset(skip).limit(limit).all()