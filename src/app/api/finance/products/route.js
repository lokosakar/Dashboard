import { NextResponse } from 'next/server';
import { dbConnect, Product } from '../../../lib/mongodb';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    // Tarik data yang belum dihapus aja
    const products = await Product.find({ userId, isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    const product = await Product.create(data);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// FUNGSI DELETE SAKTI
export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Product.findByIdAndUpdate(id, { isDeleted: true });
    return NextResponse.json({ success: true, message: 'Barang masuk tong sampah!' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}