# backend/app/db.py
import os, asyncpg
from typing import Optional

_pool: Optional[asyncpg.Pool] = None

def get_env(name: str) -> str:
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing env var: {name}")
    return v

async def get_pool() -> asyncpg.Pool:
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            dsn=get_env("DATABASE_URL"),
            min_size=1,
            max_size=5
        )
    return _pool

async def close_pool():
    global _pool
    if _pool:
        await _pool.close()
        _pool = None
