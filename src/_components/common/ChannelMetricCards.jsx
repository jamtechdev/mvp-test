"use client";

import { Row, Col, Card } from "react-bootstrap";
import dynamic from "next/dynamic";
import InfoPopover from "./InsightModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

/* ────────── helpers ────────── */
const fmtNumber = (v = 0) => Number(v).toLocaleString();

/* shorter “88 k / 2.3 M” for cramped bars */
const fmtShort = (v = 0) =>
  v >= 1_000_000
    ? `${(v / 1_000_000).toFixed(1)} M`
    : v >= 1_000
    ? `${(v / 1_000).toFixed(0)} k`
    : v.toString();

const fmtCurrency = (v = 0) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(v);

/* consistent palette */
const COLORS = [
  "#4e79ff",
  "#ffaf40",
  "#28c76f",
  "#ff5b5c",
  "#ffc048",
  "#9358ff",
  "#20c997",
];

export default function ChannelMetricCards({ devicePie, sessions, revenue }) {
  const CARDS = [
    { label: "Device Sessions", data: devicePie, formatter: fmtNumber },
    {
      label: "Sessions by Channel",
      data: sessions,
      formatter: fmtShort, // short form for bar labels
    },
    { label: "Revenue per Channel", data: revenue, formatter: fmtCurrency },
  ];

  return (
    <Row className="g-4 mb-4">
      {CARDS.map(({ label, data, formatter }, idx) => {
        const isPie = idx === 0;
        /* adaptive height for bar chart (45 px per row + padding) */
        const height = isPie ? 340 : data.labels.length * 45 + 80;

        const total = data.series.reduce((a, b) => a + b, 0);
        const categories = data.labels.map((l) =>
          l.replace(/\b\w/g, (c) => c.toUpperCase())
        );

        /* ---------- pie options ---------- */
        const pieOptions = {
          chart: { type: "donut", toolbar: { show: false } },
          labels: categories,
          colors: COLORS,
          stroke: { show: false },
          dataLabels: {
            enabled: true,
            formatter,
            style: { fontSize: "12px", fontWeight: 500 },
          },
          tooltip: { y: { formatter } },
          legend: {
            position: "bottom",
            fontSize: "13px",
            formatter: (_n, opts) => {
              const raw = data.series[opts.seriesIndex] ?? 0;
              const pct = total ? ((raw / total) * 100).toFixed(1) : "0.0";
              return `<span class="fw-bold text-muted">${_n}: ${formatter(
                raw
              )} (${pct}%)</span>`;
            },
          },
          plotOptions: {
            pie: {
              donut: {
                size: "60%",
                labels: {
                  show: true,
                  total: {
                    show: true,
                    label: "Total",
                    fontSize: "14px",
                    fontWeight: 600,
                    formatter: () => formatter(total),
                  },
                },
              },
            },
          },
        };

        /* ---------- bar options ---------- */
        const barOptions = {
          chart: { type: "bar", toolbar: { show: false } },
          plotOptions: {
            bar: {
              horizontal: true,
              distributed: true,
              barHeight: "40%", // slimmer bars
            },
          },
          xaxis: { categories },
          colors: COLORS,
          dataLabels: {
            enabled: true,
            formatter,
            offsetX: 6, // push label out of bar
            style: { fontSize: "12px", fontWeight: 500 },
          },
          tooltip: { y: { formatter } },
          legend: { show: false },
        };

        return (
          <Col md={4} key={label}>
            <Card className="p-3 h-100 d-flex flex-column campign-card">
              {/* header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-semibold text-muted mb-0 flex-grow-1 text-center">
                  {label}
                </h6>
                <InfoPopover
                  title={`${label} – AI Insight`}
                  description={`Quick insight for ${label.toLowerCase()}.`}
                  placement="bottom"
                />
              </div>

              {/* chart */}
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
