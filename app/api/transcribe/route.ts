import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio");

    if (!(audioFile instanceof File)) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }
    if (audioFile.size === 0 || audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: "Audio must be between 1 byte and 25 MB." }, { status: 413 });
    }
    if (audioFile.type && !audioFile.type.startsWith("audio/")) {
      return NextResponse.json({ error: "Unsupported audio file type." }, { status: 415 });
    }
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Voice transcription is not configured. Use Text mode or add GROQ_API_KEY." }, { status: 503 });
    }

    const groq = new Groq({ apiKey, timeout: 30_000, maxRetries: 1 });
    const model = process.env.GROQ_TRANSCRIPTION_MODEL?.trim() || "whisper-large-v3-turbo";

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model,
      response_format: "json",
      temperature: 0,
    });

    return NextResponse.json({ text: transcription.text, model });
  } catch (err) {
    console.error("Transcription error:", err);
    return NextResponse.json({ error: "Voice transcription is temporarily unavailable. Use Text mode or try again." }, { status: 502 });
  }
}
