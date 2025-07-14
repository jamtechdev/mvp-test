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
      const seriesTxt = data.series
        .map((p) => {
          const d = new Date(p.x);
          return `${d.toISOString().slice(0, 10)}: ${p.y}`;
        })
        .join("\n");

      return [
        {
          role: "system",
          content: `You are a metric trend analyst. Analyze anomalies and recommend actions.\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Metric: ${data.metric}\nTrend:\n${seriesTxt}`,
        },
      ];

    case "ads":
      return [
        {
          role: "system",
          content: `You're an ad performance specialist. Flag best/worst performers and suggest fixes or reallocations.\n${base.fallbackRule}`,
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
          content: `You're a campaign reviewer. Rank performance, flag issues (e.g., high spend, low return), and suggest next steps.\n${base.fallbackRule}`,
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
          content: `You're a KPI specialist. Compare actuals to targets and provide 2–3 concise suggestions.\n${base.fallbackRule}`,
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
          content: `You're a channel engagement expert. Identify top/weak platforms and suggest 2 optimizations.\n${base.fallbackRule}`,
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
          content: `You're a UX device analyst. Based on session share by device, suggest if mobile/desktop UX should be optimized.\n${base.fallbackRule}`,
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
          content: `You're a revenue analyst. Spot most/least efficient channels and suggest budget shifts or focus areas.\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content: `Revenue by Channel:\n${data.labels
            .map((label, i) => `${label}: $${data.series[i]}`)
            .join("\n")}`,
        },
      ];

    case "generic":
      return [
        {
          role: "system",
          content: `You're a marketing assistant. Summarize insights and recommend 2–3 improvements.\n${base.fallbackRule}`,
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
      promptData = payload;
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
