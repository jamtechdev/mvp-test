"use client";

import { Card } from "react-bootstrap";
import GaugeComponent from "react-gauge-component"; // ⬅️ new gauge lib
import { FiArrowUpRight } from "react-icons/fi";
import InfoPopover from "./InsightModel";

/* number formatters */
const n0 = (n) => n.toLocaleString("en-US");
const n2 = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function ClicksGauge({ kpi, cpa, maxClicks = 150_000 }) {
  /* gauge maths & active colour */
  const percent = Math.min(kpi.clicks / maxClicks, 1);
  const palette = ["#FF5160", "#FFC107", "#12C99B"]; // red | amber | teal
  const active =
    percent < 0.33 ? palette[0] : percent < 0.66 ? palette[1] : palette[2];
  const labelSty = { fontSize: "0.72rem", color: "#8A8F9A" };

  return (
    <Card className="p-4 shadow-sm h-100 d-flex flex-column">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold text-secondary mb-0">Clicks – 30 days</h6>
        <InfoPopover
          title="Clicks Trend – AI Insight"
          description="Clicks are rising steadily; consider scaling top‑performing creatives."
          placement="bottom"
        />
      </div>

      {/* dial */}
      <div className="d-flex justify-content-center align-items-center">
        <GaugeComponent
          type="semicircle"
          value={percent * 100}
          minValue={0}
          maxValue={100}
          /* arc shape & colours */
          arc={{
            width: 0.18,
            padding: 0.008,
            cornerRadius: 3,
            subArcs: [
              { limit: 33, color: palette[0] },
              { limit: 66, color: palette[1] },
              { limit: 100, color: palette[2] },
            ],
          }}
          /* neat, slender needle */
          pointer={{
            type: "needle", // cleaner than "arrow" in a half‑dial
            color: active, // inherits zone colour
            baseColor: "#272B30",
            length: 0.7, // 70 % of radius
            width: 4, // slim shaft
            baseSize: 12, // small hub disc
          }}
          /* hide ALL library labels */
          labels={{
            valueLabel: { formatTextValue: () => "" }, // no centre % text
            tickLabels: {
              defaultTickLabelConfig: { formatTextValue: () => "" },
            },
            minMaxLabel: { show: false }, // suppress “0 / 100”
          }}
          style={{ width: "clamp(180px, 45vw, 320px)" }}
        />
      </div>

      {/* KPI number & label (below dial) */}
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
        <small style={{ ...labelSty, marginTop: 6, display: "block" }}>
          Clicks
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
          <FiArrowUpRight style={{ color: active }} />
          <span style={{ color: active }}>${n2(cpa)}</span>
        </span>
      </div>
    </Card>
  );
}
