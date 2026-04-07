// src/app/api/notes/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect, Note } from '../../../lib/mongodb';

// PUT: Untuk Update / Edit Note
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // params.id otomatis diambil dari nama folder [id]
    const { id } = params; 
    const body = await req.json();

    // Cari berdasarkan ID dan update isinya
    const updatedNote = await Note.findByIdAndUpdate(id, body, { new: true });

    if (!updatedNote) {
      return NextResponse.json({ success: false, message: 'Note tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedNote });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Untuk Hapus Note
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return NextResponse.json({ success: false, message: 'Note tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Note berhasil dihapus' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}