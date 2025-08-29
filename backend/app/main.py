import json
import random
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, database

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="PhishGuard API", version="1.0.0")

# CORS configuration
origins = [
    "http://localhost:3000",
    "https://phishguard-project.vercel.app",
    "https://*.vercel.app",  # Allow all Vercel deployments
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "PhishGuard API is running!", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "PhishGuard API"}

# Legacy endpoint for compatibility
@app.post("/predict")
def predict(data: schemas.InputData):
    label = "young" if data.age < 30 else "old"
    return {"name": data.name, "age": data.age, "category": label}

# Email analysis endpoint
@app.post("/analyze/email", response_model=schemas.EmailAnalysisResponse)
def analyze_email(
    email_data: schemas.EmailAnalysisCreate,
    db: Session = Depends(database.get_db)
):
    # Simulate ML analysis
    email_content = email_data.email_content.lower()
    
    # Simple phishing detection logic (replace with actual ML model)
    phishing_keywords = [
        "urgent", "verify account", "click here", "suspended", "limited time",
        "act now", "confirm identity", "update payment", "security alert"
    ]
    
    threat_count = sum(1 for keyword in phishing_keywords if keyword in email_content)
    is_phishing = threat_count >= 2
    confidence = min(95, max(60, threat_count * 25 + random.randint(10, 30)))
    
    threats = []
    recommendations = []
    
    if is_phishing:
        threats = [
            "Suspicious urgency language detected",
            "Contains potential phishing keywords",
            "Requests sensitive information"
        ]
        recommendations = [
            "Do not click any links in this email",
            "Verify sender identity through official channels",
            "Report this email to your IT security team"
        ]
    else:
        threats = ["No significant threats detected"]
        recommendations = ["Email appears safe to interact with"]
    
    # Save to database
    db_analysis = models.EmailAnalysis(
        email_content=email_data.email_content,
        is_phishing=is_phishing,
        confidence_score=confidence,
        threats_detected=json.dumps(threats),
        recommendations=json.dumps(recommendations)
    )
    
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    
    return schemas.EmailAnalysisResponse(
        id=db_analysis.id,
        is_phishing=is_phishing,
        confidence_score=confidence,
        threats_detected=threats,
        recommendations=recommendations,
        analyzed_at=db_analysis.analyzed_at
    )

# URL analysis endpoint
@app.post("/analyze/url", response_model=schemas.URLAnalysisResponse)
def analyze_url(
    url_data: schemas.URLAnalysisCreate,
    db: Session = Depends(database.get_db)
):
    # Simulate URL analysis
    url = url_data.url.lower()
    
    # Simple malicious URL detection
    suspicious_domains = [
        "bit.ly", "tinyurl.com", "t.co", "goo.gl",
        "suspicious-bank.com", "fake-paypal.net"
    ]
    
    suspicious_patterns = [
        "login", "verify", "account", "security", "update"
    ]
    
    domain_suspicious = any(domain in url for domain in suspicious_domains)
    pattern_suspicious = sum(1 for pattern in suspicious_patterns if pattern in url) >= 2
    
    is_malicious = domain_suspicious or pattern_suspicious
    confidence = random.randint(75, 95) if is_malicious else random.randint(85, 99)
    
    risk_factors = []
    if is_malicious:
        if domain_suspicious:
            risk_factors.append("Suspicious domain detected")
        if pattern_suspicious:
            risk_factors.append("Contains phishing-related keywords")
        risk_factors.append("URL structure indicates potential threat")
    else:
        risk_factors = ["No significant risk factors detected"]
    
    # Save to database
    db_analysis = models.URLAnalysis(
        url=url_data.url,
        is_malicious=is_malicious,
        confidence_score=confidence,
        risk_factors=json.dumps(risk_factors)
    )
    
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    
    return schemas.URLAnalysisResponse(
        id=db_analysis.id,
        url=url_data.url,
        is_malicious=is_malicious,
        confidence_score=confidence,
        risk_factors=risk_factors,
        analyzed_at=db_analysis.analyzed_at
    )

# Get analysis history
@app.get("/history/emails")
def get_email_history(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(database.get_db)
):
    analyses = db.query(models.EmailAnalysis).offset(skip).limit(limit).all()
    return [
        {
            "id": analysis.id,
            "is_phishing": analysis.is_phishing,
            "confidence_score": analysis.confidence_score,
            "analyzed_at": analysis.analyzed_at,
            "email_preview": analysis.email_content[:100] + "..." if len(analysis.email_content) > 100 else analysis.email_content
        }
        for analysis in analyses
    ]

@app.get("/history/urls")
def get_url_history(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(database.get_db)
):
    analyses = db.query(models.URLAnalysis).offset(skip).limit(limit).all()
    return [
        {
            "id": analysis.id,
            "url": analysis.url,
            "is_malicious": analysis.is_malicious,
            "confidence_score": analysis.confidence_score,
            "analyzed_at": analysis.analyzed_at
        }
        for analysis in analyses
    ]