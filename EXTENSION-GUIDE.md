# PhishGuard Extension - Quick Start Guide

## For End Users

### Using the Development Version (Local Testing)
1. Download `phishguard-extension-development.zip`
2. Extract the ZIP file to a folder
3. Make sure PhishGuard is running at `http://localhost:3000` and you're logged in
4. Load the extension in your browser:
   - Chrome: `chrome://extensions/` → Enable "Developer mode" → "Load unpacked"
   - Firefox: `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → Select `manifest.json`

### Using the Production Version (Live Deployment)
1. Download `phishguard-extension-production.zip`
2. Extract the ZIP file to a folder
3. Make sure you're logged in to PhishGuard at `https://phishguard-project.vercel.app`
4. Load the extension in your browser (same steps as above)

## For Developers

### Building the Extension

```bash
# Build both development and production versions
npm run build-extension
```

This creates:
- `public/phishguard-extension-development.zip` - For local testing
- `public/phishguard-extension-production.zip` - For production use
- `public/phishguard-extension.zip` - Default (development version)

### Customizing the Production URL

If deploying to a custom domain:

1. Edit `extension/config.js`:
```javascript
production: {
  API_URL: 'https://your-domain.com/api/phishing/analyze'
}
```

2. Edit `extension/manifest.json`:
```json
"host_permissions": [
  "http://localhost:3000/*",
  "https://your-domain.com/*"
]
```

3. Rebuild:
```bash
npm run build-extension
```

## How It Works

The extension uses a configuration system that automatically switches between environments:

- **Development**: Uses `http://localhost:3000` for local testing
- **Production**: Uses `https://phishguard-project.vercel.app` for deployed version

The build script (`build-extension.sh`) creates separate packages for each environment by modifying the `CURRENT_ENV` constant in `config.js`.

## Features

- **Analyze Current Page**: Check the active webpage for phishing indicators
- **Manual Text Analysis**: Paste suspicious content for instant analysis
- **Context Menu**: Right-click selected text → "Analyze with PhishGuard"
- **Real-time Results**: Immediate feedback with risk scores and detailed reasons

## Troubleshooting

### "Please log in to PhishGuard web app"
- You need to be logged in to the PhishGuard web application
- Development: Log in at `http://localhost:3000`
- Production: Log in at `https://phishguard-project.vercel.app`

### "Could not connect to PhishGuard"
- Development: Make sure the web app is running locally
- Production: Check your internet connection and that the production site is accessible
- Verify you're using the correct extension version (dev vs prod)

### Extension not loading
- Make sure you extracted the ZIP file (don't try to load the ZIP directly)
- For Chrome: Select the extracted folder in "Load unpacked"
- For Firefox: Select the `manifest.json` file specifically

## Support

For issues or questions:
- Check the main [README.md](../README.md)
- Review the detailed [extension/README.md](extension/README.md)
- Create an issue on GitHub
