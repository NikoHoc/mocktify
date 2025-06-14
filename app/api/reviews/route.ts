import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

async function getUserFromRequest(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const song_id = searchParams.get("song_id");

  if (!song_id) {
    return NextResponse.json({ error: "Missing song_id parameter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("review")
    .select("id, created_at, song_id, content, user_id")
    .eq("song_id", song_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews: data });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { song_id, content } = body;

    if (!song_id || !content) {
      return NextResponse.json({ error: "Missing song_id or content" }, { status: 400 });
    }

    // Check if user already reviewed this song
    // Removed to allow multiple reviews per user per song

    // if (existingError && existingError.code !== "PGRST116") {
    //   // PGRST116 means no rows found, which is expected if no review exists
    //   return NextResponse.json({ error: existingError.message }, { status: 500 });
    // }

    // if (existingReview) {
    //   return NextResponse.json({ error: "User has already reviewed this song" }, { status: 400 });
    // }

    const { data, error } = await supabase
      .from("review")
      .insert([{ song_id, content, user_id: user.id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { review_id, content } = body;

    if (!review_id || !content) {
      return NextResponse.json({ error: "Missing review_id or content" }, { status: 400 });
    }

    // Check if the review belongs to the user
    const { data: existingReview, error: existingError } = await supabase
      .from("review")
      .select("user_id")
      .eq("id", review_id)
      .single();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existingReview.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to edit this review" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("review")
      .update({ content })
      .eq("id", review_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const review_id = searchParams.get("review_id");

    if (!review_id) {
      return NextResponse.json({ error: "Missing review_id parameter" }, { status: 400 });
    }

    // Check if the review belongs to the user
    const { data: existingReview, error: existingError } = await supabase
      .from("review")
      .select("user_id")
      .eq("id", review_id)
      .single();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (existingReview.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this review" }, { status: 403 });
    }

    const { error } = await supabase
      .from("review")
      .delete()
      .eq("id", review_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
