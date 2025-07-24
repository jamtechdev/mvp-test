import React from "react";
import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import InfoPopover from "./InsightModel";
import { Card } from "react-bootstrap";
import unified from "../../_data/unifiedPayload.json";
import useThemeScheme from "@/hooks/useThemeScheme";

const COLORS = [
  "#ff6384", // Impressions
  "#ff9f40", // Clicks
  "#ffcd56", // Leads
  "#4bc0c0", // Conversions
  "#36a2eb", // Revenue
];

// 🧠 Enforce clean descending funnel
const sanitizeFunnelStages = (stages = []) => {
  let lastValue = Infinity;
  const max = stages[0]?.value || 1;

  return stages
    .map((s) => {
      const value = typeof s.value === "number" && s.value >= 0 ? s.value : 0;
      return {
        ...s,
        value,
        percentage: `${((value / max) * 100).toFixed(1)}%`,
      };
    })
    .filter((s) => {
      const valid = s.value <= lastValue;
      if (valid) lastValue = s.value;
      return valid;
    });
};

// Function to format numbers in K format (e.g., 7800 -> 7.8K)
const formatNumber = (value) => {
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  }
  return value;
};

export default function CampaignFunnel() {
  const scheme = useThemeScheme();
  const isDark = scheme === "dark";

  const rawStages = unified.campaign_funnel?.stages || [];

  // Sanitize funnel stages to ensure no issues with empty data
  const stages = sanitizeFunnelStages(rawStages).map((s, i) => ({
    ...s,
    fill: COLORS[i % COLORS.length],
  }));

  // Prevent rendering if there are no valid stages
  if (stages.length === 0) {
    return <div>No data available for the funnel chart.</div>;
  }

  return (
    <Card className="p-3 campign-card h-100 flex-fill">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold text-muted mb-0">Campaign Funnel</h6>
        <InfoPopover
          title="Campaign Funnel – AI Insight"
          description="Identify the biggest drop‑offs and optimise."
          placement="bottom"
          payload={{
            stages,
            drop_off: unified.campaign_funnel?.drop_off || [],
            funnel_by_date: unified.campaign_funnel?.by_date || [],
            context: {
              linked_metrics: {
                cpa: unified.analytics.kpi?.cpa,
                spend: unified.kpi_cards.metrics.find((m) => m.key === "spend")
                  ?.value,
                revenue: unified.kpi_cards.metrics.find(
                  (m) => m.key === "revenue"
                )?.value,
                campaign_count: unified.campaign_analytics?.campaigns?.length,
              },
            },
          }}
          caseId="campaignFunnel"
        />
      </div>

      <div className="d-flex gap-4 mt-5">
        <div className="flex-grow-1">
          {/* Ensure that the parent div has enough space */}
          <div style={{ width: "100%", height: "500px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip
                  formatter={(v, name, props) => {
                    const pct = props?.payload?.percentage || "";
                    return [
                      `${formatNumber(v)}${pct ? ` (${pct})` : ""}`,
                      name,
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: isDark ? "#2b2b2b" : "#fff",
                    borderColor: isDark ? "#444" : "#ccc",
                    color: isDark ? "#fff" : "#000",
                  }}
                  labelStyle={{ color: isDark ? "#fff" : "#000" }}
                  itemStyle={{ color: isDark ? "#fff" : "#000" }}
                />

                <Funnel
                  data={stages}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  neckWidth="80%" // Increased neck width to 80% to ensure even smaller values fit inside
                  neckHeight={1200} // Increased neck height to 1200 for more space
                  gap={60} // Increased gap between stages
                  cornerRadius={8}
                  stroke="none"
                  minPointSize={120} // Reduced minPointSize to fit smaller values
                  isAnimationActive
                >
                  <LabelList
                    dataKey="value"
                    position="inside"
                    dy={4}
                    fill={isDark ? "#fff" : "#000"}
                    fontSize={({ value }) =>
                      value <= 10000 ? 11 : value <= 25000 ? 12 : 13
                    }
                    fontWeight="bold"
                    formatter={(val) => formatNumber(val)} // Apply K format to labels
                  />

                  <LabelList
                    dataKey="percentage"
                    position="right"
                    offset={20}
                    fill={isDark ? "#fff" : "#000"}
                    fontSize={12}
                    fontWeight="500"
                    formatter={(val) => val}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="d-flex flex-column justify-content-center">
          {stages.map((stage) => (
            <div key={stage.name} className="d-flex align-items-center mb-2">
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: stage.fill,
                  marginRight: 8,
                }}
              />
              <span
                className="fw-semibold"
                style={{
                  fontSize: 14,
                  color: isDark ? "#fff" : "#212529",
                }}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
