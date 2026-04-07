import { NextResponse } from 'next/server';
import { dbConnect, User } from '../../../lib/mongodb';
import bcrypt from 'bcryptjs'; // IMPORT INI

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // 1. Cek apakah email udah dipakai
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email udah terdaftar bro!' }, { status: 400 });
    }

    // 2. ACAK PASSWORD DI SINI (Proses Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Simpan ke database pakai password yang udah diacak
    const newUser = await User.create({ 
      email, 
      password: hashedPassword 
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Akun berhasil dibuat!',
      user: { id: newUser._id, email: newUser.email } // Jangan pernah ngirim password balik ke frontend
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}