import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

function verifyToken(request) {
  const token = request.headers.get('x-admin-token');
  const adminPath = path.join(process.cwd(), 'public', 'data', 'admin.json');
  const adminData = JSON.parse(fs.readFileSync(adminPath, 'utf-8'));
  return token === adminData.password;
}

export async function POST(request) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const uniqueName = `${baseName}_${Date.now()}${ext}`;

    const uploadPath = path.join(process.cwd(), 'public', uniqueName);
    await writeFile(uploadPath, buffer);

    return NextResponse.json({ url: `/${uniqueName}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
