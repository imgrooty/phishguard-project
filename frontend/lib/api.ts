import { config } from '@/app/env';

export class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  async analyzeEmail(emailContent: string) {
    const response = await fetch(`${this.baseUrl}/analyze/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_content: emailContent
      }),
    });

    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  async analyzeUrl(url: string) {
    const response = await fetch(`${this.baseUrl}/analyze/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`URL analysis failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getEmailHistory(skip = 0, limit = 10) {
    const response = await fetch(`${this.baseUrl}/history/emails?skip=${skip}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch email history: ${response.statusText}`);
    }

    return response.json();
  }

  async getUrlHistory(skip = 0, limit = 10) {
    const response = await fetch(`${this.baseUrl}/history/urls?skip=${skip}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL history: ${response.statusText}`);
    }

    return response.json();
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

export const apiClient = new ApiClient();