"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Card, ButtonGroup, ToggleButton, ProgressBar } from "react-bootstrap";
import { FiTrendingUp } from "react-icons/fi";
import InfoPopover from "./InsightModel";
import { n0 } from "@/_utils/formatNumber";
import unified from "../../_data/unifiedPayload.json";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const METRIC_COLORS = {
  spend: "#6366f1",
  impressions: "#14b8a6",
  clicks: "#f97316",
  leads: "#0ea5e9",
  revenue: "#ef4444",
};

export default function KPITrendCard() {
  const [metric, setMetric] = useState("spend");
  const color = METRIC_COLORS[metric];

  // Get selected metric's object from unified JSON
  const selectedMetric = useMemo(() => {
    return (
      unified.kpi_trend?.metrics?.find((m) => m.key === metric) || {
        total: 0,
        daily: [],
      }
    );
  }, [metric]);

  const seriesData = useMemo(() => {
    return selectedMetric.daily.map((point) => ({
      x: new Date(point.date),
      y: point.value,
    }));
  }, [selectedMetric]);

  const total = n0(selectedMetric.total);
  const todayVal = seriesData.at(-1)?.y ?? 0;
  const best = Math.max(...seriesData.map((p) => p.y), 0);
  const pctToday = best ? Math.round((todayVal / best) * 100) : 0;

  const aiPayload = useMemo(
    () => ({
      metric,
      label: selectedMetric.label,
      total: selectedMetric.total,
      trend: selectedMetric.trend,
      change: selectedMetric.change,
      series: seriesData,
      related:
        selectedMetric.daily?.flatMap((d) => ({
          date: d.date,
          ads: d.related_ads || [],
          campaigns: d.related_campaigns || [],
          channels: d.related_channels || [],
        })) || [],
    }),
    [metric, selectedMetric, seriesData]
  );

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
    <Card className="p-4 h-100 flex-fill shadow-sm rounded-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">KPI Trend</h6>
        <InfoPopover
          title="KPI Trend – AI Insight"
          payload={aiPayload}
          placement="bottom"
          description="Switch metrics to see their trend over time."
        />
      </div>

      {/* Total */}
      <div className="mb-3 text-muted fw-semibold">
        <Stat icon={<FiTrendingUp />} label={`Total ${metric}`} value={total} />
      </div>

      {/* Metric Toggle */}
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
              backgroundColor: metric === m ? METRIC_COLORS[m] : "transparent",
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

      {/* Bar */}
      <ProgressBar
        className="bg-light mb-3"
        style={{ height: 6, borderRadius: 4, overflow: "hidden" }}
      >
        <ProgressBar
          now={pctToday}
          key={metric}
          animated
          visuallyHidden
          style={{ backgroundColor: color }}
        />
      </ProgressBar>

      {/* Chart */}
      <ApexChart
        type="line"
        height={200}
        series={[{ name: metric, data: seriesData }]}
        options={options}
      />
    </Card>
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
