import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const {
      to,
      subject,
      html,
      text,
      templateName,
      templateId,
      recipientName,
      recipientCompany,
      campaignName,
    } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, and html/text" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: "Nurture Hub <noreply@aimarketingtools.directory>", // Using your verified domain
      to: [to],
      subject: subject,
      html: html,
      text: text,
    });

    // Record the email in Supabase
    const { error: dbError } = await supabase.from("email_records").insert({
      recipient_email: to,
      recipient_name: recipientName || null,
      recipient_company: recipientCompany || null,
      template_name: templateName || "Custom Template",
      template_id: templateId || "custom",
      subject: subject,
      sent_at: new Date().toISOString(),
      status: "sent",
      campaign_name: campaignName || "Default Campaign",
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the email send if database recording fails
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error sending email:", error);

    // Record failed email attempt
    try {
      const {
        to,
        templateName,
        templateId,
        recipientName,
        recipientCompany,
        campaignName,
      } = await request.json();

      await supabase.from("email_records").insert({
        recipient_email: to,
        recipient_name: recipientName || null,
        recipient_company: recipientCompany || null,
        template_name: templateName || "Custom Template",
        template_id: templateId || "custom",
        subject: "Failed to send",
        sent_at: new Date().toISOString(),
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
        campaign_name: campaignName || "Default Campaign",
      });
    } catch (dbError) {
      console.error("Failed to record error in database:", dbError);
    }

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
