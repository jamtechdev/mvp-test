// app/api/ai-insight/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODELS = [
  process.env.OPENAI_MODEL || "gpt-4o", // primary
  "gpt-3.5-turbo", // fallback
];

function buildPrompt(caseId, data) {
  switch (caseId) {
    case "funnel":
      return [
        {
          role: "system",
          content:
            "You are a marketing analyst specialised in funnel analysis. " +
            "Identify the largest drop‑offs and propose 2–3 optimisation ideas.",
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
          return `${
            isNaN(d) ? "[Invalid date]" : d.toISOString().slice(0, 10)
          }: ${p.y}`;
        })
        .join("\n");
      return [
        {
          role: "system",
          content:
            "You are a marketing analyst. Analyse the 30‑day trend for a metric, " +
            "highlight anomalies, and suggest 2–3 improvements.",
        },
        {
          role: "user",
          content: `Metric: ${data.metric}\nSeries (date,value):\n${seriesTxt}`,
        },
      ];

    case "ads":
      return [
        {
          role: "system",
          content:
            "You are a marketing analyst. From ad‑level data, flag top performers " +
            "and under‑performers, then recommend budget reallocations or creative tweaks.",
        },
        { role: "user", content: `Ad data: ${JSON.stringify(data.ads)}` },
      ];

    case "campaigns":
      return [
        {
          role: "system",
          content:
            "You are a marketing analyst. Rank campaigns, spot outliers with high spend but low revenue, " +
            "and propose actions.",
        },
        {
          role: "user",
          content: `Campaigns: ${JSON.stringify(data.campaigns)}`,
        },
      ];

    case "kpiTargets":
      return [
        {
          role: "system",
          content:
            "You are a senior marketing analyst. Provide a concise insight and 2–3 actionable suggestions.",
        },
        {
          role: "user",
          content: `KPIs: ${JSON.stringify(
            data.kpi
          )}\nTargets: ${JSON.stringify(data.targets)}`,
        },
      ];

    case "generic":
      return [
        {
          role: "system",
          content:
            "You are a marketing analyst. Summarise the numbers and give 2–3 short recommendations.",
        },
        { role: "user", content: `Context: ${JSON.stringify(data.payload)}` },
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
    } else if (payload?.series) {
      caseId = "trend";
      promptData = payload;
    } else if (payload?.ads) {
      caseId = "ads";
      promptData = payload;
    } else if (payload?.campaigns) {
      caseId = "campaigns";
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

    /* 2‑B. Try models in order until one succeeds */
    let insight = "";
    for (const model of MODELS) {
      try {
        const resp = await openai.chat.completions.create({
          model,
          messages,
          temperature: 0.3,
        });
        insight = resp.choices[0]?.message?.content;
        if (insight) break; // success ✅
      } catch (err) {
        if (err?.status === 404 || err?.code === "model_not_found") {
          continue; // try next model
        }
        // genuine error -> bubble out
        throw err;
      }
    }

    if (!insight) insight = "Could not generate insight.";

    return NextResponse.json({ insight });
  } catch (err) {
    console.error("AI‑insight route error:", err);
    return NextResponse.json(
      { error: err.message || "Unhandled server error" },
      { status: 500 }
    );
  }
}
