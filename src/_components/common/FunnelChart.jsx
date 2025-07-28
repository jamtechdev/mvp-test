import React, { useEffect, useState } from "react";
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

const COLORS = ["#ff6384", "#ff9f40", "#ffcd56", "#4bc0c0", "#36a2eb"];

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

const formatNumber = (value) => {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value;
};

export default function CampaignFunnel() {
  const scheme = useThemeScheme();
  const isDark = scheme === "dark";
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth <= 834);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const GAP_SPACING = isTablet ? 60 : 70;

  const rawStages = unified.campaign_funnel?.stages || [];
  const stages = sanitizeFunnelStages(rawStages).map((s, i) => ({
    ...s,
    fill: COLORS[i % COLORS.length],
  }));

  if (stages.length === 0) {
    return <div>No data available for the funnel chart.</div>;
  }

  const textColor = isDark ? "#fff" : "#000";
  const textShadow = isDark
    ? "0px 0px 3px rgba(255,255,255,0.2)"
    : "0px 0px 2px rgba(0,0,0,0.15)";

  return (
    <Card className="p-3 campign-card h-100 flex-fill overflow-hidden">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6
          className="fw-semibold mb-0"
          style={{
            color: textColor,
            textShadow,
          }}
        >
          Campaign Funnel
        </h6>
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

      <div
        className="funnel-wrapper d-flex flex-column align-items-center w-100 mt-5"
        style={{ overflowX: "auto" }}
      >
        <div
          className="funnel-inner"
          style={{
            width: "100%",
            maxWidth: "100%", // wider funnel for text spacing
            minWidth: "100%", // prevent text squishing
            height: "500px",
            maxHeight: "550px",
            overflow: "hidden",
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                formatter={(v, name, props) => {
                  const pct = props?.payload?.percentage || "";
                  return [`${formatNumber(v)}${pct ? ` (${pct})` : ""}`, name];
                }}
                contentStyle={{
                  backgroundColor: isDark ? "#2b2b2b" : "#fff",
                  borderColor: isDark ? "#444" : "#ccc",
                  color: textColor,
                }}
                labelStyle={{ color: textColor }}
                itemStyle={{ color: textColor }}
              />
              <Funnel
                data={stages}
                dataKey="value"
                cx="100%"
                width={"100%"}
                cy="60%"
                // neckWidth="100%"         // allow wider body
                neckWidth="100%"
                neckHeight={850}
                gap={GAP_SPACING} // more space between segments
                cornerRadius={6}
                stroke="none"
                minPointSize={Math.max(100, 460 / stages.length)}
                isAnimationActive
              >
                <LabelList
                  dataKey="value"
                  position="center"
                  dy={-15}
                  textAnchor="middle"
                  fill={textColor}
                  fontSize={14}
                  fontWeight="bolder"
                  style={{ textShadow }}
                  formatter={(val, entry) => {
                    const text = formatNumber(val);
                    const lastStage = stages[stages.length - 1];
                    const isBottom =
                      entry && lastStage && lastStage.name === entry.name;
                    if (isBottom && isTablet) {
                      return text.length > 5 ? text.slice(0, 5) + "…" : text;
                    }
                    return text.length > 6 ? text.slice(0, 6) + "…" : text;
                  }}
                />
                <LabelList
                  dataKey="percentage"
                  position="right"
                  offset={45}
                  dy={-15}
                  fill={textColor}
                  fontSize={14}
                  fontWeight="500"
                  style={{ textShadow }}
                  formatter={(val) => val}
                />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Legends */}
        <div
          className="funnel-legend d-flex flex-wrap justify-content-center mt-4 px-2 w-100"
          style={{ gap: "8px 16px" }}
        >
          {stages.map((stage) => (
            <div
              key={stage.name}
              className="d-flex align-items-center"
              style={{ minWidth: 100 }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: stage.fill,
                  display: "inline-block",
                  marginRight: 8,
                }}
              />
              <span
                className="fw-semibold"
                style={{
                  fontSize: 14,
                  color: textColor,
                  textShadow,
                  wordBreak: "break-word",
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
