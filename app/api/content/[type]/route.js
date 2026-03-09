import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

// Helper to get data file path
function getDataPath(type) {
  return join(process.cwd(), 'public', 'data', `${type}.json`);
}

// Helper to read JSON file
function readDataFile(type) {
  try {
    const path = getDataPath(type);
    const data = readFileSync(path, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${type}.json:`, error);
    return type === 'admin' ? { password: 'admin123' } : [];
  }
}

// Helper to write JSON file
function writeDataFile(type, data) {
  try {
    const path = getDataPath(type);
    writeFileSync(path, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${type}.json:`, error);
    return false;
  }
}

// Helper to verify admin token - read password from admin.json
function verifyToken(request) {
  const token = request.headers.get('x-admin-token');
  const adminData = readDataFile('admin');
  return token === adminData.password;
}

export async function GET(request, { params }) {
  const { type } = await params;

  // Validate type - allow reading all content types
  if (!['projects', 'skills', 'social', 'admin'].includes(type)) {
    return Response.json({ error: 'Invalid content type' }, { status: 400 });
  }

  const data = readDataFile(type);
  return Response.json(data);
}

export async function POST(request, { params }) {
  const { type } = await params;

  // Verify admin token
  if (!verifyToken(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate type - allow writing to certain types
  if (!['projects', 'skills', 'social', 'admin'].includes(type)) {
    return Response.json({ error: 'Invalid content type' }, { status: 400 });
  }

  try {
    const data = await request.json();

    // If updating projects, delete orphaned local images
    if (type === 'projects') {
      const oldProjects = readDataFile('projects');
      const newImages = new Set(data.map((p) => p.image).filter(Boolean));
      for (const oldProject of oldProjects) {
        const img = oldProject.image;
        // Only delete if it's a local file (starts with /) and not used by any remaining project
        if (img && img.startsWith('/') && !img.startsWith('/data/') && !newImages.has(img)) {
          const filePath = join(process.cwd(), 'public', img);
          if (existsSync(filePath)) {
            unlinkSync(filePath);
          }
        }
      }
    }

    const success = writeDataFile(type, data);

    if (!success) {
      return Response.json({ error: 'Failed to save data' }, { status: 500 });
    }

    return Response.json({ success: true, message: `${type} updated successfully` });
  } catch (error) {
    return Response.json({ error: 'Invalid JSON data' }, { status: 400 });
  }
}
