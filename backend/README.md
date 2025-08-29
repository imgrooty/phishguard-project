# PhishGuard Backend API

A FastAPI-based backend service for phishing detection and analysis.

## Features

- Email phishing detection
- URL malicious content analysis
- SQLAlchemy ORM with PostgreSQL/SQLite support
- Database migrations with Alembic
- Ready for Render deployment

## Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database configuration
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Start the development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Deployment on Render

1. Connect your GitHub repository to Render
2. Use the provided `render.yaml` for automatic configuration
3. Render will automatically:
   - Create a PostgreSQL database
   - Install dependencies
   - Run the application

## API Endpoints

- `GET /` - Health check
- `POST /predict` - Legacy prediction endpoint
- `POST /analyze/email` - Analyze email for phishing
- `POST /analyze/url` - Analyze URL for malicious content
- `GET /history/emails` - Get email analysis history
- `GET /history/urls` - Get URL analysis history

## Database Schema

The application uses SQLAlchemy models for:
- Users
- Email analyses
- URL analyses

All tables are automatically created on startup.