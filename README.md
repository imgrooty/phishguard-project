# PhishGuard - Advanced Email Security Platform

A comprehensive email phishing detection system that combines multiple analysis methods to provide accurate threat detection and user protection.

## 🚀 Features

### Core Capabilities
- **Multi-Provider Email Integration**: Seamless support for Gmail and Outlook
- **Advanced Phishing Detection**: Combines heuristics, ML models, and VirusTotal analysis
- **Real-time Analysis**: Automatic email scanning with intelligent threat detection
- **Enhanced Dashboard**: Modern UI showing detailed analysis results and risk breakdowns
- **Secure Authentication**: OAuth integration with Google and Microsoft

### Advanced Security Features
- **Heuristic Analysis**: Pattern-based detection of suspicious email characteristics
- **ML Model Integration**: Custom phishing detection API with confidence scoring
- **VirusTotal Integration**: URL scanning for malicious content detection
- **Google Safe Browsing API**: Real-time URL threat detection and assessment
- **Token Management**: Intelligent refresh token handling to prevent API timeouts
- **Rate Limiting**: Optimized batch processing to avoid API limits

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth with OAuth providers
- **ML Integration**: Custom phishing detection API
- **Security**: VirusTotal API integration, Google Safe Browsing API
- **Performance**: Optimized HTTPS agents and connection pooling

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB instance
- Google OAuth credentials
- Microsoft Azure AD credentials
- Phishing detection ML API (optional)
- VirusTotal API key (optional)
- Google Safe Browsing API key (optional)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd phishguard-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/phishguard

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret

# Microsoft OAuth
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret

# Phishing Detection APIs
PHISHING_API_URL=http://127.0.0.1:8000/predict
PHISHING_API_KEY=your-ml-api-key

# VirusTotal API (optional but recommended)
VIRUSTOTAL_API_KEY=your-virustotal-api-key

# Google Safe Browsing API (optional but recommended)
GOOGLE_SAFE_BROWSING_API_KEY=your-google-safe-browsing-api-key
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🔐 Google Safe Browsing API Setup

To enable URL safety checking, you'll need to set up Google Safe Browsing API:

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Safe Browsing API

### 2. Generate API Key
1. Navigate to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Restrict the API key to Safe Browsing API only
4. Copy the API key to your `.env.local` file

### 3. API Usage
The Google Safe Browsing API will automatically:
- Check all URLs found in emails against Google's threat database
- Detect malware, phishing, and unwanted software
- Provide detailed threat information including threat type and platform
- Cache results to optimize performance

## 🔧 API Endpoints

### Email Management
- `GET /api/emails/fetch` - Fetch emails from connected providers
- `GET /api/emails/gmail` - Gmail-specific email fetching with enhanced analysis
- `GET /api/emails/outlook` - Outlook-specific email fetching with enhanced analysis

### Security Analysis
- `POST /api/phishing/analyze` - Comprehensive phishing analysis endpoint
- `GET /api/auth/me` - User authentication status
- `POST /api/auth/register` - User registration

## 🎯 Key Improvements

### Performance Optimizations
- **Connection Pooling**: Reusable HTTPS connections for better performance
- **Batch Processing**: Optimized email fetching in small batches
- **Timeout Management**: Proper request timeouts to prevent hanging
- **Token Refresh**: Intelligent token refresh to avoid API failures

### Enhanced Security Detection
- **Multi-layered Analysis**: Heuristics + ML + VirusTotal for comprehensive detection
- **Confidence Scoring**: Weighted scoring system for accurate threat assessment
- **Real-time Updates**: Live analysis results with detailed breakdowns
- **Error Handling**: Graceful fallbacks when external APIs are unavailable

### User Experience
- **Modern Dashboard**: Clean, responsive interface with detailed analysis
- **Risk Visualization**: Clear indicators of email safety status
- **Detailed Reports**: Comprehensive breakdown of analysis results
- **Real-time Sync**: Automatic email synchronization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application is compatible with any Node.js hosting platform:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Considerations

- All API keys are stored securely in environment variables
- OAuth tokens are properly managed with automatic refresh
- Database connections use connection pooling
- HTTPS is enforced for all external API calls
- Rate limiting prevents API abuse

## 📊 Monitoring and Analytics

The system includes comprehensive logging for:
- Email fetch operations
- Phishing analysis results
- API performance metrics
- Error tracking and debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation in the code comments

## 🔮 Future Enhancements

- [ ] Additional email providers (Yahoo, iCloud)
- [ ] Advanced ML model training
- [ ] Real-time notifications
- [ ] Mobile application
- [ ] Advanced reporting and analytics
- [ ] Integration with security tools