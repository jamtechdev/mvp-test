// app/api/ask-ai/route.js

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PREFERRED_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const FALLBACK_MODEL = "gpt-3.5-turbo"; // backup model

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { messages, aiInput } = body ?? {};

  const summarizedContext = `You are an expert AI assistant for marketing analytics and campaign performance.

Here is the provided campaign data you MUST use as the main source:

📊 Payload:
${JSON.stringify(aiInput?.payload || {}, null, 2)}

📈 KPI:
${JSON.stringify(aiInput?.kpi || {})}

🎯 Targets:
${JSON.stringify(aiInput?.targets || [])}

Guidelines:
- Use ONLY the above data if it's present.
- If specific data is missing (e.g., industry benchmarks, estimated costs, optimal CTRs), you MAY use reasonable industry knowledge — BUT clearly state it's an assumption or general reference.
- Provide direct, concise insights and 2–3 data-backed suggestions.
- Avoid generic phrases like "it depends" unless you qualify why.
- Use markdown for important points or structure (e.g., bullet points, **bold** KPIs, etc.).
- Your role is to be as helpful as possible while remaining grounded in real data.
`;

  // --- Prepare OpenAI call ---
  const callOpenAI = async (model) =>
    openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: summarizedContext }, ...messages],
      temperature: 0.5,
    });

  // --- Try primary model, fallback if needed ---
  try {
    const completion = await callOpenAI(PREFERRED_MODEL);
    return NextResponse.json({
      response: completion.choices[0].message.content,
      modelUsed: PREFERRED_MODEL,
    });
  } catch (err) {
    if (err?.status === 404 || err?.code === "model_not_found") {
      try {
        const fallback = await callOpenAI(FALLBACK_MODEL);
        return NextResponse.json({
          response: fallback.choices[0].message.content,
          modelUsed: FALLBACK_MODEL,
          note: `Fallback from ${PREFERRED_MODEL}`,
        });
      } catch (err2) {
        console.error("OpenAI fallback error:", err2);
      }
    }

    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "OpenAI Error" }, { status: 500 });
  }
}
