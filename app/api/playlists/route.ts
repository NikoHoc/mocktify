import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '../../lib/supabaseClient';

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

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const user_id = formData.get('user_id');
    const imageFile = formData.get('image');

    if (!name || !user_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let imagePath = null;
    if (imageFile && imageFile instanceof File) {
      const filename = `${Date.now()}-${imageFile.name}`;
      imagePath = await saveFile(imageFile, filename);
    }

    // Insert playlist into Supabase
    const { data, error } = await supabase
      .from('playlist')
      .insert([
        {
          name,
          description: description || null,
          image: imagePath,
          user_id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ playlist: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
