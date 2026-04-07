import { NextResponse } from 'next/server';
import { dbConnect, Note } from '../.././lib/mongodb';

export async function GET(req) {
  try {
    await dbConnect();
    // Idealnya userId diambil dari token JWT di Headers, ini kita mock ambil dari query params buat contoh
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); 

    if (!userId) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, title, content, tags } = body;

    const newNote = await Note.create({ userId, title, content, tags });
    return NextResponse.json({ success: true, data: newNote }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}