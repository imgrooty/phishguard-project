import dbConnect from './dbConnect';
import User from '@/models/User';
import axios from 'axios';

// Function to refresh token if needed
async function refreshTokenIfNeeded(user: any) {
  // Check if token is expired
  if (user.tokenExpiry && new Date(user.tokenExpiry) < new Date()) {
    try {
      if (user.provider === 'google') {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
          client_id: process.env.GOOGLE_ID,
          client_secret: process.env.GOOGLE_SECRET,
          refresh_token: user.refreshToken,
          grant_type: 'refresh_token',
        });
        
        user.accessToken = response.data.access_token;
        user.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
        await user.save();
      } else if (user.provider === 'azure-ad') {
        const params = new URLSearchParams();
        params.append('client_id', process.env.AZURE_AD_CLIENT_ID!);
        params.append('client_secret', process.env.AZURE_AD_CLIENT_SECRET!);
        params.append('refresh_token', user.refreshToken);
        params.append('grant_type', 'refresh_token');
        
        const response = await axios.post(
          `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID || 'common'}/oauth2/v2.0/token`,
          params
        );
        
        user.accessToken = response.data.access_token;
        user.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
        await user.save();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  return user;
}

// Function to fetch emails from Gmail
async function fetchGmailEmails(user: any) {
  try {
    // Refresh token if needed
    user = await refreshTokenIfNeeded(user);
    
    const response = await axios.get(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=20',
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    const messages = response.data.messages || [];
    const emails = [];

    // Fetch details for each message
    for (const message of messages.slice(0, 10)) {
      const detailResponse = await axios.get(
        `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const messageData = detailResponse.data;
      const headers = messageData.payload.headers;

      // Extract email details
      const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
      const from = headers.find((h: any) => h.name === 'From')?.value || '';
      const to = headers.find((h: any) => h.name === 'To')?.value || '';
      const date = headers.find((h: any) => h.name === 'Date')?.value || '';

      // Extract body
      let body = '';
      if (messageData.payload.parts && messageData.payload.parts.length) {
        const textPart = messageData.payload.parts.find(
          (part: any) => part.mimeType === 'text/plain'
        );
        if (textPart && textPart.body.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
        }
      } else if (messageData.payload.body && messageData.payload.body.data) {
        body = Buffer.from(messageData.payload.body.data, 'base64').toString('utf-8');
      }

      // Check for potential phishing
      const suspiciousWords = ['password', 'verify', 'account', 'login', 'urgent', 'security'];
      const foundWords = suspiciousWords.filter(word => 
        (subject + ' ' + body).toLowerCase().includes(word)
      );
      const isPotentialPhishing = foundWords.length > 1;
      const phishingScore = foundWords.length;

      emails.push({
        messageId: message.id,
        subject,
        from,
        to,
        date: new Date(date),
        body,
        isRead: !messageData.labelIds.includes('UNREAD'),
        isPotentialPhishing,
        phishingScore,
        phishingReasons: foundWords,
      });
    }

    return emails;
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
    throw error;
  }
}

// Function to fetch emails from Outlook
async function fetchOutlookEmails(user: any) {
  try {
    // Refresh token if needed
    user = await refreshTokenIfNeeded(user);
    
    const response = await axios.get(
      'https://graph.microsoft.com/v1.0/me/messages?$top=20&$select=id,subject,bodyPreview,from,toRecipients,receivedDateTime,isRead,body',
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    const messages = response.data.value || [];
    
    const emails = messages.map((message: any) => {
      // Check for potential phishing
      const content = message.subject + ' ' + message.bodyPreview;
      const suspiciousWords = ['password', 'verify', 'account', 'login', 'urgent', 'security'];
      const foundWords = suspiciousWords.filter(word => 
        content.toLowerCase().includes(word)
      );
      const isPotentialPhishing = foundWords.length > 1;
      const phishingScore = foundWords.length;

      return {
        messageId: message.id,
        subject: message.subject || '(No Subject)',
        from: message.from?.emailAddress?.address || '',
        to: message.toRecipients?.[0]?.emailAddress?.address || '',
        date: new Date(message.receivedDateTime),
        body: message.body?.content || message.bodyPreview || '',
        isRead: message.isRead,
        isPotentialPhishing,
        phishingScore,
        phishingReasons: foundWords,
      };
    });
    console.log(emails);
    return emails;
    
  } catch (error) {
    console.error('Error fetching Outlook emails:', error);
    throw error;
  }
}

// Main function to fetch emails for all users
export async function fetchEmailsForAllUsers() {
  try {
    await dbConnect();
    
    // Get all users with OAuth providers and valid tokens
    const users = await User.find({
      $or: [
        { provider: 'google', accessToken: { $exists: true, $ne: null } },
        { provider: 'azure-ad', accessToken: { $exists: true, $ne: null } }
      ]
    });
    
    console.log(`Fetching emails for ${users.length} users`);
    
    for (const user of users) {
      try {
        let emails = [];
        
        if (user.provider === 'google') {
          emails = await fetchGmailEmails(user);
        } else if (user.provider === 'azure-ad') {
          emails = await fetchOutlookEmails(user);
        }
        
        // Store emails in the database
        for (const email of emails) {
          // Check if email already exists
          const existingEmailIndex = user.emails.findIndex(
            (e: any) => e.messageId === email.messageId
          );
          
          if (existingEmailIndex === -1) {
            // Add new email
            user.emails.push(email);
          } else {
            // Update existing email
            user.emails[existingEmailIndex] = {
              ...user.emails[existingEmailIndex],
              ...email,
            };
          }
        }
        
        user.lastEmailSync = new Date();
        await user.save();
        
        console.log(`Successfully fetched ${emails.length} emails for user ${user.email}`);
      } catch (error) {
        console.error(`Error fetching emails for user ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in fetchEmailsForAllUsers:', error);
  }
}

// Function to start the background email fetching service
export function startEmailFetchingService() {
  // Fetch emails every 30 minutes
  const FETCH_INTERVAL = 3 * 60 * 1000; // 3 minutes in milliseconds
  
  console.log('Starting email fetching service...');
  
  // Fetch emails immediately on startup
  fetchEmailsForAllUsers().catch(err => 
    console.error('Error in initial email fetch:', err)
  );
  
  // Set up interval for regular fetching
  const intervalId = setInterval(() => {
    fetchEmailsForAllUsers().catch(err => 
      console.error('Error in scheduled email fetch:', err)
    );
  }, FETCH_INTERVAL);
  
  return intervalId;
}