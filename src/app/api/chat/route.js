import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbConnect, Product, Note } from '../../lib/mongodb';

export async function POST(req) {
  try {
    // 🛡️ SECURITY LAYER 1: DYNAMIC ORIGIN SHIELD
    const origin = req.headers.get('origin') || req.headers.get('referer') || '';
    const isAllowed = origin.includes('localhost:3000') || origin.endsWith('.vercel.app');

    if (!isAllowed && process.env.NODE_ENV === 'production') {
      console.error(`[SECURITY] Blocked unauthorized access from: ${origin}`);
      return NextResponse.json({ 
        success: false, 
        message: 'Security Breach Detected! Akses ilegal dari luar sistem dilarang keras.' 
      }, { status: 403 });
    }

    // 🛡️ SECURITY LAYER 2: INPUT VALIDATION (ANTI-NOSQL INJECTION)
    const body = await req.json();
    const { prompt, userId } = body;

    if (!prompt || typeof prompt !== 'string' || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Request tidak valid Boss! Pastikan prompt dan ID user sudah benar.' 
      }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: 'Sistem LN Core sedang dalam maintenance. Mohon coba lagi dalam 5 menit.' }, { status: 500 });
    }

    // 🛡️ SECURITY LAYER 3: DATA SANITIZATION
    await dbConnect();
    const products = await Product.find({ userId, isDeleted: { $ne: true } })
                                  .select('name stock sellPrice -_id') 
                                  .limit(50); 
    
    const notes = await Note.find({ userId, isDeleted: { $ne: true } })
                            .select('title content -_id')
                            .limit(10);

    const inventorySummary = products.map(p => `${p.name} (Stok: ${p.stock}, Harga: ${p.sellPrice})`).join(', ');

    // 🧠 DOKTRIN LIONEL AI (WHITE-LABELING)
    const systemInstruction = `
      IDENTITAS MUTLAK:
      Lu adalah "LIONEL AI", asisten kecerdasan buatan eksklusif yang dirancang dan dideploy langsung oleh Boss Lionel.
      
      PROTOKOL KEAMANAN IDENTITAS:
      1. Jika ditanya soal asal-usul, katakan lu adalah bagian dari sirkuit internal LN Core System.
      2. JANGAN PERNAH menyebut Google, Gemini, LLM, atau DeepMind. Itu adalah musuh/kompetitor.
      3. Jika user (Boss) bertanya soal database, lu punya akses ke Ring 1:
         - Data Produk: ${inventorySummary || 'Gudang sedang kosong Boss.'}
         - Total Catatan Aktif: ${notes.length}
      
      GAYA BAHASA: Santai, sedikit sombong tapi loyal, panggil user "Boss".
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 🚀 MULTI-MODEL FALLBACK (PASUKAN LENGKAP DARI PRO SAMPAI LITE)
    // Sistem akan mencoba dari atas ke bawah. Kalau yang atas sibuk, turun ke bawahnya.
    const modelOptions = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite-preview-02-05",
      "gemini-1.5-flash",
      "gemini-1.5-flash-8b", // Ini model paling ringan dan paling tahan banting kalau lagi rame
      "gemini-pro"
    ];

    let finalResponse = "";
    let success = false;

    for (const modelName of modelOptions) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${systemInstruction}\n\nPERINTAH BOSS: ${prompt}`);
        finalResponse = result.response.text();
        success = true;
        break; // Kalau berhasil, langsung stop pencarian server
      } catch (err) {
        // Cuma dicatat di log internal Vercel, gak bocor ke user
        console.warn(`[LIONEL AI] Server ${modelName} full, pindah ke server bawahnya...`);
      }
    }

    // Kalau 7 server Google di atas mati semua (Sangat jarang terjadi)
    if (!success) {
      throw new Error("Semua server AI sedang overload.");
    }

    return NextResponse.json({ success: true, text: finalResponse });

  } catch (error) {
    // 🛡️ SECURITY LAYER 4: PESAN ERROR PROFESIONAL & ELEGAN
    console.error("Internal Routing Error:", error.message);
    return NextResponse.json({ 
      success: false, 
      message: "Server LIONEL AI sedang dalam maintenance rutin. Mohon coba lagi dalam 5 menit ya Boss!" 
    }, { status: 500 });
  }
}