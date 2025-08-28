# backend/app/auth.py
import os, httpx, time
from typing import Dict, Any
from jose import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# cache JWKS for performance
JWKS_CACHE: Dict[str, Any] = {}
security = HTTPBearer(auto_error=False)

def get_env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing env var: {name}")
    return v

async def get_jwks() -> Dict[str, Any]:
    url = get_env("SUPABASE_JWKS_URL")
    now = time.time()
    if (c := JWKS_CACHE.get("data")) and (now - JWKS_CACHE.get("ts", 0) < 3600):
        return c
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()
        JWKS_CACHE["data"] = data
        JWKS_CACHE["ts"] = now
        return data

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = credentials.credentials
    jwks = await get_jwks()
    try:
        header = jwt.get_unverified_header(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")

    key = None
    for k in jwks["keys"]:
        if k["kid"] == header.get("kid"):
            key = k
            break
    if not key:
        raise HTTPException(status_code=401, detail="Signing key not found")

    audience = os.getenv("SUPABASE_JWT_AUDIENCE", "authenticated")
    try:
        claims = jwt.decode(token, key, algorithms=[key["alg"]], audience=audience)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    return claims
