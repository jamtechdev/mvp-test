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

  const rawStages = unified.campaign_funnel?.stages || [];
  const stages = sanitizeFunnelStages(rawStages).map((s, i) => ({
    ...s,
    fill: COLORS[i % COLORS.length],
  }));

  if (stages.length === 0) {
    return <div>No data available for the funnel chart.</div>;
  }

  return (
    <Card className="p-3 campign-card h-100 flex-fill overflow-hidden">
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

      <div
        className="funnel-wrapper d-flex flex-column align-items-center w-100 mt-5"
        style={{ overflowX: "auto" }}
      >
        <div
          className="funnel-inner"
          style={{
            width: "100%",
            maxWidth: "1000px",
            minWidth: "600px",
            height: "480px",
            maxHeight: "480px",
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
                neckWidth="80%"
                neckHeight={450}
                gap={isTablet ? 30 : 40}
                cornerRadius={6}
                stroke="none"
                minPointSize={Math.max(100, 460 / stages.length)}
                isAnimationActive
              >
                <LabelList
                  dataKey="value"
                  position="center"
                  dy={0}
                  textAnchor="middle"
                  fill={isDark ? "#fff" : "#000"}
                  fontSize={10}
                  fontWeight="bolder"
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
                  offset={14}
                  fill={isDark ? "#fff" : "#000"}
                  fontSize={11}
                  fontWeight="500"
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
                  color: isDark ? "#fff" : "#212529",
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
