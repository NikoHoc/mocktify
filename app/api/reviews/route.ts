import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabaseClient";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const song_id = searchParams.get("song_id");

  if (!song_id) {
    return NextResponse.json({ error: "Missing song_id parameter" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .select("id, created_at, song_id, content")
    .eq("song_id", song_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ reviews: data });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { song_id, content } = body;

    if (!song_id || !content) {
      return NextResponse.json({ error: "Missing song_id or content" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([{ song_id, content }])
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
