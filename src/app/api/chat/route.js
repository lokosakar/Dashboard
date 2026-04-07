import { NextResponse } from 'next/server';
import { dbConnect, Note } from '../../lib/mongodb';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Inisialisasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const AI_PROMPTS = {
  smart: "Kamu adalah asisten pintar. Jawablah secara natural, ramah, dan solutif bergaya tech-savvy.",
  analyst: "Kamu adalah data analyst yang tajam. Fokus temukan pola, insight logis, dan ringkasan terstruktur.",
  writer: "Kamu adalah copywriter profesional. Bantu user menulis dengan gaya bahasa yang futuristik dan keren."
};

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { userId, message, aiType } = body; 

    if (!message || !userId) {
      return NextResponse.json({ success: false, message: 'Message dan User ID wajib ada' }, { status: 400 });
    }

    // 1. Ambil catatan asli user dari database MongoDB
    const userNotes = await Note.find({ userId });
    const notesContext = userNotes.map(n => `[Judul: ${n.title}] - ${n.content}`).join("\n\n");

    // 2. Setup Model & Prompt
    // GANTI PAKE KATA '-latest' DI BELAKANGNYA:
    const model = genAI.getGenerativeModel({ model: "gemini-2,5-flash-preview" });
    const systemPrompt = AI_PROMPTS[aiType] || AI_PROMPTS.smart;

    const fullPrompt = `
      ${systemPrompt}
      
      Berikut adalah catatan "Second Brain" milik user untuk referensi kamu:
      ${notesContext || "User belum memiliki catatan."}
      
      Pertanyaan User: ${message}
      
      Gunakan catatan di atas hanya jika relevan untuk menjawab. Jawablah langsung ke inti masalah.
    `;

    // 3. Eksekusi Generate Content
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiReply = response.text();

    return NextResponse.json({ success: true, reply: aiReply });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Gagal memproses AI: " + (error.message || "Unknown Error") 
    }, { status: 500 });
  }
}