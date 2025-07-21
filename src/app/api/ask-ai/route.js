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

  const { messages = [], aiInput = {}, unified = {} } = body;
  const { kpi, targets, payload } = aiInput;

  // 🧠 Merge all insight sources
  const mergedData = {
    ...payload,
    ...kpi,
    ...targets,
    ...unified,
    _fullPayload: {
      payload,
      kpi,
      targets,
      unified,
    },
  };

  const summarizedContext = `
You are a **senior marketing AI analyst** with access to historical and real-time campaign data from platforms like Google Ads and Snapchat.

Your job is to:
- Provide **deeply contextual multi-dimensional insights**
- Cross-reference metrics like sessions, devices, funnels, and revenue
- Detect patterns **over time and across platforms**
- Combine Google Ads and Snapchat metrics **to surface performance gaps, opportunities, or trends**

---

📌 **Responsibilities**:
1. Identify trends and correlations between:
   - 📱 **Device Sessions**
   - 🌐 **Sessions by Channel**
   - 💰 **Revenue per Channel**
   - 📈 **Revenue by Channel Over Time**
   - 🧭 **Channel + Device Cross-Mapping**
   - 🕳️ **Funnel Conversion Drop-Offs**
   - 🗓️ **Funnel By Date**
   - 📊 **KPI Metrics vs Targets**

2. Perform detailed **Google Ads and Snapchat** analysis:
   - For Google Ads, correlate spend, impressions, clicks, and ROAS with revenue over time
   - For Snapchat, analyze **session counts**, device splits, and attribution to revenue or conversions
   - Compare Snapchat and Google by **cost efficiency**, **session quality**, and **conversion path effectiveness**

3. Flag:
   - 🧨 High-spend + low-conversion campaigns
   - 🟡 Underutilized high-conversion channels
   - 🔴 Platforms with device or funnel friction

4. Recommend:
   - 🔧 Data-driven optimizations
   - 🎯 Target adjustments or reallocations
   - 📆 Date-based or device-based campaign changes

---

📂 **Data Sample**:
\`\`\`json
${JSON.stringify(mergedData, null, 2)}
\`\`\`

---

📊 **Instruction Style**:
- Use **markdown formatting**
- Use **emoji indicators** for themes: 📌 bullets, 📅 dates, 🔁 change, 💡 ideas
- Bold **key stats**, use arrows (↑/↓) to show trends
- Cross-link metrics (e.g. "Snapchat ROAS ↓ but sessions ↑ on mobile")
- If data is missing, mention that intelligently
- Always aim for 2–3 strong insights and 1 optimization

Be pragmatic, context-aware, and insightful.
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
