# PhishGuard Browser Extension

## Installation Instructions

### Chrome / Edge / Brave

1. **Download the Extension**
   - Download `phishguard-extension.zip` from the PhishGuard website
   - Extract the ZIP file to a folder on your computer

2. **Load Extension in Browser**
   - Open Chrome/Edge/Brave and navigate to:
     - Chrome: `chrome://extensions/`
     - Edge: `edge://extensions/`
     - Brave: `brave://extensions/`
   
3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Select the extracted extension **folder** (not individual files)
   - The PhishGuard extension should now appear in your extensions list

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in the toolbar
   - Find PhishGuard and click the pin icon to keep it visible

### Firefox

1. **Download the Extension**
   - Download `phishguard-extension.zip` from the PhishGuard website

2. **Temporary Installation (For Testing)**
   - Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` **file** (not the folder) from the extracted extension folder
   
   > Note: Unlike Chrome-based browsers which require selecting the folder, Firefox requires selecting the manifest.json file specifically. For permanent installation in Firefox, the extension needs to be signed by Mozilla or installed from the Firefox Add-ons store.

## Features

- **Analyze Current Page**: Instantly check the current webpage for phishing indicators
- **Manual Text Analysis**: Paste suspicious email content or text for analysis
- **Context Menu Integration**: Right-click any selected text and analyze it with PhishGuard
- **Real-time Results**: Get immediate feedback with risk scores and detailed reasons

## Usage

1. **Analyze Current Page**
   - Click the PhishGuard icon in your toolbar
   - Click "Analyze Current Page" to check the active tab

2. **Analyze Text**
   - Click the PhishGuard icon
   - Paste suspicious text in the textarea
   - Click "Analyze Text" to get results

3. **Context Menu**
   - Select any text on a webpage
   - Right-click and choose "Analyze with PhishGuard"
   - A notification will show the analysis result

## Requirements

### For Development
- The PhishGuard web application must be running at `http://localhost:3000`
- You must be logged in to the PhishGuard web app to use the extension features

### For Production
- Use the production version of the extension (`phishguard-extension-prod.zip`)
- The extension will connect to `https://phishguard-project.vercel.app`
- You must be logged in to the PhishGuard production web app to use the extension features

## Building the Extension

The extension comes in two versions:

1. **Development Version** - Connects to `http://localhost:3000`
   ```bash
   npm run build-extension-dev
   ```
   This generates `public/phishguard-extension-dev.zip`

2. **Production Version** - Connects to the production deployment
   ```bash
   npm run build-extension-prod
   ```
   This generates `public/phishguard-extension-prod.zip`

To build both versions at once:
```bash
npm run build-extension
```

### Customizing the Production URL

If your production deployment is at a different URL, update the `production.API_URL` in `extension/config.js` before building:

```javascript
production: {
  API_URL: 'https://your-domain.com/api/phishing/analyze',
  HOST_PERMISSIONS: ['https://your-domain.com/*']
}
```

## Troubleshooting

**"Please log in to PhishGuard web app"**
- Make sure you're logged in to the PhishGuard web application
- The extension uses cookies for authentication
- For development: log in at `http://localhost:3000`
- For production: log in at your production URL

**"Could not connect to PhishGuard"**
- Development version: Ensure the web application is running at `http://localhost:3000`
- Production version: Ensure you're using the production build and the production site is accessible
- Check your internet connection

**Extension not working**
- Try refreshing the page
- Reload the extension from the extensions page
- Check browser console for errors

## Privacy

- The extension only analyzes content when you explicitly request it
- No data is sent to external servers except to your local PhishGuard instance
- All analysis happens through your authenticated session

## Support

For issues or questions, please visit the PhishGuard GitHub repository or contact support through the web application.
