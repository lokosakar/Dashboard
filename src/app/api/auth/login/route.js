import { NextResponse } from 'next/server';
import { dbConnect, User } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs'; // IMPORT INI

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Email salah atau belum daftar!' }, { status: 400 });
    }

    // 2. BANDINGIN PASSWORD KETIKAN USER SAMA DATABASE
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    
    if (!isPasswordMatch) {
      return NextResponse.json({ success: false, message: 'Password salah bro!' }, { status: 400 });
    }

    // 3. Kalau cocok, kasih akses login
    return NextResponse.json({ 
      success: true, 
      message: 'Login sukses!',
      user: { id: user._id, email: user.email } 
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}