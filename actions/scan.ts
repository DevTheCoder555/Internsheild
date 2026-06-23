"use server";

import { createClient } from "@/lib/supabase/server";
import { analyzeContent } from "@/lib/gemini";
import { extractTextFromImage } from "@/lib/ocr";
import { sanitizeInput } from "@/lib/utils";
import type { ScanResult, ScanInput } from "@/types";
import { revalidatePath } from "next/cache";

export async function scanTextAction(
  text: string,
  platform?: string
): Promise<{ success: boolean; result?: ScanResult; reportId?: string; error?: string }> {
  try {
    const sanitizedText = sanitizeInput(text);

    if (!sanitizedText || sanitizedText.length < 10) {
      return { success: false, error: "Please enter at least 10 characters to analyze." };
    }

    if (sanitizedText.length > 10000) {
      return { success: false, error: "Text is too long. Maximum 10,000 characters allowed." };
    }

    const input: ScanInput = {
      type: "text",
      text: sanitizedText,
      platform: platform || "unknown",
    };

    const result = await analyzeContent(input);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: report, error: dbError } = await supabase
      .from("scan_reports")
      .insert({
        user_id: user?.id || null,
        scan_type: "text",
        input_text: sanitizedText,
        scam_score: result.scam_score,
        risk_level: result.risk_level,
        red_flags: result.red_flags,
        ai_explanation: result.ai_explanation,
        recommendations: result.recommendations,
        extracted_text: sanitizedText,
        raw_ai_response: result.raw_response,
        company_name: result.extracted_info?.company_name || null,
        recruiter_name: result.extracted_info?.recruiter_name || null,
        recruiter_email: result.extracted_info?.recruiter_email || null,
      })
      .select("id")
      .single();

    if (user && !dbError) {
      await supabase
        .from("users")
        .update({ scan_count: (await supabase.from("users").select("scan_count").eq("id", user.id).single()).data?.scan_count + 1 })
        .eq("id", user.id);
    }

    revalidatePath("/dashboard");

    return { success: true, result, reportId: report?.id };
  } catch (error) {
    console.error("scanTextAction error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

export async function scanImageAction(
  formData: FormData
): Promise<{ success: boolean; result?: ScanResult; extractedText?: string; reportId?: string; error?: string }> {
  try {
    const imageFile = formData.get("image") as File;
    const scanType = (formData.get("scanType") as string) || "screenshot";
    const platform = (formData.get("platform") as string) || "unknown";

    if (!imageFile || imageFile.size === 0) {
      return { success: false, error: "Please upload an image file." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/bmp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return { success: false, error: "Invalid file type. Please upload JPEG, PNG, WebP, or BMP images." };
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return { success: false, error: "File is too large. Maximum size is 10MB." };
    }

    const ocrResult = await extractTextFromImage(imageFile);

    if (!ocrResult.text || ocrResult.text.length < 5) {
      return { success: false, error: "Could not extract enough text from the image. Please upload a clearer image." };
    }

    const input: ScanInput = {
      type: scanType as ScanInput["type"],
      text: ocrResult.text,
      platform,
    };

    const result = await analyzeContent(input);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: report, error: dbError } = await supabase
      .from("scan_reports")
      .insert({
        user_id: user?.id || null,
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
      })
      .select("id")
      .single();

    if (user && !dbError) {
      const { data: userData } = await supabase
        .from("users")
        .select("scan_count")
        .eq("id", user.id)
        .single();

      await supabase
        .from("users")
        .update({ scan_count: (userData?.scan_count || 0) + 1 })
        .eq("id", user.id);
    }

    revalidatePath("/dashboard");

    return {
      success: true,
      result,
      extractedText: ocrResult.text,
      reportId: report?.id,
    };
  } catch (error) {
    console.error("scanImageAction error:", error);
    return { success: false, error: "An unexpected error occurred during image analysis." };
  }
}

export async function getScanReportsAction(
  page: number = 1,
  limit: number = 10
): Promise<{ success: boolean; data?: unknown[]; total?: number; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabase
      .from("scan_reports")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return { success: true, data: data || [], total: count || 0 };
  } catch (error) {
    console.error("getScanReportsAction error:", error);
    return { success: false, error: "Failed to fetch scan reports." };
  }
}

export async function deleteScanReportAction(
  reportId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const { error } = await supabase
      .from("scan_reports")
      .delete()
      .eq("id", reportId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("deleteScanReportAction error:", error);
    return { success: false, error: "Failed to delete report." };
  }
}
