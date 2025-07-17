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

  // === PROMPT TEMPLATES ===
  switch (caseId) {
    case "funnel":
      return [
        {
          role: "system",
          content: `You're a **funnel analyst**. Correlate funnel drop-offs with **device type**, **session sources**, and **channel performance**. Identify where most users fall off and why, linking back to top devices or traffic sources. Recommend 2–3 improvements with attribution logic.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Funnel stages:\n${data.stages
              .map((s) => `${s.name}: ${s.value}`)
              .join("\n")}` +
            `\n\nDevice Sessions:\n${JSON.stringify(
              data.deviceSessions || {},
              null,
              2
            )}` +
            `\n\nSessions by Channel:\n${JSON.stringify(
              data.sessionsByChannel || {},
              null,
              2
            )}` +
            `\n\nChannel Device Sessions:\n${JSON.stringify(
              data.channelDeviceSessions || [],
              null,
              2
            )}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}`,
        },
      ];

    case "trend":
      const seriesText = data.series
        .map((p) => `${new Date(p.x).toISOString().slice(0, 10)}: ${p.y}`)
        .join("\n");
      return [
        {
          role: "system",
          content: `You're a KPI trend analyst.\n\n- Identify best and worst performing days.\n- Relate changes to funnel drop-offs, revenue shifts, or traffic surges.\n- Link spikes/dips to campaigns or devices.\n- Recommend specific day-based optimizations.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Metric: ${data.metric}\n\nTrend Data:\n${seriesText}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}` +
            `\n\nFunnel by Date:\n${JSON.stringify(
              data.funnelByDate || [],
              null,
              2
            )}` +
            `\n\nRevenue by Channel:\n${JSON.stringify(
              data.revenueByChannel || {},
              null,
              2
            )}` +
            `\n\nRevenue by Channel Daily:\n${JSON.stringify(
              data.revenueByChannelDaily || [],
              null,
              2
            )}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}`,
        },
      ];

    case "ads":
      return [
        {
          role: "system",
          content: `You're an **ad performance specialist**. Rank ads by **ROAS**, **Cost/KPI**, and **conversions**.\n- Link ad performance to revenue per channel, funnel conversion, and session source.\n- Suggest actionable improvements per ad.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Ads:\n${JSON.stringify(data.ads, null, 2)}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}` +
            `\n\nRevenue by Channel:\n${JSON.stringify(
              data.revenueByChannel || {},
              null,
              2
            )}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}`,
        },
      ];

    case "campaigns":
      return [
        {
          role: "system",
          content: `You're a campaign performance analyst.\n\n- Rank campaigns by ROI and Cost per KPI.\n- Connect campaign performance to session traffic, device engagement, and final funnel conversion.\n- Suggest reallocations based on results.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Campaigns:\n${JSON.stringify(data.campaigns, null, 2)}` +
            `\n\nSessions by Channel:\n${JSON.stringify(
              data.sessionsByChannel || {},
              null,
              2
            )}` +
            `\n\nDevice Sessions:\n${JSON.stringify(
              data.deviceSessions || {},
              null,
              2
            )}` +
            `\n\nChannel Device Sessions:\n${JSON.stringify(
              data.channelDeviceSessions || [],
              null,
              2
            )}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}`,
        },
      ];

    case "kpiTargets":
      return [
        {
          role: "system",
          content: `You're a KPI expert. Compare actual vs target KPIs, identify shortfalls, and relate them to revenue, ad campaigns, and funnel issues.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `KPIs:\n${JSON.stringify(data.kpi)}` +
            `\n\nTargets:\n${JSON.stringify(data.targets)}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}` +
            `\n\nRevenue:\n${JSON.stringify(
              data.revenueByChannel || {},
              null,
              2
            )}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}`,
        },
      ];

    case "sessionsByChannel":
      return [
        {
          role: "system",
          content: `You're a channel acquisition strategist.\n\n- Analyze session volumes per channel.\n- Connect to funnel entry rates and channel-specific conversion or drop-off.\n- Mention impact on revenue and possible redirections.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Sessions by Channel:\n${data.labels
              .map((label, i) => `${label}: ${data.series[i]}`)
              .join("\n")}` +
            `\n\nRevenue by Channel:\n${JSON.stringify(
              data.revenueByChannel || {},
              null,
              2
            )}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}`,
        },
      ];

    case "deviceSessions":
      return [
        {
          role: "system",
          content: `You're a UX + CRO analyst.\n\n- Compare session volumes by device type.\n- Link usage patterns to funnel drop-off or completion.\n- Mention channel/device overlaps or problems.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Device Sessions:\n${data.labels
              .map((label, i) => `${label}: ${data.series[i]}`)
              .join("\n")}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}` +
            `\n\nSessions by Channel:\n${JSON.stringify(
              data.sessionsByChannel || {},
              null,
              2
            )}` +
            `\n\nChannel Device Sessions:\n${JSON.stringify(
              data.channelDeviceSessions || [],
              null,
              2
            )}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}`,
        },
      ];

    case "revenueByChannel":
      return [
        {
          role: "system",
          content: `You're a **senior revenue analyst**. Your job is to provide revenue-based insights with **deep attribution logic**.\n\n- Rank channels by revenue.\n- Attribute revenue to relevant **campaigns and ads**.\n- Connect revenue results to **sessions**, **devices**, and **funnel performance**.\n- If revenue is high but conversions are low, suggest improvements.\n- Recommend budget reallocations only if justified.\n\n${base.fallbackRule}`,
        },
        {
          role: "user",
          content:
            `Revenue by Channel:\n${data.labels
              .map((label, i) => `${label}: $${data.series[i]}`)
              .join("\n")}` +
            `\n\nRevenue by Channel Daily:\n${JSON.stringify(
              data.revenueByChannelDaily || [],
              null,
              2
            )}` +
            `\n\nFunnels:\n${JSON.stringify(data.funnel || {}, null, 2)}` +
            `\n\nCampaigns:\n${JSON.stringify(data.campaigns || [], null, 2)}` +
            `\n\nAds:\n${JSON.stringify(data.ads || [], null, 2)}` +
            `\n\nDevice Sessions:\n${JSON.stringify(
              data.deviceSessions || {},
              null,
              2
            )}` +
            `\n\nChannel Device Sessions:\n${JSON.stringify(
              data.channelDeviceSessions || [],
              null,
              2
            )}` +
            `\n\nSessions by Channel:\n${JSON.stringify(
              data.sessionsByChannel || {},
              null,
              2
            )}`,
        },
      ];

    case "generic":
      return [
        {
          role: "system",
          content: `You're a marketing analyst. Provide 360° insights across revenue, sessions, funnel, campaigns, and KPIs.\n\n${base.fallbackRule}`,
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
    if (!body)
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });

    const { kpi, targets, payload } = body;

    let caseId, promptData;

    // Payload shape detection
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
        campaigns: payload.campaign_analytics?.campaigns || [],
        ads: payload.campaign_analytics?.ads || [],
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
    if (!messages)
      return NextResponse.json(
        { error: "Invalid prompt structure" },
        { status: 400 }
      );

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
