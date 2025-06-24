import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '../../../lib/supabaseClient';

// Helper function to save uploaded file to public folder
async function saveFile(file: File, filename: string) {
  const publicDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const filePath = path.join(publicDir, filename);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

// Helper function to delete file from public folder
function deleteFile(filePath: string) {
  const fullPath = path.join(process.cwd(), 'public', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playlistId = params.id;
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Get existing playlist to find old image path
    const { data: existingPlaylist, error: fetchError } = await supabase
      .from('playlist')
      .select('image')
      .eq('id', playlistId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // Delete old image file if exists and is local
    if (existingPlaylist?.image && existingPlaylist.image.startsWith('/uploads/')) {
      deleteFile(existingPlaylist.image);
    }

    // Save new image file
    const filename = `${playlistId}-${Date.now()}-${imageFile.name}`;
    const newImagePath = await saveFile(imageFile, filename);

    // Update playlist with new image path
    const { data, error: updateError } = await supabase
      .from('playlist')
      .update({ image: newImagePath })
      .eq('id', playlistId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ playlist: data }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
