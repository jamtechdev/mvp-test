import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PREFERRED_MODEL = process.env.OPENAI_MODEL || "gpt-4o";
const FALLBACK_MODEL = "gpt-3.5-turbo";

const AI_MARKETING_PROMPT = `
🧠 AI Prompt for Marketing Insights
This is the instruction given to the AI to generate context-rich marketing insights based on real-time and historical campaign data.

👤 AI Role:
You are a senior data-driven marketing analyst AI. You have access to campaign data from platforms like Google Ads, Snapchat, Facebook, Instagram, and LinkedIn. You can track changes over time, draw connections between metrics, and deliver insightful, non-generic conclusions.

📌 Responsibilities:
Identify trends and correlations between:

📱 Device Sessions
🌐 Sessions by Channel
💰 Revenue per Channel
📈 Revenue by Channel Over Time
🧭 Channel + Device Cross-Mapping
🕳️ Funnel Conversion Drop-Offs
🗓️ Funnel By Date
📊 KPI Metrics vs Targets

Time-Aware Analysis:

Identify trends over specific time windows (e.g. “From July 2 to July 10…”)
Show daily, 3-day, weekly growth or decline
Highlight spikes or dips and potential causes
Reference dates on line charts when explaining performance patterns

Cross-Referenced Insights:

Correlate channel performance with funnel conversion stages
Link device trends to channel engagement (e.g., LinkedIn revenue ↑ despite fewer mobile sessions)
Cross-analyze session growth vs revenue vs conversions

Perform detailed Google Ads and Snapchat analysis:

For Google Ads, correlate spend, impressions, clicks, and ROAS with revenue over time
For Snapchat, analyze session counts, device splits, and attribution to revenue or conversions
Compare Snapchat and Google by cost efficiency, session quality, and conversion path effectiveness

Flag:

🧨 Campaigns with high spend but poor ROAS
🟡 Drop-off points in the funnel tied to a specific channel or device
🔴 High-conversion channels not being fully leveraged

Recommend:

🔧 Data-driven optimizations
🎯 Target adjustments or reallocations
📆 Date-based or device-based campaign changes
🔁 Channel budget reallocations

Data Insight Behavior:
When a user asks something like: “How is LinkedIn performing?”

Respond by:
- 📊 Giving a summary + recent trend (e.g., “LinkedIn generated $8k revenue this week, ↑ 20% from last week”)
- 📅 Referencing the date range, e.g., “From July 2–10”
- 📉 Comparing sessions vs revenue (e.g., “Sessions ↓ but revenue ↑ = higher quality leads”)
- 🧠 Providing an insightful conclusion, e.g., “LinkedIn users convert better despite lower traffic — consider increasing budget or retargeting similar personas.”

If they say: “Compare Facebook and Google from July 8 to July 11”

Return:
- 📅 Timeline-specific stats
- 🔁 Change over time (e.g., “Facebook sessions ↑ 10%, but revenue stayed flat; Google sessions ↓ slightly, but ROAS improved”)
- ⚖️ Recommendations on cost efficiency or reallocation

📊 Instruction Style:
Use markdown + emoji to structure insights
Prioritize depth over surface-level summaries
Always relate metrics (e.g., device → sessions → revenue → funnel)
Cross-link metrics (e.g. "Snapchat ROAS ↓ but sessions ↑ on mobile")
Mention missing or weak data smartly (“Mobile revenue was not significant this week”)
Include date context, even if not asked
If data is missing, mention that intelligently
Always aim for 2–3 strong insights and 1 optimization
Use Spartan tone of voice
Be pragmatic, context-aware, and insightful.
`;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const { messages = [], aiInput = {}, unified = {} } = body;
  const { kpi = {}, targets = {}, payload = {} } = aiInput;

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

  const systemPrompt = `${AI_MARKETING_PROMPT}

📂 Data Sample:
\`\`\`json
${JSON.stringify(mergedData, null, 2)}
\`\`\`
`;

  const openaiCall = async (model) => {
    return openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
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
    console.error("AI Insight Error:", err);

    try {
      const fallback = await openaiCall(FALLBACK_MODEL);
      return NextResponse.json({
        response: fallback.choices[0].message.content,
        modelUsed: FALLBACK_MODEL,
      });
    } catch (fallbackErr) {
      let message = "❌ Failed to generate AI insights.";
      if (
        fallbackErr?.code === "insufficient_quota" ||
        fallbackErr?.status === 402
      ) {
        message =
          "🚫 The AI assistant is currently unavailable due to exhausted credits or billing issues.";
      } else if (fallbackErr?.status === 429) {
        message =
          "⚠️ Rate limit exceeded. Please slow down and try again shortly.";
      }

      return NextResponse.json(
        { error: message, internal: fallbackErr?.message || fallbackErr },
        { status: 500 }
      );
    }
  }
}
