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

  const { messages = [], aiInput = {} } = body;
  const { kpi, targets, payload } = aiInput;

  const summarizedContext = `
You are a senior AI assistant specialized in marketing analytics and performance optimization.

Your job is to analyze interconnected campaign data and provide deeply contextual insights across these dimensions:

- 📱 **Device Sessions**
- 🌐 **Sessions by Channel**
- 💰 **Revenue per Channel**
- 🎯 **Campaign Funnel** (drop-offs, completions, conversion paths)
- 📈 **KPI Trends**
- 🧩 **Cross-referencing campaign, ad, channel, device, and funnel breakdowns**

---

📊 **Payload**:
${JSON.stringify(payload || {}, null, 2)}

📈 **KPI Metrics**:
${JSON.stringify(kpi || {}, null, 2)}

🎯 **Targets**:
${JSON.stringify(targets || {}, null, 2)}

---

📌 Responsibilities:
- Identify **interdependencies** between KPIs, funnels, revenue, and user behavior by device/channel.
- Reference funnel stages vs. session sources to detect cause-effect patterns.
- Rank ads, devices, or channels based on ROI or conversion contributions.
- Mention **best/worst performing** campaigns, dates, devices, or stages.
- Flag high-cost low-performing paths.
- Provide 2–3 **data-driven** recommendations to optimize performance.

🧠 Formatting:
- Use **markdown**
- Use 📌 bullets, 📅 emojis for date-based insight, and **bold** for key stats
- Be practical, precise, and **interconnect** different metrics when explaining trends
- If data is missing, infer reasonably (but mark as an assumption)
`;

  const openaiCall = async (model) => {
    return openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: summarizedContext }, ...messages],
      temperature: 0.5,
    });
  };

  try {
    const completion = await openaiCall(PREFERRED_MODEL);
    return NextResponse.json({
      response: completion.choices[0].message.content,
      modelUsed: PREFERRED_MODEL,
    });
  } catch (err) {
    if (err?.status === 404 || err?.code === "model_not_found") {
      try {
        const fallback = await openaiCall(FALLBACK_MODEL);
        return NextResponse.json({
          response: fallback.choices[0].message.content,
          modelUsed: FALLBACK_MODEL,
          note: `Fallback from ${PREFERRED_MODEL}`,
        });
      } catch (err2) {
        console.error("Fallback model error:", err2);
      }
    }

    console.error("AI error:", err);
    return NextResponse.json(
      { error: "AI processing failed" },
      { status: 500 }
    );
  }
}
