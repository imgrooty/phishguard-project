import httpx
from app.db import db

# -------- Gmail --------
async def fetch_gmail_emails(access_token: str, user_id: int):
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        # get list of messages
        msg_list = await client.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages",
            headers=headers,
            params={"maxResults": 10}   # fetch latest 10
        )
        msg_list.raise_for_status()
        messages = msg_list.json().get("messages", [])

        for msg in messages:
            msg_id = msg["id"]
            msg_data = await client.get(
                f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}",
                headers=headers,
                params={"format": "full"}
            )
            msg_data.raise_for_status()
            payload = msg_data.json()

            headers_data = payload["payload"].get("headers", [])
            subject = next((h["value"] for h in headers_data if h["name"] == "Subject"), "")
            sender = next((h["value"] for h in headers_data if h["name"] == "From"), "")
            body = ""
            if "body" in payload["payload"] and payload["payload"]["body"].get("data"):
                body = payload["payload"]["body"]["data"]

            # save email if not already stored
            existing = await db.emailscan.find_first(
                where={"user_id": user_id, "subject": subject, "sender": sender}
            )
            if not existing:
                await db.emailscan.create(
                    data={
                        "user_id": user_id,
                        "subject": subject,
                        "sender": sender,
                        "body": body,
                        "label": "SAFE",   # later use ML
                        "score": 1.0
                    }
                )


# -------- Microsoft Outlook --------
async def fetch_microsoft_emails(access_token: str, user_id: int):
    headers = {"Authorization": f"Bearer {access_token}"}

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://graph.microsoft.com/v1.0/me/messages",
            headers=headers,
            params={"$top": 10}
        )
        resp.raise_for_status()
        data = resp.json()

        for msg in data.get("value", []):
            subject = msg.get("subject", "")
            sender = msg.get("from", {}).get("emailAddress", {}).get("address", "")
            body = msg.get("body", {}).get("content", "")

            existing = await db.emailscan.find_first(
                where={"user_id": user_id, "subject": subject, "sender": sender}
            )
            if not existing:
                await db.emailscan.create(
                    data={
                        "user_id": user_id,
                        "subject": subject,
                        "sender": sender,
                        "body": body,
                        "label": "SAFE",
                        "score": 1.0
                    }
                )
