// app/api/ai-insight/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODELS = [process.env.OPENAI_MODEL || "gpt-4o", "gpt-3.5-turbo"];

function buildPrompt(caseId, data) {
  const base = {
    fallbackRule:
      `⚠️ If data is incomplete (e.g., missing budget, ROAS, revenue), ` +
      `respond with thoughtful industry-based suggestions or estimates. ` +
      `Use markdown formatting (**bold**, bullet points, emoji) where it helps. ` +
      `Do NOT say “no data available”. Be as helpful as possible.`,
  };

  switch (caseId) {
    case "funnel":
      return [
        {
          role: "system",
          content: `You're a funnel expert. Identify biggest drop-offs and suggest 2–3 improvements.\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            "Funnel stages:\n" +
            data.stages.map((s) => `${s.name}: ${s.value}`).join("\n"),
        },
      ];

    case "trend":
      const seriesText = data.series
        .map((p) => {
          const d = new Date(p.x);
          return `${d.toISOString().slice(0, 10)}: ${p.y}`;
        })
        .join("\n");

      return [
        {
          role: "system",
          content: `You're a KPI trend analyst.

Given a time series of metric data (e.g. daily KPI values), your job is to:

- Identify the **best performing day** (highest value).
- Identify the **worst performing day** (lowest value).
- Calculate total sum and average value.
- Comment on overall trend (e.g. growth, drop, fluctuation).
- Suggest **2–3 specific actions** based on these trends.

Respond clearly using **Markdown**:
- Bold key values and dates.
- Use emojis if helpful.
- If data is missing, use thoughtful assumptions but mention they're inferred.

${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Metric: ${data.metric}\nTrend Data:\n${seriesText}`,
        },
      ];

    case "ads":
      return [
        {
          role: "system",
          content:
            `You're an ad performance specialist. Based on the ad data:\n\n` +
            `- Highlight best and worst performers\n` +
            `- Mention if any ad overperforms on cost-efficiency (ROAS, CPC, etc.)\n` +
            `- Recommend reallocation or copy/design optimizations\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Ad Data:\n${JSON.stringify(data.ads, null, 2)}`,
        },
      ];

    case "campaigns":
      return [
        {
          role: "system",
          content:
            `You're a campaign performance analyst. Analyze campaigns to:\n\n` +
            `- Rank them by ROI or engagement\n` +
            `- Flag poor performers or high-cost/low-return ones\n` +
            `- Suggest 2–3 improvements or A/B test recommendations\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Campaigns:\n${JSON.stringify(data.campaigns, null, 2)}`,
        },
      ];

    case "kpiTargets":
      return [
        {
          role: "system",
          content:
            `You're a KPI review expert. Compare actuals vs targets:\n\n` +
            `- Highlight missed or exceeded goals\n` +
            `- Suggest 2–3 tactical recommendations to improve underperforming KPIs\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `KPIs:\n${JSON.stringify(
            data.kpi
          )}\nTargets:\n${JSON.stringify(data.targets)}`,
        },
      ];

    case "sessionsByChannel":
      return [
        {
          role: "system",
          content:
            `You're a channel performance expert. Analyze the session split:\n\n` +
            `- Identify the most and least effective channels\n` +
            `- Suggest ways to boost weak channels or double down on strong ones\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Sessions by channel:\n${data.labels
            .map((label, i) => `${label}: ${data.series[i]}`)
            .join("\n")}`,
        },
      ];

    case "deviceSessions":
      return [
        {
          role: "system",
          content:
            `You're a UX strategist. Based on device sessions:\n\n` +
            `- Detect over/under-utilized platforms (mobile, tablet, desktop)\n` +
            `- Suggest if UX improvements are needed for certain devices\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Device sessions:\n${data.labels
            .map((label, i) => `${label}: ${data.series[i]}`)
            .join("\n")}`,
        },
      ];

    case "revenueByChannel":
      return [
        {
          role: "system",
          content:
            `You're a senior revenue analyst. Use the revenue data (and optionally campaign/ad data) to:\n\n` +
            `- Rank channels by **ROI** or revenue contribution\n` +
            `- Flag channels with high spend but poor return\n` +
            `- Recommend 2–3 specific optimizations or reallocations\n` +
            `- Mention the **best day or campaign** if determinable from available data\n\n` +
            `Use clear **Markdown formatting** with bold, bullets, and emojis where appropriate.\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Revenue by Channel:\n${data.labels
              .map((label, i) => `${label}: $${data.series[i]}`)
              .join("\n")}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}` +
            `\n\nAds:\n${JSON.stringify(data.ads || [], null, 2)}`,
        },
      ];

    case "generic":
      return [
        {
          role: "system",
          content: `You're a marketing assistant. Summarize helpful insights and suggest 2–3 improvements.\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Data:\n${JSON.stringify(data.payload, null, 2)}`,
        },
      ];

    default:
      return null;
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { kpi, targets, payload } = body;

    let caseId, promptData;

    if (payload?.stages) {
      caseId = "funnel";
      promptData = payload;
    } else if (payload?.series && payload?.metric) {
      caseId = "trend";
      promptData = payload;
    } else if (payload?.ads) {
      caseId = "ads";
      promptData = payload;
    } else if (payload?.campaigns) {
      caseId = "campaigns";
      promptData = payload;
    } else if (payload?.label?.toLowerCase().includes("sessions by channel")) {
      caseId = "sessionsByChannel";
      promptData = payload;
    } else if (payload?.label?.toLowerCase().includes("device sessions")) {
      caseId = "deviceSessions";
      promptData = payload;
    } else if (payload?.label?.toLowerCase().includes("revenue per channel")) {
      caseId = "revenueByChannel";
      promptData = {
        ...payload,
        campaigns: payload.campaign_analytics?.campaigns,
        ads: payload.campaign_analytics?.ads,
      };
    } else if (kpi && targets) {
      caseId = "kpiTargets";
      promptData = { kpi, targets };
    } else if (payload) {
      caseId = "generic";
      promptData = { payload };
    } else {
      return NextResponse.json(
        { error: "Missing kpi/targets or payload" },
        { status: 400 }
      );
    }

    const messages = buildPrompt(caseId, promptData);
    if (!messages) {
      return NextResponse.json(
        { error: "Invalid prompt structure" },
        { status: 400 }
      );
    }

    let insight = "";

    for (const model of MODELS) {
      try {
        const resp = await openai.chat.completions.create({
          model,
          messages,
          temperature: 0.4,
        });
        insight = resp.choices[0]?.message?.content;
        if (insight) break;
      } catch (err) {
        if (err?.status === 404 || err?.code === "model_not_found") continue;
        throw err;
      }
    }

    if (!insight) insight = "⚠️ Insight could not be generated.";

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("AI‑insight route error:", err);
    return NextResponse.json(
      { error: err.message || "Unhandled server error" },
      { status: 500 }
    );
  }
}
