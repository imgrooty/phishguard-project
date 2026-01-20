// Import configuration
importScripts('config.js');

const API_URL = self.PHISHGUARD_CONFIG.API_URL;

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "analyze-selection",
    title: "Analyze with PhishGuard",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "analyze-selection") {
    const selectedText = info.selectionText;

    // We can't easily show a popup from background, but we can send a notification
    // or just trigger the analysis and perhaps show results when they next open the popup.
    // For now, let's just make the call to ensure it works.

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bodyText: selectedText,
          subject: "Context Menu Analysis",
          from: "Browser Extension"
        }),
        credentials: 'include'
      });

      if (response.status === 401) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'PhishGuard - Not Logged In',
          message: 'Please log in to PhishGuard web app to use this feature.',
          priority: 2
        });
        return;
      }

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const risk = data.isPotentialPhishing ? "High Risk" : "Safe";

      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'PhishGuard Analysis',
        message: `Analysis complete: ${risk} (Score: ${(data.phishingScore * 100).toFixed(0)}%)`,
        priority: 2
      });
    } catch (error) {
      console.error('Error analyzing selection:', error);
    }
  }
});
