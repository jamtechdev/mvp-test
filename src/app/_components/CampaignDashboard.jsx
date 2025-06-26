"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, Row, Col, Table } from "react-bootstrap";
import {
  FiTrendingUp,
  FiPieChart,
  FiShoppingCart,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi";

import {
  getData,
  computeKPIs,
  topCampaigns,
  makeXAxis,
  channelPie,
  deviceBreakdown,
  sessionChannelBreakdown,
  browserUsage,
  keywordStats,
  topPages,
} from "@/_utils/campaignUtils";
import { n0, n2 } from "@/_utils/formatNumber";
import InfoPopover from "@/_components/common/InsightModel";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
export default function CampaignDashboard({ channel = "all" }) {
  /* ---------- state ---------- */
  const canonical = channel.toLowerCase();
  const [mounted, setMounted] = useState(false);
  const [pvSeries, setPvSeries] = useState([]);

  useEffect(() => {
    setMounted(true);
    setPvSeries(
      Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
    );
  }, []);

  /* ---------- data ---------- */
  const rows = useMemo(() => getData(canonical), [canonical]);
  const kpi = useMemo(() => computeKPIs(rows), [rows]);
  const campaigns = useMemo(() => topCampaigns(rows), [rows]);
  const pieClicks = useMemo(() => channelPie(rows), [rows]);
  const devicePie = useMemo(() => deviceBreakdown(), []);
  const sessions = useMemo(() => sessionChannelBreakdown(rows), [rows]);
  const browsers = useMemo(() => browserUsage(), []);
  const keywords = useMemo(() => keywordStats(rows), [rows]);
  const pages = useMemo(() => topPages(rows), [rows]);

  /* ---------- helpers ---------- */
  const xCats = makeXAxis(campaigns);
  const formatCompact = (v) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
      ? `${(v / 1_000).toFixed(1)}K`
      : v.toFixed(0);
  const shorten = (s) => (s.length > 14 ? `${s.slice(0, 11)}…` : s);

  const vibrantColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD93D",
    "#1A73E8",
    "#F72585",
    "#3A0CA3",
    "#F9844A",
    "#43AA8B",
    "#F9C74F",
    "#9D4EDD",
  ];
  const [showInsight, setShowInsight] = useState(false);
  const infoRef = useRef(null);
  return (
    <div className="container-fluid py-4">
      {/* ================= KPI CARDS ================= */}
      <Row className="g-3 mb-0">
        {/* Clicks */}
        <Col xl={3} md={6}>
          <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
            <InfoPopover
              title="Clicks – AI Insight"
              description="When AI analysis is ready, this will include performance evaluation and recommendations to improve your campaign."
              placement="bottom"
            />
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-9">
                  <span>Clicks</span>
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="fs-20 mt-1 mb-0">4,500</h3>
                    <span className="d-inline-block bg-success text-success bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
                      <i className="ri-arrow-up-s-fill fs-20 lh-1 me-1"></i>{" "}
                      37.5%
                    </span>
                  </div>
                  <span className="fs-12">Last 30 days</span>
                </div>
                <div className="col-lg-3 align-self-center">
                  <FiTrendingUp />
                </div>
              </div>
            </div>
          </div>
        </Col>
        {/* Impressions */}
        <Col xl={3} md={6}>
          <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
            <InfoPopover
              title="Impressions – AI Insight"
              description="Impression share dropped – broaden match types or raise bids."
              placement="bottom"
            />
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-9">
                  <span>Impressions</span>
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="fs-20 mt-1 mb-0">117,883,323</h3>
                    <span className="d-inline-block bg-danger text-danger bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
                      <i className="ri-arrow-down-s-fill fs-20 lh-1 me-1"></i>{" "}
                      37.5%
                    </span>
                  </div>
                  <span className="fs-12">Last 30 days</span>
                </div>
                <div className="col-lg-3 align-self-center">
                  <FiPieChart />
                </div>
              </div>
            </div>
          </div>
        </Col>
        {/* Spend */}
        <Col xl={3} md={6}>
          <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
            <InfoPopover
              title="Spend – AI Insight"
              description="Spend efficiency improved. Keep monitoring CPA."
              placement="bottom"
            />
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-9">
                  <span>Spend ($)</span>
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="fs-20 mt-1 mb-0">264,477</h3>
                    <span className="d-inline-block bg-success text-success bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
                      <i className="ri-arrow-down-s-fill fs-20 lh-1 me-1"></i>{" "}
                      37.5%
                    </span>
                  </div>
                  <span className="fs-12">Last 30 days</span>
                </div>
                <div className="col-lg-3 align-self-center">
                  <FiShoppingCart />
                </div>
              </div>
            </div>
          </div>
        </Col>
        {/* Avg CPC */}
        <Col xl={3} md={6}>
          <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
            <InfoPopover
              title="CPC – AI Insightt"
              description="CPC trending down 5 %. Keep testing creatives."
              placement="bottom"
            />
            <div className="card-body p-4">
              <div className="row">
                <div className="col-lg-9">
                  <span>Spend ($)</span>
                  <div className="d-flex align-items-center mb-3">
                    <h3 className="fs-20 mt-1 mb-0">264,477</h3>
                    <span className="d-inline-block bg-success text-success bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
                      <i className="ri-arrow-down-s-fill fs-20 lh-1 me-1"></i>{" "}
                      37.5%
                    </span>
                  </div>
                  <span className="fs-12">Last 30 days</span>
                </div>
                <div className="col-lg-3 align-self-center">
                  <span style={{ fontSize: "37px" }}>💰</span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* ================= Campaign Overview & Realtime ================= */}
      <Row className="g-4 mb-4">
        {/* Campaign Overview */}
        <Col xl={8} md={12} className="d-flex">
          <Card className="p-3 campign-card h-100 flex-fill">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold text-muted mb-0">Campaign Overview</h6>

              <InfoPopover
                title="Campaign Overview – AI Insight"
                description="Shift budget from low-CTR campaigns; expand high-CTR segments."
                placement="bottom"
              />
            </div>

            <div style={{ minHeight: 360 }}>
              {mounted && campaigns.length ? (
                <Chart
                  type="bar"
                  height={360}
                  className="custome-width"
                  series={[
                    { name: "Clicks", data: campaigns.map((r) => r.clicks) },
                    {
                      name: "Impressions",
                      data: campaigns.map((r) => r.impressions),
                    },
                    {
                      name: "Website Clicks",
                      data: campaigns.map((r) => r.website_clicks),
                    },
                  ]}
                  options={{
                    chart: {
                      stacked: true,
                      toolbar: { show: false },
                      foreColor: "#6c757d",
                      animations: { easing: "easeinout", speed: 700 },
                    },
                    plotOptions: {
                      bar: {
                        columnWidth: "50%",
                        borderRadius: 6,
                        borderRadiusApplication: "end",
                      },
                    },
                    fill: { opacity: 0.85 },
                    stroke: { show: true, width: 1, colors: ["#fff"] },
                    dataLabels: { enabled: false },
                    colors: vibrantColors.slice(0, 3),
                    xaxis: {
                      categories: xCats,
                      tickPlacement: "between",
                      tickAmount: Math.min(xCats.length, 7),
                      labels: {
                        rotate: -20,
                        hideOverlappingLabels: true,
                        formatter: (val) =>
                          val.length > 12 ? `${val.slice(0, 9)}…` : val,
                        style: { fontSize: 11, fontWeight: 500 },
                      },
                      axisBorder: { show: false },
                      axisTicks: { show: false },
                    },
                    yaxis: {
                      labels: {
                        formatter: formatCompact,
                        style: { fontSize: 11 },
                      },
                    },
                    legend: {
                      position: "top",
                      fontSize: 12,
                      markers: { radius: 4 },
                      itemMargin: { horizontal: 12 },
                    },
                    tooltip: { shared: true, intersect: false },
                    grid: {
                      strokeDashArray: 3,
                      padding: { left: 12, right: 12 },
                    },
                    responsive: [
                      {
                        breakpoint: 1200,
                        options: { xaxis: { labels: { rotate: -35 } } },
                      },
                      {
                        breakpoint: 768,
                        options: {
                          plotOptions: { bar: { columnWidth: "60%" } },
                          xaxis: { labels: { show: false } },
                        },
                      },
                    ],
                  }}
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  No chart data available
                </div>
              )}
            </div>
          </Card>
        </Col>

        {/* Realtime Active Users */}
        <Col xl={4} md={12} className="d-flex">
          <Card className="p-3 h-100 campign-card flex-fill">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold text-muted mb-0">
                Realtime Active Users
              </h6>

              <InfoPopover
                title="Realtime Users – AI Insight"
                description="Traffic peaks 12-2 PM; schedule posts then."
                placement="bottom"
              />
            </div>

            <div className="text-muted fw-semibold">
              <Stat
                icon={<FiActivity />}
                label="Est. Active Users"
                value={n0(kpi.clicks / 10)}
              />
            </div>

            {mounted && (
              <Chart
                type="bar"
                height={200}
                className="custome-width"
                series={[{ name: "PVs/sec", data: pvSeries }]}
                options={{
                  chart: {
                    toolbar: { show: false },
                    animations: { easing: "easeinout", speed: 400 },
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: "55%",
                      borderRadius: 4,
                      distributed: true,
                    },
                  },
                  colors: vibrantColors.slice(0, pvSeries.length),
                  dataLabels: { enabled: false },
                  xaxis: {
                    labels: { show: false },
                    axisTicks: { show: false },
                    axisBorder: { show: false },
                  },
                  yaxis: { show: false },
                  grid: { show: false },
                  tooltip: { y: { formatter: (v) => v.toString() } },
                }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* ================= Donut Charts ================= */}
      <Row className="g-4 mb-4">
        {[
          { label: "Device Sessions", data: devicePie },
          { label: "Sessions by Channel", data: sessions },
          { label: "Browser Used By Users", data: browsers },
        ].map(({ label, data }) => {
          const hasData = mounted && data.series.length;
          const height = 360;
          const total = data.series.reduce((a, b) => a + b, 0);

          const colors = [
            "#4e79ff",
            "#ffaf40",
            "#28c76f",
            "#ff5b5c",
            "#ffc048",
            "#9358ff",
            "#20c997",
          ];

          const options = {
            chart: {
              animations: { easing: "easeinout", speed: 600 },
              toolbar: { show: false },
              foreColor: "var(--bs-body-color)",
            },
            labels: data.labels.map((lbl) => {
              const map = {
                snapchat: "Snapchat",
                tiktok: "TikTok",
                pinterest: "Pinterest",
                x: "X",
                linkedin: "LinkedIn",
                "google ads": "Google Ads",
              };
              const fixed =
                map[lbl.toLowerCase()] ||
                lbl.replace(/\b\w/g, (c) => c.toUpperCase());

              return shorten(fixed);
            }),
            legend: {
              position: "bottom",
              horizontalAlign: "center",
              fontSize: "13px",
              itemMargin: { horizontal: 10, vertical: 4 },
              markers: { width: 10, height: 10, radius: 2 },
              formatter: (name, opts) => {
                const percent = (
                  (opts.w.globals.series[opts.seriesIndex] / total) *
                  100
                ).toFixed(1);
                return `<span class="fw-bold text-muted">${name} (${percent}%)</span>`;
              },
            },
            colors,
            stroke: { show: false },
            fill: { opacity: 0.92 },
            dataLabels: {
              enabled: true,
              formatter: (v) => `${v.toFixed(1)}%`,
              dropShadow: { enabled: false },
              style: { fontWeight: 700 },
            },
            tooltip: { y: { formatter: (v) => `${v.toFixed(1)}%` } },
            states: {
              hover: { filter: { type: "darken", value: 0.8 } },
              active: { filter: { type: "none" } },
            },
            responsive: [
              { breakpoint: 576, options: { legend: { show: false } } },
            ],
          };

          if (label === "Sessions by Channel") {
            options.plotOptions = {
              pie: {
                donut: {
                  size: "72%",
                  total: {
                    show: true,
                    showAlways: true,
                    label: "Total",
                    fontSize: "0.8rem",
                    className: "text-muted fw-bold",
                    formatter: () => total.toLocaleString(),
                  },
                },
              },
            };
          }

          return (
            <Col md={4} key={label}>
              <Card className="p-3 h-100 d-flex flex-column campign-card">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-semibold text-muted mb-0 flex-grow-1 text-center">
                    {label}
                  </h6>

                  <InfoPopover
                    title={`${label} – AI Insight`}
                    description={`Dummy insight for ${label.toLowerCase()}.`}
                    placement="bottom"
                  />
                </div>

                <div
                  className="flex-grow-1 d-flex align-items-center justify-content-center"
                  style={{ minHeight: height }}
                >
                  {hasData ? (
                    <Chart
                      type="donut"
                      height={height}
                      series={data.series}
                      options={options}
                    />
                  ) : (
                    <div className="text-center text-muted">
                      No data available
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* ================= 30-day Trend & Keyword Table ================= */}
      <Row className="g-4 mb-4">
        {/* Click trend */}
        <Col xl={4} md={12}>
          <Card className="p-3 campign-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold text-muted mb-0">Clicks – 30 days</h6>

              <InfoPopover
                title="Clicks Trend – AI Insight"
                description="Clicks stable with small uptick – add new creatives."
                placement="bottom"
              />
            </div>
            <Stat
              icon={<FiBarChart2 />}
              label="Clicks"
              value={n0(kpi.clicks)}
            />
            {mounted && campaigns.length ? (
              <Chart
                type="line"
                className="custome-width"
                height={120}
                series={[
                  { name: "Clicks", data: campaigns.map((c) => c.clicks) },
                ]}
                options={{
                  chart: { toolbar: { show: false } },
                  colors: ["#3C50E0"],
                  xaxis: { show: false },
                  yaxis: { show: false },
                  stroke: { width: 2 },
                }}
              />
            ) : (
              <div className="text-muted text-center py-5">
                No chart data available
              </div>
            )}
          </Card>
        </Col>

        {/* Keyword table */}
        <Col xl={8} md={12}>
          <Card className="p-3 h-100 campign-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Clicks/Impr. by Campaign</h6>

              <InfoPopover
                title="Clicks vs Impressions – AI Insight"
                description="Campaign D has high impressions but low clicks – improve ad copy."
                placement="bottom"
              />
            </div>
            <Table size="sm" hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Campaign</th>
                  <th className="text-end">Impr.</th>
                  <th className="text-end">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {keywords.length ? (
                  keywords.map((k, i) => (
                    <tr key={k.name + i}>
                      <td>{i + 1}</td>
                      <td>{k.name}</td>
                      <td className="text-end">{n0(k.impressions)}</td>
                      <td className="text-end">{n0(k.clicks)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No campaign data
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>

      {/* ================= Top Campaigns & Pages ================= */}
      <Row className="g-4">
        {/* Top campaigns */}
        <Col xl={6} md={12}>
          <Card className="p-3 campign-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Top Campaigns (Clicks)</h6>

              <InfoPopover
                title="Top Campaigns – AI Insight"
                description="Replicate Campaign A's targeting in under-performers."
                placement="bottom"
              />
            </div>

            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              <Table size="sm" hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Campaign</th>
                    <th className="text-end">Clicks</th>
                    <th className="text-end">Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.length ? (
                    campaigns.map((c, i) => (
                      <tr key={`${c.campaign_name}-${i}`}>
                        <td>{i + 1}</td>
                        <td>{c.campaign_name?.trim() || "Untitled"}</td>
                        <td className="text-end">{n0(c.clicks)}</td>
                        <td className="text-end">${n2(c.media_cost)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No campaign data
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>

        {/* Top pages */}
        <Col xl={6} md={12}>
          <Card className="p-3 h-100 campign-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Top Pages Today</h6>

              <InfoPopover
                title="Top Pages – AI Insight"
                description="Page X bounce rate high – improve on-page content."
                placement="bottom"
              />
            </div>
            <Table size="sm" hover responsive>
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Src</th>
                  <th className="text-end">Views</th>
                  <th className="text-end">Bounce</th>
                </tr>
              </thead>
              <tbody>
                {pages.length ? (
                  pages.map((p, i) => (
                    <tr key={`${p.page}-${i}`}>
                      <td>{p.page}</td>
                      <td>{p.source}</td>
                      <td className="text-end">{n0(p.views)}</td>
                      <td className="text-end">
                        {mounted ? `${parseFloat(p.bounce).toFixed(1)}%` : "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      No page data
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

/* ---------------- Tiny Stat helper ---------------- */
function Stat({ icon, label, value }) {
  return (
    <Card className="shadow-sm border-0 p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <span className="fs-3 text-primary">{icon}</span>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold fs-5 val">{value}</div>
        </div>
      </div>
    </Card>
  );
}
