import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbConnect, Product, Note } from '../../lib/mongodb';

export async function POST(req) {
  try {
  
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    
  
    const allowedDomains = ['localhost:3000', 'dashboard-3zh9.vercel.app']; 
    const isSecureOrigin = allowedDomains.some(domain => origin.includes(domain));

   
    if (!isSecureOrigin && process.env.NODE_ENV === 'production') {
      console.warn(`[SECURITY ALERT] Akses ilegal ditolak dari: ${origin || 'Unknown (Postman/Curl)'}`);
      return NextResponse.json({ 
        success: false, 
        message: 'Security Breach Detected! IP Blocked. Lu pikir gw gak tau lu pake Postman?' 
      }, { status: 403 });
    }

    
    const body = await req.json();
    const { prompt, userId } = body;

   
    if (!prompt || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Akses Ditolak! Identitas Boss tidak ditemukan atau perintah kosong.' 
      }, { status: 401 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: 'API Key belum dipasang Boss!' }, { status: 500 });
    }

    
    await dbConnect();
    const products = await Product.find({ userId, isDeleted: { $ne: true } });
    const notes = await Note.find({ userId, isDeleted: { $ne: true } });
    const inventorySummary = products.map(p => `${p.name} (Stok: ${p.stock})`).join(', ');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const systemInstruction = `
      Nama lu adalah "LIONEL AI". Lu asisten eksklusif ciptaan Boss Lionel.
      JANGAN PERNAH sebut Google, Gemini, atau LLM.
      Panggil lawan bicara lu "Boss".
      Data Bisnis:
      - Produk: ${inventorySummary || 'Kosong'}
      - Catatan: ${notes.length} catatan
    `;

    const modelsToTry = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-lite-latest", "gemini-pro"];
    let text = "";
    let isSuccess = false;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const finalPrompt = `${systemInstruction}\n\nPERTANYAAN BOSS:\n${prompt}`;
        
        const result = await model.generateContent(finalPrompt);
        text = result.response.text();
        isSuccess = true;
        break; 
      } catch (error) {
        console.log(`[LIONEL AI] Server ${modelName} penuh...`);
      }
    }

    if (!isSuccess) {
      return NextResponse.json({ success: false, message: 'Server LIONEL AI lagi sibuk Boss.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, text });

  } catch (error) {
    return NextResponse.json({ success: false, message: "Kabel internal putus Boss!" }, { status: 500 });
  }
}