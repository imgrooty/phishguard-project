import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { EmailService } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, from, bodyText, links } = body || {};

    if (!subject || !from || !bodyText) {
      return NextResponse.json({ 
        error: 'Missing required fields: subject, from, bodyText' 
      }, { status: 400 });
    }

    const emailService = EmailService.getInstance();
    
    // Perform comprehensive phishing analysis
    const analysis = await emailService.analyzePhishing({
      from,
      subject,
      body: bodyText,
      links: links || []
    });

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
    });
  } catch (err) {
    console.error('Phishing analysis error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}