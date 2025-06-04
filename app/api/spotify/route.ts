// app/api/spotify/route.ts

import { NextResponse } from 'next/server';
import { getTrendingSongs } from '../../../utils/spotify/spotify';

export async function GET() {
  try {
    const songs = await getTrendingSongs();
    return NextResponse.json({ songs });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 });
  }
}