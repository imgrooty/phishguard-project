import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { EmailService } from "@/lib/emailService";

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin');
  const isExtension = !!origin && origin.startsWith('chrome-extension://');

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (isExtension && origin) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = '*';
  }

  return new NextResponse(null, {
    status: 204,
    headers
  });
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin');
    const isExtension = !!origin && origin.startsWith('chrome-extension://');

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      const headers: Record<string, string> = {};
      if (isExtension && origin) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Credentials'] = 'true';
      }
      return NextResponse.json({ error: 'Unauthorized' }, {
        status: 401,
        headers
      });
    }

    const body = await req.json();
    const {
      subject = "Browser Extension Analysis",
      from = "External Source",
      bodyText,
      links
    } = body || {};

    if (!bodyText) {
      const headers: Record<string, string> = {};
      if (isExtension && origin) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Credentials'] = 'true';
      }
      return NextResponse.json({ 
        error: 'Missing required field: bodyText'
      }, {
        status: 400,
        headers
      });
    }

    const emailService = EmailService.getInstance();
    
    // Perform comprehensive phishing analysis
    const analysis = await emailService.analyzePhishing({
      from,
      subject,
      body: bodyText,
      links: links || []
    });

    const responseHeaders: Record<string, string> = {};
    if (isExtension && origin) {
      responseHeaders['Access-Control-Allow-Origin'] = origin;
      responseHeaders['Access-Control-Allow-Credentials'] = 'true';
    }

    return NextResponse.json({
      success: true,
      isPotentialPhishing: analysis.isPotentialPhishing,
      phishingScore: analysis.phishingScore,
      phishingReasons: analysis.phishingReasons,
      confidence: analysis.confidence,
      modelUsed: analysis.modelUsed,
      heuristicScore: analysis.heuristicScore,
      mlScore: analysis.mlScore,
      virusTotalResult: analysis.virusTotalResult
    }, {
      headers: responseHeaders
    });
  } catch (err) {
    console.error('Phishing analysis error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}