// app/api/ask-ai/route.js

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PREFERRED_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const FALLBACK_MODEL = "gpt-3.5-turbo";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { messages, aiInput } = body ?? {};

  const summarizedContext = `You are a senior AI assistant specialized in marketing analytics and performance optimization.

Your job is to **analyze the following campaign data** and provide smart, specific insights:

📊 **Payload**:
${JSON.stringify(aiInput?.payload || {}, null, 2)}

📈 **KPI Metrics**:
${JSON.stringify(aiInput?.kpi || {}, null, 2)}

🎯 **Targets**:
${JSON.stringify(aiInput?.targets || [], null, 2)}

---

### 🔍 Key Responsibilities:
- **Use the above data ONLY**. If data is missing, clearly label assumptions.
- Highlight **best and worst performing dates** from any KPI trend or time series data.
- For revenue or spend breakdowns:
  - Rank channels by ROI (Revenue / Spend).
  - Flag **underperformers** with high cost and low return.
  - Mention **best-performing campaign or day**, if determinable.
- Give 2–3 **data-driven** improvement suggestions.

---

### 🧠 Formatting & Style:
- Use markdown:
  - **Bold** key metrics (e.g., revenue, CTR)
  - 📌 Bullet points for suggestions
  - 📅 Emojis for dates or highlights
- Do NOT say "not enough data" — give fallback estimates or industry-based advice when needed.
- Be clear, specific, and practical — never vague.

You are a smart analytics expert trained to **scrutinize patterns** and **recommend action**, not just summarize.
`;

  const callOpenAI = async (model) =>
    openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: summarizedContext }, ...messages],
      temperature: 0.5,
    });

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
