import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { EmailService } from "@/lib/emailService";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const emailService = EmailService.getInstance();

    // Get user and their emails
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`🔄 Re-analyzing ${user.emails.length} emails for ${session.user.email}`);

    // Clean up any emails missing required fields
    let cleanedCount = 0;
    user.emails = user.emails.map((email, index) => {
      if (!email.messageId || !email.date) {
        console.warn(`🧹 Cleaning up email ${index + 1}: Adding missing required fields`);
        cleanedCount++;
        return {
          ...email,
          messageId: email.messageId || `cleaned-${Date.now()}-${index}`,
          date: email.date || new Date(),
          subject: email.subject || "(No Subject)",
          from: email.from || "unknown@unknown.com",
          to: email.to || "unknown@unknown.com",
          body: email.body || "",
          isRead: email.isRead || false,
          isPotentialPhishing: email.isPotentialPhishing || false,
          phishingScore: email.phishingScore || 0,
          phishingReasons: email.phishingReasons || []
        };
      }
      return email;
    });

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} emails with missing required fields`);
      await user.save();
    }

    let updatedCount = 0;
    const errors: string[] = [];

    // Re-analyze each email
    for (let i = 0; i < user.emails.length; i++) {
      const email = user.emails[i];
      
      try {
        console.log(`🔍 Re-analyzing email ${i + 1}/${user.emails.length}: ${email.subject}`);
        
        // Validate email has required fields before processing
        if (!email.messageId || !email.date) {
          console.warn(`⚠️ Skipping email ${i + 1}: Missing required fields (messageId: ${!!email.messageId}, date: ${!!email.date})`);
          continue;
        }
        
        // Extract links from email body
        const linkRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
        const links = email.body.match(linkRegex) || [];

        // Perform fresh analysis
        const analysis = await emailService.analyzePhishing({
          from: email.from,
          subject: email.subject,
          body: email.body,
          links
        });

        // Update email with new analysis - ensure all required fields are present
        user.emails[i] = {
          messageId: email.messageId || `temp-${Date.now()}-${i}`, // Ensure messageId is present
          subject: email.subject || "(No Subject)",
          from: email.from || "unknown@unknown.com",
          to: email.to || "unknown@unknown.com",
          date: email.date || new Date(), // Ensure date is present
          body: email.body || "",
          isRead: email.isRead || false,
          isPotentialPhishing: analysis.isPotentialPhishing,
          phishingScore: analysis.phishingScore,
          phishingReasons: analysis.phishingReasons,
          prediction: analysis.mlPrediction || (analysis.isPotentialPhishing ? "Potential Phishing" : "Safe Email"),
          confidence: analysis.confidence,
          model_used: analysis.modelUsed,
          virusTotalResult: analysis.virusTotalResult,
          googleSafeBrowsingResult: analysis.googleSafeBrowsingResult,
          heuristicScore: analysis.heuristicScore,
          mlScore: analysis.mlScore
        };

        updatedCount++;
        
        // Small delay to avoid overwhelming the ML API
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        const errorMsg = `Failed to analyze email ${email.subject}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // Save updated user
    await user.save();

    console.log(`✅ Re-analysis complete: ${updatedCount} emails updated, ${errors.length} errors`);

    return NextResponse.json({
      success: true,
      totalEmails: user.emails.length,
      cleanedCount,
      updatedCount,
      errors,
      message: `Successfully re-analyzed ${updatedCount} emails${cleanedCount > 0 ? ` and cleaned up ${cleanedCount} emails` : ''}`
    });

  } catch (error) {
    console.error("❌ Re-analysis error:", error);
    return NextResponse.json({ 
      error: "Failed to re-analyze emails",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
