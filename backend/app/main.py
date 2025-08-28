# backend/app/main.py
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from .db import get_pool
from .auth import verify_token

# load .env file
load_dotenv()

app = FastAPI()

# CORS
allowed = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schemas
class EmailIn(BaseModel):
    user_id: str
    from_email: str | None = None
    subject: str | None = None
    body: str | None = None
    raw: dict | None = None

class ScanIn(BaseModel):
    email_id: int
    model_version: str | None = "v1"
    score: float
    label: str
    details: dict | None = None

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/emails")
async def create_email(item: EmailIn, claims = Depends(verify_token)):
    # enforce: user can only insert their own row
    if item.user_id != claims.get("sub"):
        raise HTTPException(status_code=403, detail="Cannot insert for another user")

    pool = await get_pool()
    async with pool.acquire() as con:
        row = await con.fetchrow(
            """
            insert into public.emails (user_id, from_email, subject, body, raw)
            values ($1,$2,$3,$4,$5)
            returning id
            """,
            item.user_id, item.from_email, item.subject, item.body, item.raw
        )
        return {"id": row["id"]}

@app.get("/emails")
async def list_my_emails(claims = Depends(verify_token)):
    uid = claims.get("sub")
    pool = await get_pool()
    async with pool.acquire() as con:
        rows = await con.fetch(
            """
            select id, from_email, subject, created_at
            from public.emails
            where user_id=$1
            order by created_at desc
            """, uid
        )
        return [dict(r) for r in rows]

@app.post("/scans")
async def add_scan(item: ScanIn):
    # Use service_role key when calling this (bypasses RLS)
    pool = await get_pool()
    async with pool.acquire() as con:
        row = await con.fetchrow(
            """
            insert into public.scans (email_id, model_version, score, label, details)
            values ($1,$2,$3,$4,$5)
            returning id
            """,
            item.email_id, item.model_version, item.score, item.label, item.details
        )
        return {"id": row["id"]}
