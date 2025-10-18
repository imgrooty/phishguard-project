import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions} from '../../auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  provider?: string;
}

export async function GET(req: NextRequest) {
  try {
    // ✅ Use the config object from your handler
    const session = (await getServerSession(
      authOptions 
    )) as {
      user?: SessionUser;
      access_token?: string;
      refresh_token?: string;
      provider?: string;
    } | null;

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized: No valid session found' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Pull provider from either root or user object
    const provider = (session as any).provider || session.user.provider;
    console.log(session);

    // ✅ Get the 'since' parameter to fetch only new emails
    const { searchParams } = new URL(req.url);
    const sinceParam = searchParams.get('since');
    
    let fetchEndpoint = '';
    if (provider === 'google') {
      fetchEndpoint = '/api/emails/gmail';
    } else if (provider === 'azure-ad') {
      fetchEndpoint = '/api/emails/outlook';
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email fetching not supported for credential login',
        emails: [],
        provider: session.user.provider,
      });
    }

    // ✅ Add since parameter to fetch endpoint if provided
    const fetchUrl = sinceParam 
      ? `${fetchEndpoint}?since=${encodeURIComponent(sinceParam)}`
      : fetchEndpoint;

    const baseUrl = process.env.NEXTAUTH_URL || '';
    fetch(`${baseUrl}${fetchUrl}`, {
      headers: { Cookie: req.headers.get('cookie') || '' },
    }).catch((err) => console.error('Background email fetch error:', err));

    // ✅ Filter emails based on 'since' parameter if provided
    let emailsToReturn = user.emails || [];
    
    if (sinceParam) {
      const sinceDate = new Date(sinceParam);
      emailsToReturn = emailsToReturn.filter(
        (email: { date: string | Date }) => new Date(email.date) > sinceDate
      );
      console.log(`Returning ${emailsToReturn.length} new emails since ${sinceDate}`);
    }

    // ✅ Sort emails by date (newest first)
    const sortedEmails = emailsToReturn.sort(
      (a: { date: string | Date }, b: { date: string | Date }) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      success: true,
      provider: session.user.provider,
      lastSync: new Date().toISOString(), // ✅ Always return current timestamp
      emails: sortedEmails,
      isIncremental: !!sinceParam, // ✅ Flag to indicate if this is incremental fetch
      totalEmailsInDb: user.emails?.length || 0, // ✅ Helpful for debugging
    });
  } catch (error) {
    console.error('Error in fetch emails endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}