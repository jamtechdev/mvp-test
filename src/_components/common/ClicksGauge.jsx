"use client";

import { Card } from "react-bootstrap";
import GaugeComponent from "react-gauge-component";
import { FiArrowUpRight } from "react-icons/fi";
import InfoPopover from "./InsightModel";
import unified from "/src/_data/unifiedPayload.json";

const kFmt = (n) => {
  if (n < 1_000) return n.toString();
  const v = n / 1_000;
  return v % 1 === 0 ? `${v}k` : `${v.toFixed(1)}k`;
};
const n2 = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const palette = ["#FF5160", "#FFC107", "#12C99B"];
const labelStyle = { fontSize: "0.72rem", color: "#8A8F9A" };
const dotStyle = { width: 10, height: 10, borderRadius: "50%", marginRight: 6 };

export default function ClicksGauge({ maxClicks = 150_000 }) {
  const clicks = unified.analytics.kpi.clicks || 0;
  const cpa = unified.analytics.kpi.cpa || 0;

  const percent = Math.min(clicks / maxClicks, 1);
  const activeColor =
    percent < 0.33 ? palette[0] : percent < 0.66 ? palette[1] : palette[2];

  const t1 = Math.round(maxClicks * 0.33);
  const t2 = Math.round(maxClicks * 0.66);
  const ranges = [
    { color: palette[0], label: `≤ ${kFmt(t1)}` },
    { color: palette[1], label: `${kFmt(t1 + 1)}‑${kFmt(t2)}` },
    { color: palette[2], label: `> ${kFmt(t2)}` },
  ];

  return (
    <Card className="p-4 shadow-sm h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">Cost Per Acquisition</h6>
        {/* <InfoPopover
          title="Clicks Trend – AI Insight"
          payload={{ clicks, cpa }}
          placement="bottom"
        /> */}
        <InfoPopover
          title="Clicks Trend – AI Insight"
          description="Clicks are rising steadily; consider scaling top‑performing creatives."
          placement="bottom"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <GaugeComponent
          type="semicircle"
          value={percent * 100}
          minValue={0}
          maxValue={100}
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
          pointer={{
            type: "needle",
            color: activeColor,
            baseColor: "#272B30",
            length: 0.7,
            width: 4,
            baseSize: 12,
          }}
          labels={{
            valueLabel: { formatTextValue: () => "" },
            tickLabels: {
              hideMinMax: true,
              defaultTickValueConfig: { hide: true },
              defaultTickLineConfig: { hide: true },
            },
          }}
          style={{ width: "clamp(180px, 45vw, 320px)" }}
        />
      </div>

      <div className="d-flex justify-content-center gap-3 mt-2">
        {ranges.map(({ color, label }) => (
          <div
            key={color}
            className="d-flex align-items-center"
            style={{ fontSize: "0.75rem", color: "#6C757D" }}
          >
            <span style={{ ...dotStyle, backgroundColor: color }} />
            {label}
          </div>
        ))}
      </div>

      <div className="text-center mt-2">
        <div
          style={{
            fontSize: "clamp(1.4rem, 6vw, 2.4rem)",
            fontWeight: 700,
            color: activeColor,
            lineHeight: 1.1,
          }}
        >
          {kFmt(clicks)}
        </div>
        <small style={{ ...labelStyle, marginTop: 6, display: "block" }}>
          Clicks
        </small>
      </div>

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
