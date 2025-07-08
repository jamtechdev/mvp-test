"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Col,
  Card,
  ButtonGroup,
  ToggleButton,
  ProgressBar,
} from "react-bootstrap";
import { FiTrendingUp } from "react-icons/fi";
import { n0 } from "@/_utils/formatNumber";
import InfoPopover from "./InsightModel";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const METRIC_COLORS = {
  spend: "#6366f1",
  impressions: "#14b8a6",
  clicks: "#f97316",
  leads: "#0ea5e9",
  revenue: "#ef4444",
};

function buildSeries(days, base, swing = 0.15) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));

    const y = Math.round(base * (1 + swing * Math.sin(i / 3)));
    return { x: d, y };
  });
}

const STATIC_SERIES = {
  spend: buildSeries(30, 5000),
  impressions: buildSeries(30, 90000),
  clicks: buildSeries(30, 8000),
  leads: buildSeries(30, 1200),
  revenue: buildSeries(30, 600),
};

export default function KPITrendCard() {
  const [metric, setMetric] = useState("spend");
  const color = METRIC_COLORS[metric];

  const seriesData = useMemo(() => STATIC_SERIES[metric], [metric]);

  const total = n0(seriesData.reduce((t, p) => t + p.y, 0));
  const todayVal = seriesData.at(-1)?.y ?? 0;
  const best = Math.max(...seriesData.map((p) => p.y));
  const pctToday = best ? Math.round((todayVal / best) * 100) : 0;

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "Inter, sans-serif",
    },
    stroke: { width: 3, curve: "smooth", colors: [color] },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.35,
        opacityFrom: 0.25,
        opacityTo: 0,
        stops: [0, 90, 100],
        colorStops: [{ offset: 0, color }],
      },
    },
    xaxis: {
      type: "datetime",
      labels: { format: "dd MMM", style: { colors: "#6b7280" } },
      axisBorder: { show: true, color: "#d1d5db" },
      axisTicks: { show: true, color: "#d1d5db" },
    },
    yaxis: {
      labels: {
        formatter: (v) => v.toLocaleString("en-US"),
        style: { colors: "#6b7280" },
      },
    },
    grid: { strokeDashArray: 3, padding: { left: 12, right: 12, bottom: -6 } },
    tooltip: {
      x: { format: "dd MMM" },
      y: { formatter: (v) => v.toLocaleString("en-US") },
      marker: { show: false },
    },
    colors: [color],
  };

  return (
    <Col xl={4} md={12} className="d-flex">
      <Card className="p-4 h-100 flex-fill shadow-sm rounded-4">
        {/* header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
           <h6 className="fw-semibold mb-0">KPI Trend</h6>
          <InfoPopover
            title="KPI Trend – AI Insight"
            description="Switch metrics to see their trend over time."
            placement="bottom"
          />
        </div>

        {/* headline total */}
        <div className="mb-3 text-muted fw-semibold">
          <Stat
            icon={<FiTrendingUp />}
            label={`Total ${metric}`}
            value={total}
          />
        </div>

        {/* metric selector */}
        <ButtonGroup className="mb-3 flex-wrap">
          {Object.keys(METRIC_COLORS).map((m) => (
            <ToggleButton
              key={m}
              id={`metric-${m}`}
              type="radio"
              size="sm"
              variant={metric === m ? "primary" : "outline-secondary"}
              value={m}
              checked={metric === m}
              onChange={() => setMetric(m)}
              style={{
                borderColor: METRIC_COLORS[m],
                backgroundColor:
                  metric === m ? METRIC_COLORS[m] : "transparent",
                color: metric === m ? "#fff" : METRIC_COLORS[m],
                marginRight: 6,
                marginBottom: 6,
                paddingInline: 12,
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </ToggleButton>
          ))}
        </ButtonGroup>

        {/* today‑vs‑best bar */}
        <ProgressBar
          className="bg-light mb-3"
          style={{ height: 6, borderRadius: 4, overflow: "hidden" }}
        >
          <ProgressBar
            now={pctToday}
            style={{ backgroundColor: color }}
            key={metric}
            animated
            visuallyHidden
          />
        </ProgressBar>

        {/* trend line */}
        <ApexChart
          type="line"
          height={200}
          series={[{ name: metric, data: seriesData }]}
          options={options}
        />
      </Card>
    </Col>
  );
}

function Stat({ icon, label, value }) {
  return (
    <Card className="shadow-sm border-0 p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <span className="fs-3 text-primary">{icon}</span>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold text-muted fs-5">{value}</div>
        </div>
      </div>
    </Card>
  );
}
