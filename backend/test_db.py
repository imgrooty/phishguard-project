import asyncio
import os
import asyncpg
from dotenv import load_dotenv

# Load .env variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

async def test_connection():
    try:
        conn = await asyncpg.connect(DATABASE_URL)
        print("✅ Database connected successfully!")
        # Optional: run a simple query
        version = await conn.fetchval("SELECT version();")
        print("PostgreSQL version:", version)
        await conn.close()
    except Exception as e:
        print("❌ Failed to connect:", e)

asyncio.run(test_connection())
