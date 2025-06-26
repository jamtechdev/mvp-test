// "use client";
// import { useMemo, useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { Card, Row, Col, Table } from "react-bootstrap";
// import {
//   FiTrendingUp,
//   FiPieChart,
//   FiShoppingCart,
//   FiActivity,
//   FiBarChart2,
// } from "react-icons/fi";

// import {
//   getData,
//   computeKPIs,
//   topCampaigns,
//   makeXAxis,
//   channelPie,
//   deviceBreakdown,
//   sessionChannelBreakdown,
//   browserUsage,
//   keywordStats,
//   topPages,
// } from "@/_utils/campaignUtils";
// import { n0, n2 } from "@/_utils/formatNumber";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// export default function CampaignDashboard({ channel = "all" }) {
//   const canonical = channel.toLowerCase();
//   const [mounted, setMounted] = useState(false);
//   const [pvSeries, setPvSeries] = useState([]);

//   useEffect(() => {
//     setMounted(true);
//     setPvSeries(
//       Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
//     );
//   }, []);

//   const rows = useMemo(() => getData(canonical), [canonical]);
//   const kpi = useMemo(() => computeKPIs(rows), [rows]);
//   const campaigns = useMemo(() => topCampaigns(rows), [rows]);
//   const pieClicks = useMemo(() => channelPie(rows), [rows]);
//   const devicePie = useMemo(() => deviceBreakdown(), []);
//   const sessions = useMemo(() => sessionChannelBreakdown(rows), [rows]);
//   const browsers = useMemo(() => browserUsage(), []);
//   const keywords = useMemo(() => keywordStats(rows), [rows]);
//   const pages = useMemo(() => topPages(rows), [rows]);

//   const Stat = ({ icon, label, value }) => (
//     <Card className="shadow-sm border-0 p-3 h-100">
//       <div className="d-flex align-items-center gap-3">
//         <span className="fs-3 text-primary">{icon}</span>
//         <div>
//           <div className="text-muted small">{label}</div>
//           <div className="fw-bold fs-5 val">{value}</div>
//         </div>
//       </div>
//     </Card>
//   );

//   const c = {
//     blue: "#3C50E0",
//     orange: "#F79009",
//     green: "#22C55E",
//     pink: "#EF4444",
//     yellow: "#EAB308",
//   };
//   const vibrantColors = [
//     "#FF6B6B", // Red-pink
//     "#4ECDC4", // Turquoise
//     "#FFD93D", // Yellow
//     "#1A73E8", // Bright blue
//     "#F72585", // Pink
//     "#3A0CA3", // Purple
//     "#F9844A", // Orange
//     "#43AA8B", // Teal-green
//     "#F9C74F", // Golden yellow
//     "#9D4EDD", // Violet
//   ];

//   const formattedPages = useMemo(() => {
//     return pages.map((p) => {
//       const raw = parseFloat(String(p.bounce).replace("%", ""));
//       const safe = isNaN(raw) ? 0 : raw;
//       return { ...p, bounceFormatted: `${safe.toFixed(1)}%` };
//     });
//   }, [pages]);

//   const formatCompact = (val) =>
//     val >= 1_000_000
//       ? (val / 1_000_000).toFixed(1) + "M"
//       : val >= 1_000
//       ? (val / 1_000).toFixed(1) + "K"
//       : val.toFixed(0);
//   const xCats = makeXAxis(campaigns); // reuse in two places
//   /* ── helper utilities (declare once near the top of the file) ── */
//   /* ── helpers (declare once) ── */
//   const shorten = (lbl) => (lbl.length > 14 ? `${lbl.slice(0, 11)}…` : lbl);
//   const pct = (val, tot) => ((val / tot) * 100).toFixed(1);
//   return (
//     <div className="container-fluid py-4 ">
//       {/* KPI CARDS */}

//       <Row className="g-3 mb-0">
//         <Col xl={3} md={6}>
//           {/* <Stat icon={<FiTrendingUp />} label="Clicks" value={n0(kpi.clicks)} /> */}

//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="row">
//                 <div className="col-lg-9">
//                   <span>Clicks</span>
//                   <div className="d-flex align-items-center mb-3">
//                     <h3 className="fs-20 mt-1 mb-0">4,500</h3>
//                     <span className="d-inline-block bg-success text-success bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
//                       <i className="ri-arrow-up-s-fill fs-20 lh-1 me-1"></i>{" "}
//                       37.5%
//                     </span>
//                   </div>
//                   <span className="fs-12">Last 30 days</span>
//                 </div>
//                 <div className="col-lg-3 align-self-center">
//                   <FiTrendingUp />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Col>
//         <Col xl={3} md={6}>
//           {/* <Stat icon={<FiPieChart />} label="Impressions" value={n0(kpi.impressions)} /> */}
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="row">
//                 <div className="col-lg-9">
//                   <span>Impressions</span>
//                   <div className="d-flex align-items-center mb-3">
//                     <h3 className="fs-20 mt-1 mb-0">117,883,323</h3>
//                     <span className="d-inline-block bg-danger text-danger bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
//                       <i className="ri-arrow-down-s-fill fs-20 lh-1 me-1"></i>{" "}
//                       37.5%
//                     </span>
//                   </div>
//                   <span className="fs-12">Last 30 days</span>
//                 </div>
//                 <div className="col-lg-3 align-self-center">
//                   <FiPieChart />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Col>
//         <Col xl={3} md={6}>
//           {/* <Stat icon={<FiShoppingCart />} label="Spend ($)" value={n0(kpi.spend)} /> */}
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="row">
//                 <div className="col-lg-9">
//                   <span>Spend ($)</span>
//                   <div className="d-flex align-items-center mb-3">
//                     <h3 className="fs-20 mt-1 mb-0">264,477</h3>
//                     <span className="d-inline-block bg-success text-success bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
//                       <i className="ri-arrow-down-s-fill fs-20 lh-1 me-1"></i>{" "}
//                       37.5%
//                     </span>
//                   </div>
//                   <span className="fs-12">Last 30 days</span>
//                 </div>
//                 <div className="col-lg-3 align-self-center">
//                   <FiShoppingCart />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Col>
//         <Col xl={3} md={6}>
//           {/* <Stat icon="💰" label="Avg CPC" value={`$${n2(kpi.cpc)}`} /> */}
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="row">
//                 <div className="col-lg-9">
//                   <span>Spend ($)</span>
//                   <div className="d-flex align-items-center mb-3">
//                     <h3 className="fs-20 mt-1 mb-0">264,477</h3>
//                     <span className="d-inline-block bg-success text-success bg-opacity-25 px-2 rounded-1 fs-12 fw-medium d-flex align-items-center ms-2">
//                       <i className="ri-arrow-down-s-fill fs-20 lh-1 me-1"></i>{" "}
//                       37.5%
//                     </span>
//                   </div>
//                   <span className="fs-12">Last 30 days</span>
//                 </div>
//                 <div className="col-lg-3 align-self-center">
//                   <span style={{ fontSize: "37px" }}>💰</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* CAMPAIGN OVERVIEW + REALTIME USERS */}
//       <Row className="g-4 mb-4">
//         {/* ---------- Campaign Overview ---------- */}
//         <Col xl={8} md={12} className="d-flex">
//           <Card className="p-3 campign-card h-100 flex-fill">
//             <h6 className="fw-semibold text-muted mb-3">Campaign Overview</h6>

//             {/* fixed-height wrapper keeps card tall even when empty */}
//             <div style={{ minHeight: 360 }}>
//               {mounted && campaigns.length ? (
//                 <Chart
//                   type="bar"
//                   height={360}
//                   className="custome-width"
//                   series={[
//                     { name: "Clicks", data: campaigns.map((r) => r.clicks) },
//                     {
//                       name: "Impressions",
//                       data: campaigns.map((r) => r.impressions),
//                     },
//                     {
//                       name: "Website Clicks",
//                       data: campaigns.map((r) => r.website_clicks),
//                     },
//                   ]}
//                   options={{
//                     chart: {
//                       stacked: true,
//                       toolbar: { show: false },
//                       foreColor: "#6c757d",
//                       animations: { easing: "easeinout", speed: 700 },
//                     },
//                     plotOptions: {
//                       bar: {
//                         columnWidth: "50%",
//                         borderRadius: 6,
//                         borderRadiusApplication: "end", // only top corners rounded
//                       },
//                     },
//                     fill: { opacity: 0.85 },
//                     stroke: { show: true, width: 1, colors: ["#fff"] },
//                     dataLabels: { enabled: false },
//                     colors: vibrantColors.slice(0, 3),
//                     xaxis: {
//                       categories: xCats,
//                       tickPlacement: "between",
//                       tickAmount: Math.min(xCats.length, 7), // ≤7 labels
//                       labels: {
//                         rotate: -20,
//                         hideOverlappingLabels: true,
//                         formatter: (val) =>
//                           val.length > 12 ? `${val.slice(0, 9)}…` : val,
//                         style: { fontSize: "11px", fontWeight: 500 },
//                       },
//                       axisBorder: { show: false },
//                       axisTicks: { show: false },
//                     },
//                     yaxis: {
//                       labels: {
//                         formatter: formatCompact,
//                         style: { fontSize: "11px" },
//                       },
//                     },
//                     legend: {
//                       position: "top",
//                       fontSize: "12px",
//                       markers: { radius: 4 },
//                       itemMargin: { horizontal: 12 },
//                     },
//                     tooltip: { shared: true, intersect: false },
//                     grid: {
//                       strokeDashArray: 3,
//                       padding: { left: 12, right: 12 },
//                     },
//                     responsive: [
//                       {
//                         breakpoint: 1200,
//                         options: { xaxis: { labels: { rotate: -35 } } },
//                       },
//                       {
//                         breakpoint: 768,
//                         options: {
//                           plotOptions: { bar: { columnWidth: "60%" } },
//                           xaxis: { labels: { show: false } },
//                         },
//                       },
//                     ],
//                   }}
//                 />
//               ) : (
//                 <div className="d-flex align-items-center justify-content-center h-100 text-muted">
//                   No chart data available
//                 </div>
//               )}
//             </div>
//           </Card>
//         </Col>
//         {/* ---------- Realtime Active Users ---------- */}
//         <Col xl={4} md={12} className="d-flex">
//           <Card className="p-3 h-100 campign-card flex-fill">
//             <h6 className="fw-semibold text-muted mb-2">
//               Realtime Active Users
//             </h6>

//             <div className="text-muted fw-semibold">
//               <Stat
//                 icon={<FiActivity />}
//                 label="Est. Active Users"
//                 value={n0(kpi.clicks / 10)}
//               />
//             </div>

//             {mounted && (
//               <Chart
//                 type="bar"
//                 height={200}
//                 className="custome-width"
//                 series={[{ name: "PVs/sec", data: pvSeries }]}
//                 options={{
//                   chart: {
//                     toolbar: { show: false },
//                     animations: { easing: "easeinout", speed: 400 },
//                   },
//                   plotOptions: {
//                     bar: {
//                       columnWidth: "55%",
//                       borderRadius: 4,
//                       distributed: true,
//                     },
//                   },
//                   colors: vibrantColors.slice(0, pvSeries.length),
//                   dataLabels: { enabled: false },
//                   xaxis: {
//                     labels: { show: false },
//                     axisTicks: { show: false },
//                     axisBorder: { show: false },
//                   },
//                   yaxis: { show: false },
//                   grid: { show: false },
//                   tooltip: { y: { formatter: (v) => v.toString() } },
//                 }}
//               />
//             )}
//           </Card>
//         </Col>
//       </Row>

//       {/* DEVICE / SESSION / BROWSER */}
//       {/* <Row className="g-4 mb-4">
//         {[
//           { label: "Device Sessions", data: devicePie },
//           { label: "Sessions by Channel", data: sessions },
//           { label: "Browser Used By Users", data: browsers },
//         ].map((chart) => (
//           <Col md={4} key={chart.label}>
//             <Card className="p-3 h-100 d-flex flex-column justify-content-between campign-card">
//               <h6 className="mb-3 fw-semibold text-muted text-center">
//                 {chart.label}
//               </h6>
//               {mounted && chart.data.series.length ? (
//                 <Chart

//                   type="donut"
//                   height={360}
//                   series={chart.data.series}
//                   options={{
//                     labels: chart.data.labels,
//                     legend: {
//                       position: "bottom",
//                       horizontalAlign: "center",
//                       fontSize: "13px",
//                       itemMargin: { horizontal: 10, vertical: 4 },
//                       markers: { width: 10, height: 10 },
//                     },
//                     dataLabels: {
//                       enabled: true,
//                       formatter: (val) => `${val.toFixed(1)}%`,
//                     },
//                     tooltip: {
//                       y: { formatter: (val) => `${val.toFixed(1)}%` },
//                     },
//                     stroke: { show: false },
//                     colors: [c.blue, c.orange, c.green, c.pink, c.yellow],

//                   }}
//                 />
//               ) : (
//                 <div className="text-center text-muted py-5">No data</div>
//               )}
//               {chart.label === "Sessions by Channel" && (
//                 <div className="text-center mt-2 fw-semibold">
//                   Total {n0(sessions.total)}
//                 </div>
//               )}
//             </Card>
//           </Col>
//         ))}
//       </Row> */}
//       <Row className="g-4 mb-4">
//         {[
//           { label: "Device Sessions", data: devicePie },
//           { label: "Sessions by Channel", data: sessions },
//           { label: "Browser Used By Users", data: browsers },
//         ].map(({ label, data }) => {
//           const hasData = mounted && data.series.length;
//           const height = 360;

//           /* solid palette (works in dark & light) */
//           const colors = [
//             "#4e79ff", // blue
//             "#ffaf40", // orange
//             "#28c76f", // green
//             "#ff5b5c", // red-pink
//             "#ffc048", // yellow
//             "#9358ff", // purple  –- google-ads now shows!
//             "#20c997", // cyan
//           ];

//           const total = data.series.reduce((a, b) => a + b, 0);

//           const options = {
//             chart: {
//               animations: { easing: "easeinout", speed: 600 },
//               toolbar: { show: false },
//               foreColor: "var(--bs-body-color)", // auto-switch text colours
//             },
//             labels: data.labels.map((lbl) => {
//               const map = {
//                 snapchat: "Snapchat",
//                 tiktok: "TikTok",
//                 pinterest: "Pinterest",
//                 x: "X",
//                 linkedin: "LinkedIn",
//                 "google ads": "Google Ads",
//               };
//               const fixed =
//                 map[lbl.toLowerCase()] ||
//                 lbl.replace(/\b\w/g, (c) => c.toUpperCase());

//               return shorten(fixed); // still trims to 14 chars max
//             }),

//             legend: {
//               position: "bottom",
//               horizontalAlign: "center",
//               fontSize: "13px",
//               itemMargin: { horizontal: 10, vertical: 4 },
//               markers: { width: 10, height: 10, radius: 2 },
//               formatter: (name, opts) => {
//                 const percent = (
//                   (opts.w.globals.series[opts.seriesIndex] / total) *
//                   100
//                 ).toFixed(1);
//                 return `<span class="fw-bold text-muted">${name} (${percent}%)</span>`;
//               },
//             },

//             colors,
//             stroke: { show: false },
//             fill: { opacity: 0.92 },
//             legend: {
//               position: "bottom",
//               horizontalAlign: "center",
//               fontSize: "13px",
//               itemMargin: { horizontal: 10, vertical: 4 },
//               markers: { width: 10, height: 10, radius: 2 },
//               formatter: (name, opts) => {
//                 const percent = (
//                   (opts.w.globals.series[opts.seriesIndex] / total) *
//                   100
//                 ).toFixed(1);
//                 return `<span class="fw-bold text-muted">${name} (${percent}%)</span>`;
//               },
//             },
//             dataLabels: {
//               enabled: true,
//               formatter: (v) => `${v.toFixed(1)}%`,
//               dropShadow: { enabled: false },
//               style: { fontWeight: 700 }, // fw-bold inside the slices
//             },
//             tooltip: { y: { formatter: (v) => `${v.toFixed(1)}%` } },
//             states: {
//               hover: { filter: { type: "darken", value: 0.8 } },
//               active: { filter: { type: "none" } },
//             },
//             responsive: [
//               { breakpoint: 576, options: { legend: { show: false } } },
//             ],
//           };

//           /* centre-label only for Sessions-by-Channel */
//           if (label === "Sessions by Channel") {
//             options.plotOptions = {
//               pie: {
//                 donut: {
//                   size: "72%",
//                   name: {
//                     show: true,
//                     offsetY: -12,
//                     fontSize: "0.8rem",
//                     className: "text-muted fw-bold",
//                   },
//                   value: {
//                     show: true,
//                     fontSize: "1.25rem",
//                     className: "fw-bold",
//                     formatter: () => total.toLocaleString(),
//                   },
//                   total: {
//                     show: true,
//                     showAlways: true,
//                     fontSize: "0.8rem",
//                     label: "Total",
//                     className: "text-muted fw-bold",
//                     formatter: () => total.toLocaleString(),
//                   },
//                 },
//               },
//             };
//           }

//           return (
//             <Col md={4} key={label}>
//               <Card className="p-3 h-100 d-flex flex-column campign-card">
//                 {/* <h6 className="mb-3 fw-semibold text-muted text-center">
//                   {label}
//                 </h6> */}
//                 <h6 className="mb-3 fw-bold text-muted text-center">{label}</h6>

//                 <div
//                   className="flex-grow-1 d-flex align-items-center justify-content-center"
//                   style={{ minHeight: height }}
//                 >
//                   {hasData ? (
//                     <Chart
//                       type="donut"
//                       height={height}
//                       series={data.series}
//                       options={options}
//                     />
//                   ) : (
//                     <div className="empty-state w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center">
//                       <FiPieChart size={38} className="text-primary mb-2" />
//                       <span className="small text-muted">
//                         No data available
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>
//       {/* TRENDS & TABLES */}
//       <Row className="g-4 mb-4">
//         <Col xl={4} md={12}>
//           <Card className="p-3 campign-card h-100">
//             <h6 className="mb-1 fw-semibold text-muted">Clicks – 30 days</h6>
//             <Stat
//               icon={<FiBarChart2 />}
//               label="Clicks"
//               value={n0(kpi.clicks)}
//             />
//             {mounted && campaigns.length ? (
//               <Chart
//                 type="line"
//                 className="custome-width"
//                 height={120}
//                 series={[
//                   { name: "Clicks", data: campaigns.map((c) => c.clicks) },
//                 ]}
//                 options={{
//                   chart: { toolbar: { show: false } },
//                   colors: [c.blue],
//                   xaxis: { show: false },
//                   yaxis: { show: false },
//                   stroke: { width: 2 },
//                 }}
//               />
//             ) : (
//               <div className="text-muted text-center py-5">
//                 No chart data available
//               </div>
//             )}
//           </Card>
//         </Col>

//         <Col xl={8} md={12}>
//           <Card className="p-3 h-100 campign-card">
//             <h6 className="mb-3 fw-semibold  table-heading">
//               Clicks/Impr. by Campaign
//             </h6>
//             <Table size="sm" hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Campaign</th>
//                   <th className="text-end">Impr.</th>
//                   <th className="text-end">Clicks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {keywords.length ? (
//                   keywords.map((k, i) => (
//                     <tr key={k.name + i}>
//                       <td>{i + 1}</td>
//                       <td>{k.name}</td>
//                       <td className="text-end">{n0(k.impressions)}</td>
//                       <td className="text-end">{n0(k.clicks)}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="text-center text-muted">
//                       No campaign data
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card>
//         </Col>
//       </Row>
//       <Row className="g-4">
//         <Col xl={6} md={12}>
//           {/* TOP CAMPAIGNS */}
//           <Card className="p-3 mt-0 campign-card">
//             <h6 className="mb-3 fw-semibold  table-heading">
//               Top Campaigns (Clicks)
//             </h6>
//             <div style={{ maxHeight: 400, overflowY: "auto" }}>
//               <Table size="sm" hover responsive>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Campaign</th>
//                     <th className="text-end">Clicks</th>
//                     <th className="text-end">Spend</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {campaigns.length ? (
//                     campaigns.map((c, i) => (
//                       <tr key={`${c.ad_key || c.campaign_name}-${i}`}>
//                         <td>{i + 1}</td>
//                         <td>{c.campaign_name?.trim() || "Untitled"}</td>
//                         <td className="text-end">{n0(c.clicks)}</td>
//                         <td className="text-end">${n2(c.media_cost)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="text-center text-muted">
//                         No campaign data
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>
//           </Card>
//         </Col>

//         <Col xl={6} md={12}>
//           <Card className="p-3 h-100 campign-card">
//             <h6 className="mb-3 fw-semibold  table-heading">Top Pages Today</h6>
//             <Table size="sm" hover responsive>
//               <thead>
//                 <tr>
//                   <th>Page</th>
//                   <th>Src</th>
//                   <th className="text-end">Views</th>
//                   <th className="text-end">Bounce</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formattedPages.length ? (
//                   formattedPages.map((p, i) => (
//                     <tr key={`${p.page}-${i}`}>
//                       <td>{p.page}</td>
//                       <td>{p.source}</td>
//                       <td className="text-end">{n0(p.views)}</td>
//                       <td className="text-end">
//                         {mounted ? p.bounceFormatted : "—"}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="text-center text-muted">
//                       No page data
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// "use client";
// import { useMemo, useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import {
//   Card,
//   Row,
//   Col,
//   Table,
//   Modal,
//   Button,
//   OverlayTrigger,
//   Tooltip,
// } from "react-bootstrap";
// import {
//   FiTrendingUp,
//   FiPieChart,
//   FiShoppingCart,
//   FiActivity,
//   FiBarChart2,
//   FiInfo,
// } from "react-icons/fi";

// import {
//   getData,
//   computeKPIs,
//   topCampaigns,
//   makeXAxis,
//   channelPie,
//   deviceBreakdown,
//   sessionChannelBreakdown,
//   browserUsage,
//   keywordStats,
//   topPages,
// } from "@/_utils/campaignUtils";
// import { n0, n2 } from "@/_utils/formatNumber";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// /* -------------------------------------------------------------
//  * Re‑usable modal for AI insights
//  * -----------------------------------------------------------*/
// function AnalysisModal({ show, onHide, title = "AI Insights", text = "" }) {
//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{title}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p className="mb-0 small lh-lg">{text}</p>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// }

// /* =============================================================
//  * Main dashboard component
//  * ===========================================================*/
// export default function CampaignDashboard({ channel = "all" }) {
//   const canonical = channel.toLowerCase();
//   const [mounted, setMounted] = useState(false);
//   const [pvSeries, setPvSeries] = useState([]);

//   /* ---- modal state ---- */
//   const [showModal, setShowModal] = useState(false);
//   const [modalContent, setModalContent] = useState({ title: "", text: "" });
//   const openModal = (title, text) => {
//     setModalContent({ title, text });
//     setShowModal(true);
//   };

//   useEffect(() => {
//     setMounted(true);
//     setPvSeries(
//       Array.from({ length: 24 }, () => Math.floor(Math.random() * 100))
//     );
//   }, []);

//   /* ---- data helpers ---- */
//   const rows = useMemo(() => getData(canonical), [canonical]);
//   const kpi = useMemo(() => computeKPIs(rows), [rows]);
//   const campaigns = useMemo(() => topCampaigns(rows), [rows]);
//   const pieClicks = useMemo(() => channelPie(rows), [rows]);
//   const devicePie = useMemo(() => deviceBreakdown(), []);
//   const sessions = useMemo(() => sessionChannelBreakdown(rows), [rows]);
//   const browsers = useMemo(() => browserUsage(), []);
//   const keywords = useMemo(() => keywordStats(rows), [rows]);
//   const pages = useMemo(() => topPages(rows), [rows]);

//   /* ---- helpers ---- */
//   const formatCompact = (val) =>
//     val >= 1_000_000
//       ? (val / 1_000_000).toFixed(1) + "M"
//       : val >= 1_000
//       ? (val / 1_000).toFixed(1) + "K"
//       : val.toFixed(0);

//   const shorten = (lbl) => (lbl.length > 14 ? `${lbl.slice(0, 11)}…` : lbl);

//   const vibrantColors = [
//     "#FF6B6B",
//     "#4ECDC4",
//     "#FFD93D",
//     "#1A73E8",
//     "#F72585",
//     "#3A0CA3",
//     "#F9844A",
//     "#43AA8B",
//     "#F9C74F",
//     "#9D4EDD",
//   ];

//   /* ----------------------------------------------------------- */
//   /* KPI cards helper component                                  */
//   /* ----------------------------------------------------------- */
//   const Stat = ({ icon, label, value }) => (
//     <Card className="shadow-sm border-0 p-3 h-100">
//       <div className="d-flex align-items-center gap-3">
//         <span className="fs-3 text-primary">{icon}</span>
//         <div>
//           <div className="text-muted small">{label}</div>
//           <div className="fw-bold fs-5 val">{value}</div>
//         </div>
//       </div>
//     </Card>
//   );

//   /* ----------------------------------------------------------- */
//   /* JSX starts here                                             */
//   /* ----------------------------------------------------------- */
//   return (
//     <div className="container-fluid py-4">
//       {/* KPI CARDS */}
//       <Row className="g-3 mb-0">
//         {/* Clicks */}
//         <Col xl={3} md={6}>
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="d-flex justify-content-between align-items-start mb-2">
//                 <span>Clicks</span>
//                 <FiInfo
//                   role="button"
//                   className="text-primary ms-1"
//                   onClick={() =>
//                     openModal(
//                       "Clicks – AI Insights",
//                       "Your clicks increased 37.5% in the last 30 days. Consider reallocating budget to top converting campaigns to further boost performance."
//                     )
//                   }
//                 />
//               </div>
//               <div className="d-flex align-items-center mb-3">
//                 <h3 className="fs-20 mt-1 mb-0">{n0(kpi.clicks)}</h3>
//               </div>
//               <span className="fs-12 text-muted">Last 30 days</span>
//             </div>
//           </div>
//         </Col>
//         {/* Impressions */}
//         <Col xl={3} md={6}>
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="d-flex justify-content-between align-items-start mb-2">
//                 <span>Impressions</span>
//                 <FiInfo
//                   role="button"
//                   className="text-primary ms-1"
//                   onClick={() =>
//                     openModal(
//                       "Impressions – AI Insights",
//                       "Your impression share dropped 12%. Increase bids on high CTR keywords or broaden match types to capture more volume."
//                     )
//                   }
//                 />
//               </div>
//               <div className="d-flex align-items-center mb-3">
//                 <h3 className="fs-20 mt-1 mb-0">{n0(kpi.impressions)}</h3>
//               </div>
//               <span className="fs-12 text-muted">Last 30 days</span>
//             </div>
//           </div>
//         </Col>
//         {/* Spend */}
//         <Col xl={3} md={6}>
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="d-flex justify-content-between align-items-start mb-2">
//                 <span>Spend ($)</span>
//                 <FiInfo
//                   role="button"
//                   className="text-primary ms-1"
//                   onClick={() =>
//                     openModal(
//                       "Spend – AI Insights",
//                       "Your spend efficiency improved. Maintain current bidding strategy but monitor CPA closely."
//                     )
//                   }
//                 />
//               </div>
//               <div className="d-flex align-items-center mb-3">
//                 <h3 className="fs-20 mt-1 mb-0">{n0(kpi.spend)}</h3>
//               </div>
//               <span className="fs-12 text-muted">Last 30 days</span>
//             </div>
//           </div>
//         </Col>
//         {/* Avg CPC */}
//         <Col xl={3} md={6}>
//           <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
//             <div className="card-body p-4">
//               <div className="d-flex justify-content-between align-items-start mb-2">
//                 <span>Avg CPC</span>
//                 <FiInfo
//                   role="button"
//                   className="text-primary ms-1"
//                   onClick={() =>
//                     openModal(
//                       "CPC – AI Insights",
//                       "CPC is trending down 5%. Keep testing new ad creatives to preserve this advantage."
//                     )
//                   }
//                 />
//               </div>
//               <div className="d-flex align-items-center mb-3">
//                 <h3 className="fs-20 mt-1 mb-0">${n2(kpi.cpc)}</h3>
//               </div>
//               <span className="fs-12 text-muted">Last 30 days</span>
//             </div>
//           </div>
//         </Col>
//       </Row>

//       {/* -------------------- CAMPAIGN OVERVIEW ----------------- */}
//       <Row className="g-4 mb-4">
//         <Col xl={8} md={12} className="d-flex">
//           <Card className="p-3 campign-card h-100 flex-fill">
//             <div className="d-flex justify-content-between align-items-center mb-3">
//               <h6 className="fw-semibold text-muted mb-0">Campaign Overview</h6>
//               <FiInfo
//                 role="button"
//                 className="text-primary"
//                 onClick={() =>
//                   openModal(
//                     "Campaign Overview – AI Insights",
//                     "High CTR campaigns are driving most conversions. Shift budget from low performing campaigns and A/B test creatives on Campaign B."
//                   )
//                 }
//               />
//             </div>
//             <div style={{ minHeight: 360 }}>
//               {mounted && campaigns.length ? (
//                 <Chart
//                   type="bar"
//                   height={360}
//                   className="custome-width"
//                   series={[
//                     { name: "Clicks", data: campaigns.map((r) => r.clicks) },
//                     {
//                       name: "Impressions",
//                       data: campaigns.map((r) => r.impressions),
//                     },
//                     {
//                       name: "Website Clicks",
//                       data: campaigns.map((r) => r.website_clicks),
//                     },
//                   ]}
//                   options={{
//                     chart: {
//                       stacked: true,
//                       toolbar: { show: false },
//                       foreColor: "#6c757d",
//                       animations: { easing: "easeinout", speed: 700 },
//                     },
//                     plotOptions: {
//                       bar: {
//                         columnWidth: "50%",
//                         borderRadius: 6,
//                         borderRadiusApplication: "end",
//                       },
//                     },
//                     fill: { opacity: 0.85 },
//                     stroke: { show: true, width: 1, colors: ["#fff"] },
//                     dataLabels: { enabled: false },
//                     colors: vibrantColors.slice(0, 3),
//                     xaxis: {
//                       categories: campaigns.map((r) => r.campaign_name?.trim() || "N/A"),
//                       tickPlacement: "between",
//                       tickAmount: Math.min(campaigns.length, 7),
//                       labels: {
//                         rotate: -20,
//                         hideOverlappingLabels: true,
//                         formatter: (val) =>
//                           val.length > 12 ? `${val.slice(0, 9)}…` : val,
//                         style: { fontSize: "11px", fontWeight: 500 },
//                       },
//                       axisBorder: { show: false },
//                       axisTicks: { show: false },
//                     },
//                     yaxis: {
//                       labels: {
//                         formatter: formatCompact,
//                         style: { fontSize: "11px" },
//                       },
//                     },
//                     legend: {
//                       position: "top",
//                       fontSize: "12px",
//                       markers: { radius: 4 },
//                       itemMargin: { horizontal: 12 },
//                     },
//                     tooltip: { shared: true, intersect: false },
//                     grid: {
//                       strokeDashArray: 3,
//                       padding: { left: 12, right: 12 },
//                     },
//                   }}
//                 />
//               ) : (
//                 <div className="d-flex align-items-center justify-content-center h-100 text-muted">
//                   No chart data available
//                 </div>
//               )}
//             </div>
//           </Card>
//         </Col>
//         {/* ------------------ REALTIME USERS ------------------ */}
//         <Col xl={4} md={12} className="d-flex">
//           <Card className="p-3 h-100 campign-card flex-fill">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="fw-semibold text-muted mb-0">Realtime Active Users</h6>
//               <FiInfo
//                 role="button"
//                 className="text-primary"
//                 onClick={() =>
//                   openModal(
//                     "Realtime Users – AI Insights",
//                     "User activity peaks between 12–2 PM. Schedule high‑priority posts during this window."
//                   )
//                 }
//               />
//             </div>
//             <Stat
//               icon={<FiActivity />}
//               label="Est. Active Users"
//               value={n0(kpi.clicks / 10)}
//             />
//             {mounted && (
//               <Chart
//                 type="bar"
//                 height={200}
//                 className="custome-width"
//                 series={[{ name: "PVs/sec", data: pvSeries }]}
//                 options={{
//                   chart: {
//                     toolbar: { show: false },
//                     animations: { easing: "easeinout", speed: 400 },
//                   },
//                   plotOptions: {
//                     bar: {
//                       columnWidth: "55%",
//                       borderRadius: 4,
//                       distributed: true,
//                     },
//                   },
//                   colors: vibrantColors.slice(0, pvSeries.length),
//                   dataLabels: { enabled: false },
//                   xaxis: {
//                     labels: { show: false },
//                     axisTicks: { show: false },
//                     axisBorder: { show: false },
//                   },
//                   yaxis: { show: false },
//                   grid: { show: false },
//                   tooltip: { y: { formatter: (v) => v.toString() } },
//                 }}
//               />
//             )}
//           </Card>
//         </Col>
//       </Row>

//       {/* ---------------- DEVICE / SESSION / BROWSER ---------------- */}
//       <Row className="g-4 mb-4">
//         {[
//           { label: "Device Sessions", data: devicePie },
//           { label: "Sessions by Channel", data: sessions },
//           { label: "Browser Used By Users", data: browsers },
//         ].map(({ label, data }) => {
//           const hasData = mounted && data.series.length;
//           const height = 360;
//           const total = data.series.reduce((a, b) => a + b, 0);

//           const colors = [
//             "#4e79ff",
//             "#ffaf40",
//             "#28c76f",
//             "#ff5b5c",
//             "#ffc048",
//             "#9358ff",
//             "#20c997",
//           ];

//           const options = {
//             chart: {
//               animations: { easing: "easeinout", speed: 600 },
//               toolbar: { show: false },
//               foreColor: "var(--bs-body-color)",
//             },
//             labels: data.labels.map((lbl) => {
//               const map = {
//                 snapchat: "Snapchat",
//                 tiktok: "TikTok",
//                 pinterest: "Pinterest",
//                 x: "X",
//                 linkedin: "LinkedIn",
//                 "google ads": "Google Ads",
//               };
//               const fixed =
//                 map[lbl.toLowerCase()] ||
//                 lbl.replace(/\b\w/g, (c) => c.toUpperCase());

//               return shorten(fixed);
//             }),
//             legend: {
//               position: "bottom",
//               horizontalAlign: "center",
//               fontSize: "13px",
//               itemMargin: { horizontal: 10, vertical: 4 },
//               markers: { width: 10, height: 10, radius: 2 },
//               formatter: (name, opts) => {
//                 const percent = (
//                   (opts.w.globals.series[opts.seriesIndex] / total) * 100
//                 ).toFixed(1);
//                 return `<span class="fw-bold text-muted">${name} (${percent}%)</span>`;
//               },
//             },
//             colors,
//             stroke: { show: false },
//             fill: { opacity: 0.92 },
//             dataLabels: {
//               enabled: true,
//               formatter: (v) => `${v.toFixed(1)}%`,
//               dropShadow: { enabled: false },
//               style: { fontWeight: 700 },
//             },
//             tooltip: { y: { formatter: (v) => `${v.toFixed(1)}%` } },
//             states: {
//               hover: { filter: { type: "darken", value: 0.8 } },
//               active: { filter: { type: "none" } },
//             },
//             responsive: [
//               { breakpoint: 576, options: { legend: { show: false } } },
//             ],
//           };

//           if (label === "Sessions by Channel") {
//             options.plotOptions = {
//               pie: {
//                 donut: {
//                   size: "72%",
//                   total: {
//                     show: true,
//                     showAlways: true,
//                     label: "Total",
//                     fontSize: "0.8rem",
//                     className: "text-muted fw-bold",
//                     formatter: () => total.toLocaleString(),
//                   },
//                 },
//               },
//             };
//           }

//           return (
//             <Col md={4} key={label}>
//               <Card className="p-3 h-100 d-flex flex-column campign-card">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h6 className="fw-semibold text-muted mb-0 text-center flex-grow-1">
//                     {label}
//                   </h6>
//                   <FiInfo
//                     role="button"
//                     className="text-primary"
//                     onClick={() =>
//                       openModal(
//                         `${label} – AI Insights`,
//                         `Dummy insight for ${label.toLowerCase()}. Replace this text with dynamic AI recommendations later.`
//                       )
//                     }
//                   />
//                 </div>
//                 <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ minHeight: height }}>
//                   {hasData ? (
//                     <Chart type="donut" height={height} series={data.series} options={options} />
//                   ) : (
//                     <div className="empty-state w-100 h-100 d-flex flex-column align-items-center justify-content-center text-center">
//                       <FiPieChart size={38} className="text-primary mb-2" />
//                       <span className="small text-muted">No data available</span>
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </Col>
//           );
//         })}
//       </Row>

//       {/* ---------------- CLICKS TRENDS & TABLES ---------------- */}
//       <Row className="g-4 mb-4">
//         <Col xl={4} md={12}>
//           <Card className="p-3 campign-card h-100">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="fw-semibold text-muted mb-0">Clicks – 30 days</h6>
//               <FiInfo
//                 role="button"
//                 className="text-primary"
//                 onClick={() =>
//                   openModal(
//                     "Clicks Trend – AI Insights",
//                     "Clicks trend is stable with a slight week‑on‑week increase. Introduce new ad variations to build on momentum."
//                   )
//                 }
//               />
//             </div>
//             <Stat icon={<FiBarChart2 />} label="Clicks" value={n0(kpi.clicks)} />
//             {mounted && campaigns.length ? (
//               <Chart
//                 type="line"
//                 className="custome-width"
//                 height={120}
//                 series={[{ name: "Clicks", data: campaigns.map((c) => c.clicks) }]}
//                 options={{
//                   chart: { toolbar: { show: false } },
//                   colors: ["#3C50E0"],
//                   xaxis: { show: false },
//                   yaxis: { show: false },
//                   stroke: { width: 2 },
//                 }}
//               />
//             ) : (
//               <div className="text-muted text-center py-5">No chart data available</div>
//             )}
//           </Card>
//         </Col>

//         <Col xl={8} md={12}>
//           <Card className="p-3 h-100 campign-card">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="fw-semibold mb-0">Clicks/Impr. by Campaign</h6>
//               <FiInfo
//                 role="button"
//                 className="text-primary"
//                 onClick={() =>
//                   openModal(
//                     "Clicks vs Impressions – AI Insights",
//                     "Campaign D has high impressions but low clicks. Optimise its ad copy and targeting to improve CTR."
//                   )
//                 }
//               />
//             </div>
//             <Table size="sm" hover responsive>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Campaign</th>
//                   <th className="text-end">Impr.</th>
//                   <th className="text-end">Clicks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {keywords.length ? (
//                   keywords.map((k, i) => (
//                     <tr key={k.name + i}>
//                       <td>{i + 1}</td>
//                       <td>{k.name}</td>
//                       <td className="text-end">{n0(k.impressions)}</td>
//                       <td className="text-end">{n0(k.clicks)}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="text-center text-muted">
//                       No campaign data
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card>
//         </Col>
//       </Row>

//       {/* ---------------- CAMPAIGNS & PAGES ---------------- */}
//       <Row className="g-4">
//         <Col xl={6} md={12}>
//           <Card className="p-3 campign-card">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="fw-semibold mb-0">Top Campaigns (Clicks)</h6>
//               <FiInfo
//                 role="button"
//                 className="text-primary"
//                 onClick={() =>
//                   openModal(
//                     "Top Campaigns – AI Insights",
//                     "Campaign A outperforms peers. Replicate its targeting & creative approach for underperforming campaigns."
//                   )
//                 }
//               />
//             </div>
//             <div style={{ maxHeight: 400, overflowY: "auto" }}>
//               <Table size="sm" hover responsive>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Campaign</th>
//                     <th className="text-end">Clicks</th>
//                     <th className="text-end">Spend</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {campaigns.length ? (
//                     campaigns.map((c, i) => (
//                       <tr key={`${c.ad_key || c.campaign_name}-${i}`}>
//                         <td>{i + 1}</td>
//                         <td>{c.campaign_name?.trim() || "Untitled"}</td>
//                         <td className="text-end">{n0(c.clicks)}</td>
//                         <td className="text-end">${n2(c.media_cost)}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={4} className="text-center text-muted">
//                         No campaign data
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </Table>
//             </div>
//           </Card>
//         </Col>

//         <Col xl={6} md={12}>
//           <Card className="p-3 campign-card h-100">
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="fw-semibold mb-0">Top Pages Today</h6>
//               <FiInfo
//                 role="button"
//                 className="text-primary"
//                 onClick={() =>
//                   openModal(
//                     "Top Pages – AI Insights",
//                     "Page X has high bounce rate. Improve on‑page content and CTA placement."
//                   )
//                 }
//               />
//             </div>
//             <Table size="sm" hover responsive>
//               <thead>
//                 <tr>
//                   <th>Page</th>
//                   <th>Src</th>
//                   <th className="text-end">Views</th>
//                   <th className="text-end">Bounce</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pages.length ? (
//                   pages.map((p, i) => (
//                     <tr key={`${p.page}-${i}`}>
//                       <td>{p.page}</td>
//                       <td>{p.source}</td>
//                       <td className="text-end">{n0(p.views)}</td>
//                       <td className="text-end">
//                         {mounted ? `${parseFloat(String(p.bounce).replace("%", "")).toFixed(1)}%` : "—"}
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="text-center text-muted">
//                       No page data
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </Card>
//         </Col>
//       </Row>

//       {/* ---- Global Analysis Modal ---- */}
//       <AnalysisModal
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         title={modalContent.title}
//         text={modalContent.text}
//       />
//     </div>
//   );
// }

/* ================================================================
   CampaignDashboard.jsx — original UI + Info-modal enhancements
   ================================================================ */