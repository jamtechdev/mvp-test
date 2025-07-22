import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODELS = [process.env.OPENAI_MODEL || "gpt-4o", "gpt-4", "gpt-3.5-turbo"];

function buildPrompt(caseIdFresh, data) {
  const UNIFIED_MARKETING_PROMPT = `
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

  const strategies = {
    funnel: `- Identify funnel leaks by stage and device/channel\n- Recommend 3 revenue-first funnel optimizations`,
    trend: `- Highlight channel-level revenue spikes/dips over time\n- Recommend campaign adjustments based on momentum`,
    ads: `- Compare ROAS, CPC, CTR, and conversion paths\n- Recommend ad optimizations by platform or device`,
    campaigns: `- Attribute campaign performance to device/channel/funnel factors\n- Recommend budget reallocations`,
    kpiTargets: `- Contrast KPIs with targets\n- Recommend quick wins to close gaps`,
    sessionsByChannel: `- Evaluate which channels bring high-value traffic\n- Suggest where to scale or optimize UX`,
    deviceSessions: `- Flag devices with weak conversion performance\n- Recommend device-specific CRO actions`,
    revenueByChannel: `- Tie revenue to CAC/ROAS and funnel depth\n- Recommend efficient scaling paths`,
    generic: `- Analyze available metrics\n- Highlight insights and ROI-driven recommendations`,
  };

  const strategy = strategies[caseIdFresh] || strategies["generic"];
  const unifiedSuffix = `\n\n📦 Unified Payload:\n\`\`\`json\n${JSON.stringify(
    data._unifiedFullPayload || {},
    null,
    2
  )}\n\`\`\``;

  return [
    {
      role: "system",
      content: UNIFIED_MARKETING_PROMPT,
    },
    {
      role: "user",
      content: `📌 Strategy Focus:\n${strategy}${unifiedSuffix}`,
    },
  ];
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

    const { kpi, targets, payload, caseId, unified } = body;

    let caseIdFresh = caseId || null;
    let promptData = null;

    if (!caseIdFresh && payload) {
      if (payload?.stages) caseIdFresh = "funnel";
      else if (payload?.series && payload?.metric) caseIdFresh = "trend";
      else if (payload?.ads) caseIdFresh = "ads";
      else if (payload?.campaigns) caseIdFresh = "campaigns";
      else if (payload?.label?.toLowerCase().includes("sessions by channel"))
        caseIdFresh = "sessionsByChannel";
      else if (payload?.label?.toLowerCase().includes("device sessions"))
        caseIdFresh = "deviceSessions";
      else if (payload?.label?.toLowerCase().includes("revenue per channel")) {
        caseIdFresh = "revenueByChannel";
        promptData = {
          ...payload,
          campaigns: payload?.campaign_analytics?.campaigns || [],
          ads: payload?.campaign_analytics?.ads || [],
        };
      } else {
        caseIdFresh = "generic";
      }
    }

    if (!promptData) {
      if (caseIdFresh === "kpiTargets" && kpi && targets) {
        promptData = { kpi, targets };
      } else if (payload) {
        promptData = payload;
      } else {
        return NextResponse.json(
          { error: "Missing data for prompt" },
          { status: 400 }
        );
      }
    }

    if (unified && typeof promptData === "object") {
      promptData = {
        ...promptData,
        ...unified,
        _unifiedFullPayload: unified,
      };
    }

    const messages = buildPrompt(caseIdFresh, promptData);
    if (!messages)
      return NextResponse.json(
        { error: "Invalid prompt build" },
        { status: 400 }
      );

    let insight = "";
    for (const model of MODELS) {
      try {
        const response = await openai.chat.completions.create({
          model,
          messages,
          temperature: 0.4,
        });
        insight = response.choices?.[0]?.message?.content;
        if (insight) break;
      } catch (err) {
        if (err?.status === 404 || err?.code === "model_not_found") continue;
        console.error("OpenAI error:", err);
        throw err;
      }
    }

    return NextResponse.json({
      insight: insight || "⚠️ No insight generated.",
    });
  } catch (err) {
    console.error("AI Insight Error:", err);

    let message = "❌ Failed to generate AI insights.";
    if (err?.code === "insufficient_quota" || err?.status === 402) {
      message =
        "🚫 The AI assistant is currently unavailable due to exhausted credits or billing issues. Please try again later.";
    } else if (err?.status === 429) {
      message =
        "⚠️ Rate limit exceeded. Please slow down and try again shortly.";
    }

    return NextResponse.json(
      { error: message, internal: err?.message || err },
      { status: 500 }
    );
  }
}
