"use client";

import { Row, Col, Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import InfoPopover from "./InsightModel";
import unified from "../../_data/unifiedPayload.json";
import useThemeScheme from "../../hooks/useThemeScheme";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const fmtNumber = (v = 0) => Number(v).toLocaleString();
const fmtShort = (v = 0) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)} M`
    : v >= 1_000
    ? `${(v / 1_000).toFixed(0)}k`
    : v.toString();
const fmtAxis = (v = 0) => (v >= 1_000 ? `${v / 1_000}k` : v.toString());
const fmtCurrencyShort = (v = 0) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)} M`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(0)}k`
    : `$${v}`;

const COLORS = [
  "#4e79ff",
  "#ffaf40",
  "#28c76f",
  "#ff5b5c",
  "#ffc048",
  "#9358ff",
  "#20c997",
];

export default function ChannelMetricCards() {
  const scheme = useThemeScheme();
  const isDarkMode = scheme === "dark";
  const [isMounted, setIsMounted] = useState(false);

  const metrics = unified.channel_metrics || {};

  const CARDS = [
    {
      label: "Device Sessions",
      type: "pie",
      data: metrics.device_sessions || { labels: [], series: [] },
      formatter: fmtNumber,
    },
    {
      label: "Sessions by Channel",
      type: "bar",
      data: metrics.sessions_by_channel || { labels: [], series: [] },
      formatter: fmtShort,
    },
    {
      label: "Revenue per Channel",
      type: "bar",
      data: metrics.revenue_per_channel || { labels: [], series: [] },
      formatter: fmtCurrencyShort,
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Row className="g-4 mb-4">
      {CARDS.map(({ label, data, formatter, type }) => {
        const isPie = type === "pie";
        const height = isPie ? 340 : (data.labels?.length || 1) * 45 + 80;
        const total = Array.isArray(data.series)
          ? data.series.reduce((a, b) => a + b, 0)
          : 0;
        const categories = (data.labels || []).map((l) =>
          l.replace(/\b\w/g, (c) => c.toUpperCase())
        );

        const pieOptions = {
          chart: {
            type: "donut",
            toolbar: { show: false },
            foreColor: isDarkMode ? "#ffffff" : "#343a40",
          },
          labels: categories,
          colors: COLORS,
          stroke: { show: false },
          dataLabels: {
            enabled: true,
            formatter: (_val, opts) => {
              const raw = data.series[opts.seriesIndex];
              return `${raw}`;
            },
            style: {
              fontSize: "16px",
              fontWeight: 700,
              colors: categories.map(() =>
                isDarkMode ? "#ffffff" : "#ffffff"
              ),
            },
          },
          tooltip: {
            theme: isDarkMode ? "dark" : "light",
            y: { formatter: (val) => `${val}` },
          },
          legend: {
            position: "bottom",
            fontSize: "13px",
            labels: {
              colors: isDarkMode ? "#ffffff" : "#495057",
            },
            formatter: (_n, opts) => {
              const raw = data.series[opts.seriesIndex] ?? 0;
              const pct = total ? ((raw / total) * 100).toFixed(1) : "0.0";
              return `<span class="fw-bold">${_n}: ${raw} (${pct}%)</span>`;
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: "65%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "Total",
                    fontSize: "16px",
                    fontWeight: 700,
                    formatter: () => formatter(total),
                    color: isDarkMode ? "#ffffff" : "#212529",
                  },
                },
              },
            },
          },
        };

        const maxVal = Math.max(...data.series) * 1.2;

        const barOptions = {
          chart: {
            type: "bar",
            toolbar: { show: false },
            foreColor: isDarkMode ? "#f8f9faff" : "#343a40",
          },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
              barHeight: "40%",
            },
          },
          xaxis: {
            categories,
            min: 0,
            max: maxVal,
            tickAmount: 4,
            labels: {
              formatter: fmtAxis,
              style: { colors: isDarkMode ? "#e9ecef" : "#495057" },
            },
          },
          colors: COLORS,
          dataLabels: {
            enabled: true,
            formatter,
            offsetX: 6,
            style: {
              fontSize: "12px",
              fontWeight: 500,
              colors: [isDarkMode ? "#ffffff" : "#ffffff"],
            },
          },
          tooltip: {
            theme: isDarkMode ? "dark" : "light",
            y: { formatter },
          },
          legend: { show: false },
        };

        return (
          <Col xs={12} sm={6} lg={4} key={label}>
            <Card className="p-3 h-100 d-flex flex-column campign-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold text-muted mb-0 flex-grow-1 text-center">
                  {label}
                </h6>
                <InfoPopover
                  title={`${label} – AI Insight`}
                  description={`Quick insight for ${label.toLowerCase()}.`}
                  placement="bottom"
                  payload={{
                    label,
                    type,
                    series: data.series,
                    labels: data.labels,
                    context: {
                      total,
                      kpis: {
                        revenue: unified.kpi_cards?.metrics?.find(
                          (m) => m.key === "revenue"
                        )?.value,
                        sessions: unified.kpi_cards?.metrics?.find(
                          (m) => m.key === "sessions"
                        )?.value,
                        spend: unified.kpi_cards?.metrics?.find(
                          (m) => m.key === "spend"
                        )?.value,
                      },
                      comparison: {
                        revenue_per_channel:
                          unified.channel_metrics?.revenue_per_channel || {},
                        sessions_by_channel:
                          unified.channel_metrics?.sessions_by_channel || {},
                        device_sessions:
                          unified.channel_metrics?.device_sessions || {},
                        channel_device_sessions:
                          unified.channel_device_sessions || [],
                      },
                      trends: {
                        revenue_by_channel_daily:
                          unified.revenue_by_channel_daily || [],
                        funnel_by_date: unified.campaign_funnel?.by_date || [],
                      },
                      campaigns: unified.campaign_analytics?.campaigns || [],
                      ads: unified.campaign_analytics?.ads || [],
                    },
                  }}
                  caseId={
                    label === "Device Sessions"
                      ? "deviceSessions"
                      : label === "Sessions by Channel"
                      ? "sessionsByChannel"
                      : "revenuePerChannel"
                  }
                />
              </div>

              <Chart
                type={isPie ? "donut" : "bar"}
                height={height}
                series={isPie ? data.series : [{ data: data.series }]}
                options={isPie ? pieOptions : barOptions}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
