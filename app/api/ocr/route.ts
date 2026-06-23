import { NextRequest, NextResponse } from "next/server";
import { extractTextFromImage } from "@/lib/ocr";
import { analyzeContent } from "@/lib/gemini";
import type { ScanInput } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;
    const scanType = (formData.get("scanType") as string) || "screenshot";

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: "Image file is required." },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type." },
        { status: 400 }
      );
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    // OCR extraction
    const ocrResult = await extractTextFromImage(imageFile);

    if (!ocrResult.text || ocrResult.text.length < 5) {
      return NextResponse.json(
        { success: false, error: "Could not extract enough text from image." },
        { status: 422 }
      );
    }

    // AI analysis
    const input: ScanInput = {
      type: scanType as ScanInput["type"],
      text: ocrResult.text,
    };

    const result = await analyzeContent(input);

    // Save to database
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("scan_reports").insert({
        user_id: user.id,
        scan_type: scanType,
        input_text: ocrResult.text,
        scam_score: result.scam_score,
        risk_level: result.risk_level,
        red_flags: result.red_flags,
        ai_explanation: result.ai_explanation,
        recommendations: result.recommendations,
        extracted_text: ocrResult.text,
        raw_ai_response: result.raw_response,
        company_name: result.extracted_info?.company_name || null,
        recruiter_name: result.extracted_info?.recruiter_name || null,
        recruiter_email: result.extracted_info?.recruiter_email || null,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        extracted_text: ocrResult.text,
        ocr_confidence: ocrResult.confidence,
      },
    });
  } catch (error) {
    console.error("API OCR error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
