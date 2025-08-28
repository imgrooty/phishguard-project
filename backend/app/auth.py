# backend/app/auth.py
import os
import time
from typing import Dict, Any, Optional

import httpx
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

JWKS_CACHE: Dict[str, Any] = {"updated_at": 0, "keys": None}
JWKS_TTL_SECONDS = 60 * 60  # 1 hour
security = HTTPBearer(auto_error=True)

def _env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing env var: {name}")
    return v

async def _get_jwks() -> Dict[str, Any]:
    now = int(time.time())
    if JWKS_CACHE["keys"] and now - JWKS_CACHE["updated_at"] < JWKS_TTL_SECONDS:
        return JWKS_CACHE["keys"]
    url = _env("SUPABASE_JWKS_URL")
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get(url)
        r.raise_for_status()
        JWKS_CACHE["keys"] = r.json()
        JWKS_CACHE["updated_at"] = now
        return JWKS_CACHE["keys"]

async def verify_token(
    creds: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    # Validate Supabase JWT via JWKS and return claims dict.
    token = creds.credentials
    try:
        unverified = jwt.get_unverified_header(token)
        kid = unverified.get("kid")
        jwks = await _get_jwks()
        key: Optional[Dict[str, Any]] = next((k for k in jwks.get("keys", []) if k.get("kid") == kid), None)
        if not key:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token key")
        claims = jwt.decode(
            token,
            key,
            algorithms=[unverified.get("alg", "RS256")],
            audience=_env("SUPABASE_JWT_AUDIENCE"),
            options={"verify_exp": True},
        )
        return claims
    except JWTError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e)) from e
