"use server";

import { createClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/utils";
import type { CommunityReport, CommunityReportForm } from "@/types";
import { revalidatePath } from "next/cache";

export async function createCommunityReportAction(
  form: CommunityReportForm
): Promise<{ success: boolean; reportId?: string; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required to submit reports." };
    }

    const title = sanitizeInput(form.title);
    const description = sanitizeInput(form.description);

    if (!title || title.length < 5) {
      return { success: false, error: "Title must be at least 5 characters." };
    }

    if (!description || description.length < 20) {
      return { success: false, error: "Description must be at least 20 characters." };
    }

    const { data, error } = await supabase
      .from("community_reports")
      .insert({
        user_id: user.id,
        title,
        description,
        category: form.category,
        company_name: form.companyName ? sanitizeInput(form.companyName) : null,
        recruiter_name: form.recruiterName ? sanitizeInput(form.recruiterName) : null,
        recruiter_contact: form.recruiterContact ? sanitizeInput(form.recruiterContact) : null,
      })
      .select("id")
      .single();

    if (error) throw error;

    await supabase
      .from("users")
      .update({
        report_count: (
          await supabase.from("users").select("report_count").eq("id", user.id).single()
        ).data?.report_count + 1,
      })
      .eq("id", user.id);

    revalidatePath("/community");
    revalidatePath("/dashboard");

    return { success: true, reportId: data.id };
  } catch (error) {
    console.error("createCommunityReportAction error:", error);
    return { success: false, error: "Failed to submit report. Please try again." };
  }
}

export async function getCommunityReportsAction(
  page: number = 1,
  limit: number = 12,
  category?: string,
  search?: string
): Promise<{ success: boolean; data?: CommunityReport[]; total?: number; error?: string }> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("community_reports")
      .select("*, user:users(full_name, avatar_url)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,company_name.ilike.%${search}%`
      );
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { success: true, data: data || [], total: count || 0 };
  } catch (error) {
    console.error("getCommunityReportsAction error:", error);
    return { success: false, error: "Failed to fetch community reports." };
  }
}

export async function upvoteReportAction(
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

    const { data: existingVote } = await supabase
      .from("report_votes")
      .select("vote_type")
      .eq("user_id", user.id)
      .eq("report_id", reportId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === "upvote") {
        await supabase.from("report_votes").delete().eq("user_id", user.id).eq("report_id", reportId);
        await supabase.rpc("decrement_upvotes", { report_id: reportId });
      } else {
        await supabase
          .from("report_votes")
          .update({ vote_type: "upvote" })
          .eq("user_id", user.id)
          .eq("report_id", reportId);
        await supabase.rpc("increment_upvotes", { report_id: reportId });
        await supabase.rpc("decrement_downvotes", { report_id: reportId });
      }
    } else {
      await supabase.from("report_votes").insert({
        user_id: user.id,
        report_id: reportId,
        vote_type: "upvote",
      });
      await supabase.rpc("increment_upvotes", { report_id: reportId });
    }

    revalidatePath("/community");

    return { success: true };
  } catch (error) {
    console.error("upvoteReportAction error:", error);
    return { success: false, error: "Failed to upvote." };
  }
}

export async function getTrendingReportsAction(
  limit: number = 5
): Promise<{ success: boolean; data?: CommunityReport[]; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("community_reports")
      .select("*, user:users(full_name, avatar_url)")
      .order("upvotes", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("getTrendingReportsAction error:", error);
    return { success: false, error: "Failed to fetch trending reports." };
  }
}

export async function searchCompaniesAction(
  query: string
): Promise<{ success: boolean; data?: unknown[]; error?: string }> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("reported_companies")
      .select("*")
      .ilike("name", `%${query}%`)
      .order("report_count", { ascending: false })
      .limit(10);

    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("searchCompaniesAction error:", error);
    return { success: false, error: "Failed to search companies." };
  }
}
