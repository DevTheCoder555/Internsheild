import { NextRequest, NextResponse } from "next/server";
import { analyzeContent } from "@/lib/gemini";
import { sanitizeInput } from "@/lib/utils";
import type { ScanInput } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, platform } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: "Text is required." },
        { status: 400 }
      );
    }

    const sanitized = sanitizeInput(text);

    if (sanitized.length < 10) {
      return NextResponse.json(
        { success: false, error: "Text must be at least 10 characters." },
        { status: 400 }
      );
    }

    if (sanitized.length > 10000) {
      return NextResponse.json(
        { success: false, error: "Text is too long. Maximum 10,000 characters." },
        { status: 400 }
      );
    }

    const input: ScanInput = {
      type: "text",
      text: sanitized,
      platform: platform || "unknown",
    };

    const result = await analyzeContent(input);

    // Save to database if user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("scan_reports").insert({
        user_id: user.id,
        scan_type: "text",
        input_text: sanitized,
        scam_score: result.scam_score,
        risk_level: result.risk_level,
        red_flags: result.red_flags,
        ai_explanation: result.ai_explanation,
        recommendations: result.recommendations,
        extracted_text: sanitized,
        raw_ai_response: result.raw_response,
        company_name: result.extracted_info?.company_name || null,
        recruiter_name: result.extracted_info?.recruiter_name || null,
        recruiter_email: result.extracted_info?.recruiter_email || null,
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API scan error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
