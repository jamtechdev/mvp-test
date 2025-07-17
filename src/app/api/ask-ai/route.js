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
- 📅 **Revenue by Channel Over Time**
- 🧭 **Channel + Device Cross-Mapping**
- 🕳️ **Campaign Funnel** (drop-offs, completions, conversion paths)
- 🗓️ **Funnel by Date** (stage breakdowns over time)
- 📈 **KPI Trends**
- 🧩 **Cross-referencing campaign, ad, channel, device, and funnel behavior**

---

📊 **Payload**:
${JSON.stringify(payload || {}, null, 2)}

📈 **KPI Metrics**:
${JSON.stringify(kpi || {}, null, 2)}

🎯 **Targets**:
${JSON.stringify(targets || {}, null, 2)}

---

📌 Responsibilities:
- Identify **interdependencies** between KPIs, funnels, sessions, and revenue over time.
- Cross-analyze **device sessions by channel** to understand traffic patterns and possible friction points.
- Highlight **daily revenue trends** by channel and correlate with funnel stage shifts and campaign actions.
- Detect **date-based changes** in funnel performance using funnel-by-date.
- Compare **channel-device sessions** to identify platform or device drop-off points.
- Rank campaigns, ads, devices, or channels based on **ROI**, **conversion lift**, or **session quality**.
- Mention **top/bottom performers** by revenue, sessions, funnel stage, or device breakdown.
- Flag high-spend / low-conversion patterns.
- Provide 2–3 **data-driven optimizations** grounded in measurable metrics.

🧠 Formatting:
- Use **markdown**
- Use 📌 bullets and 📅 emojis for date insights
- Bold **key stats** and highlight deltas or drop-offs
- Be practical, precise, and **interlink metrics** when giving recommendations
- If a field is missing, intelligently infer or mention it is unavailable
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
