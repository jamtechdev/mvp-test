import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODELS = [process.env.OPENAI_MODEL || "gpt-4o", "gpt-4", "gpt-3.5-turbo"];

function buildPrompt(caseIdFresh, data) {
  const fallbackRule = `
⚠️ If data is incomplete (e.g., missing budget, ROAS, revenue),
DO NOT default to generic replies.
Use benchmark insights, common funnel trends, or platform-specific behaviors.
💡 Focus on **monetizable opportunities**, not just observations.
Use **bold text**, bullets, and emoji for clarity.
`;

  const unifiedSuffix = `\n\n📦 Unified Payload (full context):\n${JSON.stringify(
    data._unifiedFullPayload || {},
    null,
    2
  )}`;

  const safeMap = (arr, fn) =>
    Array.isArray(arr) ? arr.map(fn).join("\n") : "";

  const roles = {
    funnel:
      "You're a **conversion strategist** focused on plug-and-profit funnel analysis.",
    trend:
      "You're a **revenue trend hunter**—your goal is to spot money-making signals fast.",
    ads: "You're a **paid media ROI optimizer**—relentless about cutting waste and scaling winners.",
    campaigns:
      "You're a **multi-channel growth manager**, reallocating budget where profit hides.",
    kpiTargets:
      "You're a **performance vs. target consultant**, focused on turning red into green fast.",
    sessionsByChannel:
      "You're a **traffic quality evaluator**, aligning volume with revenue.",
    deviceSessions:
      "You're a **device funnel specialist**, optimizing mobile vs. desktop behavior.",
    revenueByChannel:
      "You're a **channel monetization strategist**, hunting CAC-efficient scale.",
  };

  const strategies = {
    funnel: `
- Identify funnel stages where revenue leaks the most.
- Correlate drop-offs to device, traffic source, and campaign intent.
- Recommend 3 revenue-first fixes (e.g. **“Mobile search drops at cart – fix CTA or speed”**).`,
    trend: `
- Surface **daily/weekly patterns** tied to channel, ROAS, or campaign surge/dip.
- Recommend **date-specific plays** (pause vs push, budget re-tune, messaging shift).`,
    ads: `
- Rank by ROAS, CTR, CPC, CVR.
- Pinpoint ad-channel mismatch (e.g. **“Meta high CPC but low post-click retention”**).
- Suggest **creative or audience changes** that scale profitably.`,
    campaigns: `
- Compare Cost/Conv vs. ROI.
- Attribute under/overperformance to device mix, session depth, or messaging alignment.
- Recommend **budget reallocations** that compound return.`,
    kpiTargets: `
- Highlight underperforming KPIs with spend/click/view context.
- Tie gaps to underleveraged campaigns, underbudgeted wins.
- Offer 3 quick optimizations to flip metrics green.`,
    sessionsByChannel: `
- Rank traffic sources by efficiency (sessions vs conv).
- Show where volume ≠ value.
- Propose **budget realignment or UX fixes** per channel.`,
    deviceSessions: `
- Contrast session quality by device.
- Flag UX drop-offs (e.g. iOS checkout flow, Android CTA misalignment).
- Recommend device-first CRO tweaks.`,
    revenueByChannel: `
- Correlate channel ROAS to funnel depth & session duration.
- Expose **low CAC, high LTV combos**.
- Recommend **3 budget re-pivots** to scale efficient growth.`,
  };

  const defaultSystem = `You're a **senior marketing analyst** tasked with maximizing ROI using any available data.\n${fallbackRule}`;
  const defaultUser = `Data:\n${JSON.stringify(
    data.payload || data,
    null,
    2
  )}${unifiedSuffix}`;

  const role = roles[caseIdFresh] || "You're a data-driven growth strategist.";
  const strategy =
    strategies[caseIdFresh] ||
    "- Analyze the data.\n- Recommend ROI-driven changes.";

  return [
    {
      role: "system",
      content: `${role}\n${fallbackRule}`,
    },
    {
      role: "user",
      content: `${strategy}\n${unifiedSuffix}`,
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
    console.error("AI Insight Route Error:", err);
    return NextResponse.json(
      { error: err.message || "Unhandled error" },
      { status: 500 }
    );
  }
}
