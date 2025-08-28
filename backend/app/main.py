# backend/app/main.py
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from .auth import verify_token
from .db import get_pool, close_pool

app = FastAPI(title="PhishGuard API", version="1.0.0")

# CORS
import os
origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def _shutdown():
    await close_pool()

class EmailIn(BaseModel):
    from_email: EmailStr
    subject: str
    body: str
    raw: Optional[str] = None

class EmailOut(EmailIn):
    id: int
    user_id: str

class ScanIn(BaseModel):
    email_id: int
    verdict: str
    score: float
    details: Optional[str] = None

class ScanOut(ScanIn):
    id: int

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/emails", response_model=EmailOut)
async def create_email(
    item: EmailIn,
    claims: dict = Depends(verify_token),
):
    user_id = claims.get("sub")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No subject in token")
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "insert into public.emails (user_id, from_email, subject, body, raw) values ($1,$2,$3,$4,$5) returning id, user_id, from_email, subject, body, raw",
            user_id, item.from_email, item.subject, item.body, item.raw,
        )
    return dict(row)

@app.get("/emails", response_model=List[EmailOut])
async def list_emails(claims: dict = Depends(verify_token)):
    user_id = claims.get("sub")
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "select id, user_id, from_email, subject, body, raw from public.emails where user_id=$1 order by id desc",
            user_id,
        )
    return [dict(r) for r in rows]

@app.post("/scans", response_model=ScanOut)
async def create_scan(item: ScanIn, claims: dict = Depends(verify_token)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "insert into public.scans (email_id, verdict, score, details) values ($1,$2,$3,$4) returning id, email_id, verdict, score, details",
            item.email_id, item.verdict, item.score, item.details,
        )
    return dict(row)

@app.get("/scans", response_model=List[ScanOut])
async def list_scans(email_id: Optional[int] = None, claims: dict = Depends(verify_token)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        if email_id:
            rows = await conn.fetch(
                "select id, email_id, verdict, score, details from public.scans where email_id=$1 order by id desc",
                email_id,
            )
        else:
            rows = await conn.fetch(
                "select id, email_id, verdict, score, details from public.scans order by id desc"
            )
    return [dict(r) for r in rows]
