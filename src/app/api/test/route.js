import { NextResponse } from 'next/server';

export async function GET() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    return NextResponse.json({ 
      STATUS: "NEXT.JS YANG BEGO", 
      ALASAN: "File .env.local lu bener-bener gak kebaca sama sekali." 
    });
  }

  return NextResponse.json({ 
    STATUS: "ENV KEBACA AMAN!", 
    URI_LU: uri.substring(0, 20) + "..." // Ditampilin dikit biar lu yakin
  });
}