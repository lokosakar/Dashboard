import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbConnect, Product, Note } from '../../lib/mongodb';

export async function POST(req) {
  try {
    const { prompt, userId } = await req.json();
    await dbConnect();
    
    // Tarik data buat konteks
    const products = await Product.find({ userId, isDeleted: { $ne: true } });
    const notes = await Note.find({ userId, isDeleted: { $ne: true } });
    const inventorySummary = products.map(p => `${p.name} (Stok: ${p.stock})`).join(', ');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // KUNCINYA DI SINI: Instruksi dibikin lebih "Open Minded"
    const systemInstruction = `
      Lu adalah 'LIONEL AI', asisten pribadi Boss Lionel yang serba tahu, santai, tapi profesional.
      
      TUGAS LU:
      1. Jawab apapun pertanyaan Boss (hewan, koding, masak, apa aja) secara akurat.
      2. Lu punya akses ke data bisnis Boss:
         - Produk: ${inventorySummary || 'Gudang kosong'}
         - Total Catatan: ${notes.length}
      3. Kalau Boss nanya soal stok atau data bisnis, gunakan data di atas.
      4. Panggil Boss dengan sebutan "Boss".
    `;

    // Kita pakai model fallback biar anti-error 503
    const models = ["gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-flash-lite-latest"];
    let text = "";
    let success = false;

    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        const result = await model.generateContent(`${systemInstruction}\n\nPertanyaan: ${prompt}`);
        text = result.response.text();
        success = true;
        break;
      } catch (e) { console.log(`Model ${m} sibuk, coba lainnya...`); }
    }

    return NextResponse.json({ success, text: success ? text : "Waduh Boss, server Google lagi penuh. Coba sedetik lagi!" });
  } catch (error) {
    return NextResponse.json({ success: false, text: "Error server Boss!" });
  }
}