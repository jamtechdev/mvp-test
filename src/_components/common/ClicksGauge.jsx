"use client";

import { Card } from "react-bootstrap";
import GaugeChart from "react-gauge-chart";
import { FiArrowUpRight } from "react-icons/fi";
import InfoPopover from "./InsightModel";

const n0 = (n) => n.toLocaleString("en-US");
const n2 = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Professional gauge card with endpoint labels & KPI badge
 * --------------------------------------------------------
 * Props
 *  - kpi: { clicks: number }
 *  - cpa: number
 *  - maxClicks (optional): gauge 100 % ceiling (default 150 000)
 */
export default function ClicksGauge({ kpi, cpa, maxClicks = 150_000 }) {
  /* percentage & colour logic */
  const percent = Math.min(kpi.clicks / maxClicks, 1);

  /* vibrant yet business‑friendly palette */
  const palette = ["#FF5160", "#FFC107", "#12C99B"]; // red / amber / teal
  const segments = [0.33, 0.33, 0.34];
  const activeColor =
    percent < 0.33 ? palette[0] : percent < 0.66 ? palette[1] : palette[2];

  /* minor UI constants */
  const labelStyle = { fontSize: "0.72rem", color: "#8A8F9A" };

  return (
    <Card
      className="p-4 shadow-sm rounded-4 h-100 d-flex flex-column"
      // style={{ background: "#ffffff" }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold text-secondary mb-0">Clicks – 30 days</h6>
        <InfoPopover
          title="Clicks Trend – AI Insight"
          description="Clicks are rising steadily; consider scaling top‑performing creatives."
          placement="bottom"
        />
      </div>

      {/* Gauge zone */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center position-relative">
        {/* gauge graphic */}
        <GaugeChart
          id="clicks‑gauge"
          animate
          nrOfLevels={120}
          arcsLength={segments}
          colors={palette}
          percent={percent}
          arcWidth={0.18}
          arcPadding={0.008}
          needleColor="#272B30"
          needleBaseColor="#272B30"
          hideText
          style={{ width: "100%", maxWidth: 320 }}
        />

        {/* KPI number & subtitle */}
        <div
          style={{
            position: "absolute",
            top: "63%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            userSelect: "none",
            lineHeight: 1.25,
          }}
        >
          <div
            style={{
              fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
              fontWeight: 700,
              color: activeColor,
            }}
          >
            {n0(kpi.clicks)}
          </div>
          <small style={{ ...labelStyle, display: "block", marginTop: 4 }}>
            Clicks
          </small>
        </div>

        {/* endpoint labels */}
        <small
          style={{
            ...labelStyle,
            position: "absolute",
            left: 8,
            bottom: 30,
          }}
        >
          0
        </small>
        <small
          style={{
            ...labelStyle,
            position: "absolute",
            left: "50%",
            top: 22,
            transform: "translateX(-50%)",
          }}
        >
          {n0(maxClicks / 2)}
        </small>
        <small
          style={{
            ...labelStyle,
            position: "absolute",
            right: 8,
            bottom: 30,
            textAlign: "right",
          }}
        >
          {n0(maxClicks)}
        </small>
      </div>

      {/* CPA badge */}
      <div className="text-center mt-3">
        <span
          className="d-inline-flex align-items-center gap-1 px-3 py-2 fw-medium"
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 99,
            fontSize: "0.85rem",
          }}
        >
          CPA
          <FiArrowUpRight style={{ color: activeColor }} />
          <span style={{ color: activeColor }}>${n2(cpa)}</span>
        </span>
      </div>
    </Card>
  );
}
