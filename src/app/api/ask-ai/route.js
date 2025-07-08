// app/api/ask-ai/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// pick a model from env or default to GPT‑4o
const PREFERRED_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const FALLBACK_MODEL = "gpt-3.5-turbo"; // change if you want a different fallback

export async function POST(req) {
  // ---------- 1. safe body parse ------------------------------------------
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const { messages } = body ?? {};
  if (!Array.isArray(messages)) {
    return NextResponse.json(
      { error: "messages must be an array" },
      { status: 400 }
    );
  }

  // ---------- 2. helper that calls OpenAI once ----------------------------
  const callOpenAI = async (model) =>
    openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...messages,
      ],
    });

  try {
    // try preferred model first -------------------------------------------
    const completion = await callOpenAI(PREFERRED_MODEL);
    return NextResponse.json({
      response: completion.choices[0].message.content,
      modelUsed: PREFERRED_MODEL,
    });
  } catch (err) {
    // ---------- 3. handle “model not available” --------------------------
    if (
      err?.status === 404 || // OpenAI returns 404 for unknown model
      err?.code === "model_not_found"
    ) {
      try {
        const completion = await callOpenAI(FALLBACK_MODEL);
        return NextResponse.json({
          response: completion.choices[0].message.content,
          modelUsed: FALLBACK_MODEL,
          note: `Fell back from ${PREFERRED_MODEL}`,
        });
      } catch (err2) {
        console.error("OpenAI fallback error:", err2);
      }
    }

    // ---------- 4. any other error ---------------------------------------
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "OpenAI Error" }, { status: 500 });
  }
}
