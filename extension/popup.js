const API_URL = window.PHISHGUARD_CONFIG.API_URL;

document.addEventListener('DOMContentLoaded', () => {
  const analyzeTabBtn = document.getElementById('analyze-tab-btn');
  const analyzeTextBtn = document.getElementById('analyze-text-btn');
  const manualText = document.getElementById('manual-text');
  const resultsSection = document.getElementById('results');
  const riskLabel = document.getElementById('risk-label');
  const scoreFill = document.getElementById('score-fill');
  const reasonsList = document.getElementById('reasons-list');
  const authWarning = document.getElementById('auth-warning');

  const showResults = (data) => {
    resultsSection.classList.remove('hidden');
    authWarning.classList.add('hidden');

    const score = data.phishingScore * 100;
    scoreFill.style.width = `${score}%`;

    if (score >= 80) {
      riskLabel.textContent = 'High Risk';
      riskLabel.style.color = '#ef4444';
      scoreFill.style.backgroundColor = '#ef4444';
    } else if (score >= 50) {
      riskLabel.textContent = 'Medium Risk';
      riskLabel.style.color = '#f59e0b';
      scoreFill.style.backgroundColor = '#f59e0b';
    } else {
      riskLabel.textContent = 'Safe';
      riskLabel.style.color = '#10b981';
      scoreFill.style.backgroundColor = '#10b981';
    }

    if (data.phishingReasons && data.phishingReasons.length > 0) {
      reasonsList.innerHTML = '<strong>Reasons:</strong><ul>' +
        data.phishingReasons.map(r => `<li>${r}</li>`).join('') +
        '</ul>';
    } else {
      reasonsList.innerHTML = 'No suspicious elements detected.';
    }
  };

  const analyze = async (text, subject = "Extension Analysis") => {
    try {
      riskLabel.textContent = 'Analyzing...';
      resultsSection.classList.remove('hidden');
      reasonsList.innerHTML = '';
      scoreFill.style.width = '0%';
      authWarning.classList.add('hidden');

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bodyText: text,
          subject: subject,
          from: "Browser Extension"
        }),
        credentials: 'include' // Important for sending session cookies
      });

      if (response.status === 401) {
        resultsSection.classList.add('hidden');
        authWarning.classList.remove('hidden');
        return;
      }

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      showResults(data);
    } catch (error) {
      riskLabel.textContent = 'Error';
      riskLabel.style.color = '#ef4444';
      reasonsList.textContent = 'Could not connect to PhishGuard. Make sure the web app is running and accessible.';
      console.error(error);
    }
  };

  analyzeTabBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      analyze(tab.url, "Current Page Analysis");
    }
  });

  analyzeTextBtn.addEventListener('click', () => {
    const text = manualText.value.trim();
    if (text) {
      analyze(text, "Manual Text Analysis");
    }
  });
});
