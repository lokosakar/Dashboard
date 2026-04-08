import { NextResponse } from 'next/server';
import { dbConnect, Note } from '../../lib/mongodb';

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const notes = await Note.find({ userId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: notes });
}

export async function POST(req) {
  await dbConnect();
  const data = await req.json();
  const note = await Note.create(data);
  return NextResponse.json({ success: true, data: note });
}

export async function PUT(req) {
  await dbConnect();
  const data = await req.json();
  const { id, ...updateData } = data;
  const note = await Note.findByIdAndUpdate(id, updateData, { new: true });
  return NextResponse.json({ success: true, data: note });
}

export async function DELETE(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await Note.findByIdAndUpdate(id, { isDeleted: true });
  return NextResponse.json({ success: true });
}