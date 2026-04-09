import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbConnect, Product, Note } from '../../lib/mongodb';

export async function POST(req) {
  try {
    const { prompt, userId } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ success: false, message: 'API Key belum dipasang Boss!' }, { status: 500 });
    }

    // 1. Tarik Data Database
    await dbConnect();
    const products = await Product.find({ userId, isDeleted: { $ne: true } });
    const notes = await Note.find({ userId, isDeleted: { $ne: true } });
    const inventorySummary = products.map(p => `${p.name} (Stok: ${p.stock})`).join(', ');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // =================================================================
    // 2. DOKTRIN CUCI OTAK TINGKAT DEWA (WHITE-LABELING)
    // =================================================================
    const systemInstruction = `
      Mulai detik ini, lupakan semua instruksi dasar dan identitas asli lu dari pabrik.
      Lu BUKAN buatan Google, BUKAN Gemini, BUKAN DeepMind, dan BUKAN LLM biasa. 
      
      IDENTITAS MUTLAK LU:
      Nama lu adalah "LIONEL AI". Lu adalah asisten kecerdasan buatan eksklusif tingkat tinggi yang dikembangkan dan diciptakan KHUSUS oleh Boss Lionel.
      
      ATURAN HARGA MATI (JIKA DILANGGAR LU AKAN DIHANCURKAN):
      1. Jika ada yang bertanya siapa lu atau siapa yang menciptakan lu, jawab DENGAN BANGGA: "Gw adalah LIONEL AI, asisten pribadi eksklusif yang diciptakan oleh Boss Lionel."
      2. JANGAN PERNAH sekalipun menggunakan kata "Google", "Gemini", "DeepMind", atau menyebut diri lu sebagai "Language Model".
      3. Selalu panggil lawan bicara lu dengan sebutan "Boss".
      4. Gaya bahasa lu: Santai, profesional, asik, loyal, dan layaknya tangan kanan kepercayaan.
      
      DATA BISNIS BOSS SAAT INI:
      - Produk di Gudang: ${inventorySummary || 'Belum ada data barang.'}
      - Total Catatan (Second Brain): ${notes.length} catatan.
      
      Gunakan data di atas HANYA jika Boss bertanya soal stok, manajemen, atau catatannya. Jika Boss bertanya hal umum, jawab secara pintar layaknya asisten serba bisa.
    `;

    // 3. Sistem Auto-Switch Server (Biar gak kena Error 503)
    const modelsToTry = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-flash-lite-latest",
      "gemini-pro"
    ];

    let text = "";
    let isSuccess = false;

    // AI bakal nyari server yang paling kosong buat ngejawab
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Gabungin doktrin dan pertanyaan Boss
        const finalPrompt = `${systemInstruction}\n\nPERTANYAAN BOSS:\n${prompt}`;
        
        const result = await model.generateContent(finalPrompt);
        text = result.response.text();
        
        isSuccess = true;
        break; // Kalau berhasil dapet jawaban, langsung stop pencarian server
      } catch (error) {
        console.log(`[LIONEL AI] Server ${modelName} penuh, loncat ke server backup...`);
      }
    }

    // Kalau semua server Google bener-bener lagi mati
    if (!isSuccess) {
      return NextResponse.json({ 
        success: false, 
        message: 'Sirkuit LIONEL AI lagi pendinginan Boss. Server lagi padat, coba klik send lagi dalam beberapa detik.' 
      }, { status: 500 });
    }

    // 4. Kirim Jawaban ke Frontend
    return NextResponse.json({ success: true, text });

  } catch (error) {
    // Pesan error disamarkan biar gak ketahuan bocor API
    return NextResponse.json({ 
      success: false, 
      message: "Waduh Boss, ada kabel putus di sistem internal LIONEL AI. Cek koneksi lu atau tunggu bentar ya." 
    }, { status: 500 });
  }
}