import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import axios, { AxiosError } from 'axios';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  provider?: string;
}

interface EmailData {
  messageId: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  body: string;
  isRead: boolean;
  isPotentialPhishing: boolean;
  phishingScore: number;
  phishingReasons: string[];
}

interface OutlookMessage {
  id: string;
  subject: string;
  bodyPreview: string;
  body: { content: string };
  from: { emailAddress: { address: string; name: string } };
  toRecipients: Array<{ emailAddress: { address: string; name: string } }>;
  receivedDateTime: string;
  isRead: boolean;
}

// Helper function to retry failed requests
async function retryRequest<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === retries - 1;
      const isRetryableError =
        axios.isAxiosError(error) &&
        (error.code === 'ECONNRESET' ||
          error.code === 'ETIMEDOUT' ||
          error.code === 'ECONNREFUSED');

      if (isLastRetry || !isRetryableError) {
        throw error;
      }

      console.log(`⚠️ Retry ${i + 1}/${retries} after ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

// Function to refresh Azure AD token
async function refreshAzureToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
} | null> {
  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || 'common'}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'openid profile email offline_access https://graph.microsoft.com/Mail.Read',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    return response.data;
  } catch (error) {
    console.error('❌ Failed to refresh Azure token:', error);
    return null;
  }
}

// Function to fetch emails from Microsoft Graph API (Outlook)
async function fetchOutlookEmails(accessToken: string): Promise<EmailData[]> {
  const fetchFn = async () => {
    const response = await axios.get(
      'https://graph.microsoft.com/v1.0/me/messages?$top=20&$select=id,subject,bodyPreview,from,toRecipients,receivedDateTime,isRead,body',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        timeout: 30000, // 30 second timeout
        httpsAgent: new (require('https').Agent)({
          keepAlive: true,
          timeout: 30000,
        }),
      }
    );
    return response;
  };

  try {
    const response = await retryRequest(fetchFn, 3, 1000);
    const messages = response.data.value || [];
    const emails: EmailData[] = [];

    for (const message of messages) {
      const fromAddress = message.from?.emailAddress?.address || 'unknown@unknown.com';
      const toAddress = message.toRecipients?.[0]?.emailAddress?.address || 'unknown@unknown.com';

      if (!message.from?.emailAddress?.address) {
        console.warn(`⚠️ Email ${message.id} has no from address, using fallback`);
      }

      const content = (message.subject || '') + ' ' + (message.bodyPreview || '');
      const suspiciousWords = ['password', 'verify', 'account', 'login', 'urgent', 'security'];
      const foundWords = suspiciousWords.filter((word) =>
        content.toLowerCase().includes(word)
      );

      emails.push({
        messageId: message.id,
        subject: message.subject || '(No Subject)',
        from: fromAddress,
        to: toAddress,
        date: new Date(message.receivedDateTime),
        body: message.body?.content || message.bodyPreview || '',
        isRead: message.isRead || false,
        isPotentialPhishing: foundWords.length > 1,
        phishingScore: foundWords.length,
        phishingReasons: foundWords,
      });
    }

    console.log(`✅ Fetched ${emails.length} emails from Outlook`);
    return emails;
  } catch (error) {
    console.error('❌ Error fetching Outlook emails:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      
      if (error.response?.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session as any).user) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid session found' },
        { status: 401 }
      );
    }

    const sessionUser = (session as any).user as SessionUser;
    let accessToken = (session as any).access_token;
    const refreshToken = (session as any).refresh_token;
    const provider = sessionUser.provider || (session as any).provider;

    console.log('📋 Session info:', {
      email: sessionUser.email,
      provider,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
    });

    if (!sessionUser.email) {
      return NextResponse.json(
        { error: 'Unauthorized: No email in session' },
        { status: 401 }
      );
    }

    if (provider !== 'azure-ad') {
      return NextResponse.json(
        { error: 'This endpoint is only for Outlook users' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user in database
    const user = await User.findOne({ email: sessionUser.email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Try to fetch with current token, refresh if it fails
    let emails: EmailData[];
    try {
      if (!accessToken) {
        throw new Error('UNAUTHORIZED');
      }
      emails = await fetchOutlookEmails(accessToken);
    } catch (error: any) {
      // If unauthorized and we have a refresh token, try to refresh
      if (error.message === 'UNAUTHORIZED' && refreshToken) {
        console.log('🔄 Attempting to refresh token...');
        const newTokens = await refreshAzureToken(refreshToken);

        if (newTokens) {
          console.log('✅ Token refreshed successfully');
          accessToken = newTokens.access_token;

          // Update user's tokens in database for future use
          user.accessToken = newTokens.access_token;
          user.refreshToken = newTokens.refresh_token;
          user.tokenExpiry = new Date(Date.now() + newTokens.expires_in * 1000);
          await user.save();

          // Retry with new token
          emails = await fetchOutlookEmails(accessToken);
        } else {
          return NextResponse.json(
            { error: 'Failed to refresh token. Please sign in again.' },
            { status: 401 }
          );
        }
      } else {
        throw error;
      }
    }

    console.log(`📧 Processing ${emails.length} emails`);

    if (!user.emails) {
      user.emails = [];
    }

    // Store emails in the database
    for (const email of emails) {
      if (!email.from || !email.messageId) {
        console.warn(`⚠️ Skipping invalid email:`, email.subject);
        continue;
      }

      const existingEmailIndex = user.emails.findIndex(
        (e: any) => e.messageId === email.messageId
      );

      if (existingEmailIndex === -1) {
        user.emails.push(email);
      } else {
        user.emails[existingEmailIndex] = {
          ...user.emails[existingEmailIndex].toObject(),
          ...email,
        };
      }
    }

    user.lastEmailSync = new Date();
    await user.save();

    console.log(`✅ Saved ${user.emails.length} emails for user ${user.email}`);

    return NextResponse.json({
      success: true,
      emailCount: user.emails.length,
      emails: user.emails.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
  } catch (error) {
    console.error('❌ Error in Outlook emails endpoint:', error);

    let errorMessage = 'Failed to fetch emails';
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNRESET') {
        errorMessage = 'Network connection error. Please try again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please sign in again.';
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}