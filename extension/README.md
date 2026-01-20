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
   - Select the extracted extension folder
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
   - Select the `manifest.json` file from the extracted extension folder
   
   > Note: For permanent installation in Firefox, the extension needs to be signed by Mozilla or installed from the Firefox Add-ons store.

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

- The PhishGuard web application must be running at `http://localhost:3000`
- You must be logged in to the PhishGuard web app to use the extension features

## Troubleshooting

**"Please log in to PhishGuard web app"**
- Make sure you're logged in at `http://localhost:3000`
- The extension uses cookies for authentication

**"Could not connect to PhishGuard"**
- Ensure the web application is running
- Check that it's accessible at `http://localhost:3000`

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
