# app/main.py
from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import httpx
import os
import secrets
from dotenv import load_dotenv
import json
import urllib.parse
from fastapi.middleware.cors import CORSMiddleware
from app.db import connect_db, disconnect_db, db
from app.email_fetch import fetch_gmail_emails, fetch_microsoft_emails

# Load environment variables
load_dotenv()

app = FastAPI(on_startup=[connect_db], on_shutdown=[disconnect_db])

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://phishguard-project.vercel.app/"],  # your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- OAuth Credentials ----------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "YOUR_GOOGLE_CLIENT_SECRET")
MICROSOFT_CLIENT_ID = os.getenv("MICROSOFT_CLIENT_ID", "YOUR_MICROSOFT_CLIENT_ID")
MICROSOFT_CLIENT_SECRET = os.getenv("MICROSOFT_CLIENT_SECRET", "YOUR_MICROSOFT_CLIENT_SECRET")
MICROSOFT_TENANT_ID = "common"

REDIRECT_URI = "https://phishguard-project.onrender.com/auth"
FRONTEND_URL = "https://phishguard-project.vercel.app/"

# In-memory state store (replace with Redis or DB in production)
state_store: dict[str, str] = {}

# ---------- Schemas ----------
class UserData(BaseModel):
    id: str
    email: str
    name: str
    provider: str
    access_token: str
    refresh_token: str | None = None


# ---------- Helpers ----------
def create_redirect_response(user_data: UserData) -> RedirectResponse:
    """Redirect user to frontend dashboard with encoded user data"""
    user_json = json.dumps(user_data.dict())
    encoded_data = urllib.parse.quote(user_json)
    redirect_url = f"{FRONTEND_URL}/dashboard?user={encoded_data}"
    return RedirectResponse(url=redirect_url)


# ---------- GOOGLE LOGIN ----------
@app.get("/login/google")
async def google_login_redirect():
    state = secrets.token_urlsafe(32)
    state_store["google_state"] = state

    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={REDIRECT_URI}/google/callback&"
        f"response_type=code&"
        f"scope=openid email profile https://www.googleapis.com/auth/gmail.readonly&"
        f"state={state}&"
        f"access_type=offline&"
        f"prompt=consent"
    )
    return RedirectResponse(url=google_auth_url)


@app.get("/auth/google/callback")
async def google_callback(code: str, state: str):
    if state != state_store.get("google_state"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="State mismatch")
    state_store.pop("google_state", None)

    token_url = "https://oauth2.googleapis.com/token"
    token_data = {
        "code": code,
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "redirect_uri": f"{REDIRECT_URI}/google/callback",
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        try:
            # Exchange code for tokens
            token_response = await client.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            refresh_token = tokens.get("refresh_token")

            # Fetch Google user profile
            userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
            headers = {"Authorization": f"Bearer {access_token}"}
            user_response = await client.get(userinfo_url, headers=headers)
            user_response.raise_for_status()
            user_info = user_response.json()
 # ---------- Upsert user in DB ----------
            user = await db.user.upsert(
                where={"external_id": user_info.get("sub")},
                data={
                    "create": {
                        "provider": "google",
                        "email": user_info.get("email"),
                        "name": user_info.get("name"),
                        "access_token": access_token,
                        "refresh_token": refresh_token,
                        "external_id": user_info.get("sub"),
                    },
                    "update": {
                        "access_token": access_token,
                        "refresh_token": refresh_token or None,
                        "name": user_info.get("name"),  # update name in case changed
                    }
                }
            )

            # Optional: fetch Gmail emails
            await fetch_gmail_emails(access_token, user.id)

            # Prepare user data for frontend
            user_data = UserData(
                id=user.external_id,
                email=user.email,
                name=user.name,
                provider=user.provider,
                access_token=user.access_token,
                refresh_token=user.refresh_token
            )

            # Redirect back to dashboard
            return create_redirect_response(user_data)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Google OAuth failed: {str(e)}")


# ---------- MICROSOFT LOGIN ----------
@app.get("/login/microsoft")
async def microsoft_login_redirect():
    state = secrets.token_urlsafe(32)
    state_store["microsoft_state"] = state

    microsoft_auth_url = (
        f"https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/oauth2/v2.0/authorize?"
        f"client_id={MICROSOFT_CLIENT_ID}&"
        f"response_type=code&"
        f"redirect_uri={REDIRECT_URI}/microsoft/callback&"
        f"scope=openid email profile User.Read Mail.Read&"
        f"state={state}&"
        f"prompt=consent"
    )
    return RedirectResponse(url=microsoft_auth_url)


@app.get("/auth/microsoft/callback")
async def microsoft_callback(code: str, state: str):
    if state != state_store.get("microsoft_state"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="State mismatch")
    state_store.pop("microsoft_state", None)

    token_url = f"https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}/oauth2/v2.0/token"
    token_data = {
        "client_id": MICROSOFT_CLIENT_ID,
        "scope": "openid email profile User.Read Mail.Read",
        "code": code,
        "redirect_uri": f"{REDIRECT_URI}/microsoft/callback",
        "grant_type": "authorization_code",
        "client_secret": MICROSOFT_CLIENT_SECRET,
    }

    async with httpx.AsyncClient() as client:
        try:
            token_response = await client.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
            access_token = tokens.get("access_token")
            refresh_token = tokens.get("refresh_token")

            # Fetch Microsoft user profile
            userinfo_url = "https://graph.microsoft.com/v1.0/me"
            headers = {"Authorization": f"Bearer {access_token}"}
            user_response = await client.get(userinfo_url, headers=headers)
            user_response.raise_for_status()
            user_info = user_response.json()

            # Upsert user in DB
            user = await db.user.upsert(
                where={"external_id": user_info.get("id")},
                create={
                    "provider": "microsoft",
                    "email": user_info.get("userPrincipalName"),
                    "name": user_info.get("displayName"),
                    "access_token": access_token,
                    "refresh_token": refresh_token,
                    "external_id": user_info.get("id"),
                },
                update={
                    "access_token": access_token,
                    "refresh_token": refresh_token or None,
                    "name": user_info.get("displayName")
                }
            )

            # Fetch Microsoft emails
            await fetch_microsoft_emails(access_token, user.id)

            user_data = UserData(
                id=user.external_id,
                email=user.email,
                name=user.name,
                provider=user.provider,
                access_token=user.access_token,
                refresh_token=user.refresh_token
            )
            return create_redirect_response(user_data)

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Microsoft OAuth failed: {str(e)}")


# ---------- GET EMAILS ----------
@app.get("/emails")
async def get_emails(user_id: int):
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    emails = await db.emailscan.find_many(
        where={"user_id": user.id},
        order={"id": "desc"}
    )
    return {"emails": emails}


# ---------- ROOT ----------
@app.get("/")
async def root():
    return {"message": "Hello from FastAPI backend! Visit /docs for API documentation."}
