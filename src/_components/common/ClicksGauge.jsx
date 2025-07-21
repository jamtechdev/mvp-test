"use client";

import { Card } from "react-bootstrap";
import GaugeComponent from "react-gauge-component";
import { FiArrowUpRight } from "react-icons/fi";
import InfoPopover from "./InsightModel";
import unified from "../../_data/unifiedPayload.json";
import useThemeScheme from "@/hooks/useThemeScheme";

const dollarFmt = (n) =>
  `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const shortFmt = (n) => `$${n}`;

const palette = ["#12C99B", "#FFC107", "#FF5160"];
const dotStyle = { width: 10, height: 10, borderRadius: "50%", marginRight: 6 };

export default function AcquisitionCostGauge({ maxCost = 100 }) {
  const scheme = useThemeScheme();
  const isDark = scheme === "dark";

  const textColor = isDark ? "#ffffff" : "#212529"; // Bootstrap text-dark
  const mutedTextColor = isDark ? "#cccccc" : "#6C757D";

  const acquisitionCost = 24;
  const cpa = unified.analytics.kpi?.cpa || 0;
  const percent = Math.min((acquisitionCost / maxCost) * 100, 100);

  const activeColor =
    acquisitionCost <= 50
      ? palette[0]
      : acquisitionCost <= 70
      ? palette[1]
      : palette[2];

  const ranges = [
    { color: palette[0], label: "$0–50" },
    { color: palette[1], label: "$51–70" },
    { color: palette[2], label: "$71+" },
  ];

  return (
    <Card className="p-4 shadow-sm h-100 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0" style={{ color: textColor }}>
          Cost Per Acquisition
        </h6>
        <InfoPopover
          title="Salary Estimate – AI Insight"
          payload={{ acquisitionCost, cpa }}
          description="This shows the estimated hourly rate for the cosplay position. Adjust your budget or expectations accordingly."
          placement="bottom"
          caseId="acquisitionCost"
        />
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <GaugeComponent
          type="semicircle"
          value={percent}
          minValue={0}
          maxValue={100}
          arc={{
            width: 0.18,
            padding: 0.008,
            cornerRadius: 3,
            subArcs: [
              { limit: 50, color: palette[0] },
              { limit: 70, color: palette[1] },
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
            style={{ fontSize: "0.75rem", color: mutedTextColor }}
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
          {shortFmt(acquisitionCost)}
        </div>
        <small
          style={{
            fontSize: "0.72rem",
            color: mutedTextColor,
            marginTop: 6,
            display: "block",
          }}
        >
          Cost Per Acquisition
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
          <span style={{ color: activeColor }}>{shortFmt(cpa)}</span>
        </span>
      </div>
    </Card>
  );
}
