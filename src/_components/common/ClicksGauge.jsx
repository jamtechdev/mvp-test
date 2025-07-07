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

export default function ClicksGauge({ kpi, cpa, maxClicks = 150_000 }) {
  /* gauge maths & colours ------------------------------------------- */
  const percent = Math.min(kpi.clicks / maxClicks, 1);
  const palette = ["#FF5160", "#FFC107", "#12C99B"]; // red | amber | teal
  const active =
    percent < 0.33 ? palette[0] : percent < 0.66 ? palette[1] : palette[2];
  const labelSty = { fontSize: "0.72rem", color: "#8A8F9A" };

  return (
    <Card className="p-4 shadow-sm h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold text-secondary mb-0">Clicks – 30 days</h6>
        <InfoPopover
          title="Clicks Trend – AI Insight"
          description="Clicks are rising steadily; consider scaling top‑performing creatives."
          placement="bottom"
        />
      </div>

      {/* ── gauge zone ── */}
      <div className="d-flex justify-content-center align-items-center position-relative">
        <GaugeChart
          id="clicks-gauge"
          animate
          nrOfLevels={120}
          arcsLength={[0.33, 0.33, 0.34]}
          colors={palette}
          percent={percent}
          arcWidth={0.18}
          arcPadding={0.008}
          needleWidth={2}
          needleHeightRatio={0.6} /* short enough to clear bottom edge */
          needleColor={active}
          needleBaseColor="#272B30"
          hideText
          style={{ width: "clamp(180px, 45vw, 320px)" }}
        />

        {/* endpoint labels */}
        {/* <small style={{ ...labelSty, position: "absolute", left: "6%", bottom: "12%" }}>
          0
        </small>
        <small
          style={{
            ...labelSty,
            position: "absolute",
            left: "50%",
            top: "7%",
            transform: "translateX(-50%)",
          }}
        >
          {n0(maxClicks / 2)}
        </small>
        <small
          style={{
            ...labelSty,
            position: "absolute",
            right: "1%",
            bottom: "12%",
            textAlign: "right",
          }}
        >
          {n0(maxClicks)}
        </small> */}
      </div>

      {/* ── KPI number & label BELOW the dial ── */}
      <div className="text-center mt-2">
        <div
          style={{
            fontSize: "clamp(1.4rem, 6vw, 2.4rem)",
            fontWeight: 700,
            color: active,
            lineHeight: 1.1,
          }}
        >
          {n0(kpi.clicks)}
        </div>
        <small style={{ ...labelSty }}>Clicks</small>
      </div>

      {/* ── CPA badge ── */}
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
          <FiArrowUpRight style={{ color: active }} />
          <span style={{ color: active }}>${n2(cpa)}</span>
        </span>
      </div>
    </Card>
  );
}
