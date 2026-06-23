import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeInput } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

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

    return NextResponse.json({
      success: true,
      data,
      total: count || 0,
      page,
      pageSize: limit,
    });
  } catch (error) {
    console.error("API community GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, companyName, recruiterName, recruiterContact } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { success: false, error: "Title, description, and category are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("community_reports")
      .insert({
        user_id: user.id,
        title: sanitizeInput(title),
        description: sanitizeInput(description),
        category,
        company_name: companyName ? sanitizeInput(companyName) : null,
        recruiter_name: recruiterName ? sanitizeInput(recruiterName) : null,
        recruiter_contact: recruiterContact ? sanitizeInput(recruiterContact) : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("API community POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
