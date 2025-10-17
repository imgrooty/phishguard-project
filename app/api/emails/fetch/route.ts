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
    

    const baseUrl = process.env.NEXTAUTH_URL || '';
    fetch(`${baseUrl}${fetchEndpoint}`, {
      headers: { Cookie: req.headers.get('cookie') || '' },
    }).catch((err) => console.error('Background email fetch error:', err));

    return NextResponse.json({
      success: true,
      provider: session.user.provider,
      lastSync: user.lastEmailSync,
      emails: user.emails.sort(
        (a: { date: string }, b: { date: string }) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    });
  } catch (error) {
    console.error('Error in fetch emails endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
