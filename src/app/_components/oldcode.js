// "use client";
// import { useMemo, useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import {
//   Card,
//   Row,
//   Col,
//   Table,
//   Form,
//   Dropdown,
//   Button,
// } from "react-bootstrap";
// import {
//   computeKPIs,
//   getData,
//   buildFunnel,
//   buildTrendSeries,
//   deviceBreakdown,
//   channelBar,
//   revenueByChannel,
//   adPerformance,
//   channels,
// } from "@/_utils/campaignUtils";
// import { n0, n2 } from "@/_utils/formatNumber";
// import InfoPopover from "@/_components/common/InsightModel";

// const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// /* palette for charts */
// const palette = [
//   "#FF6B6B",
//   "#4ECDC4",
//   "#FFD93D",
//   "#1A73E8",
//   "#F72585",
//   "#3A0CA3",
//   "#F9844A",
//   "#43AA8B",
//   "#F9C74F",
//   "#9D4EDD",
// ];

// export default function CampaignDashboard() {
//   /* ------------------ filters & state ------------------------------- */
//   const [range, setRange]   = useState({ start: "", end: "" });
//   const [channel, setChan]  = useState("All");
//   const [metric, setMetric] = useState("spend");

//   /* hydration-safe last-updated time  */
//   const [lastUpdated, setLastUpdated] = useState("");           // string only
//   useEffect(() => setLastUpdated(new Date().toLocaleTimeString()), []);

//   const refreshData = () => {
//     setLastUpdated(new Date().toLocaleTimeString());
//     // any future data-fetch goes here
//   };

//   /* ------------------ derived data ---------------------------------- */
//   const rows = useMemo(
//     () => getData({ channel, dateRange: range }),
//     [channel, range]
//   );
//   const kpis     = useMemo(() => computeKPIs(rows), [rows]);
//   const funnel   = useMemo(() => buildFunnel(rows), [rows]);
//   const trend    = useMemo(() => buildTrendSeries(rows, metric), [rows, metric]);
//   const devices  = useMemo(() => deviceBreakdown(), []);
//   const chanBar  = useMemo(() => channelBar(rows), [rows]);
//   const revByCh  = useMemo(() => revenueByChannel(rows), [rows]);
//   const adsTable = useMemo(() => adPerformance(rows), [rows]);

//   const fmtDate = (d) =>
//     new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric" });

//   const fmtCompact = (v) =>
//     v >= 1_000_000
//       ? `${(v / 1_000_000).toFixed(1)}M`
//       : v >= 1_000
//       ? `${(v / 1_000).toFixed(1)}K`
//       : v.toFixed(0);

//   /* ------------------ UI -------------------------------------------- */
//   return (
//     <div className="container-fluid py-4">
//       {/* ============ TOP FILTER BAR ============ */}
//       <Row className="align-items-end g-3 mb-4">
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label className="small fw-semibold">Start date</Form.Label>
//             <Form.Control
//               type="date"
//               value={range.start}
//               onChange={(e) => setRange((s) => ({ ...s, start: e.target.value }))}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label className="small fw-semibold">End date</Form.Label>
//             <Form.Control
//               type="date"
//               value={range.end}
//               onChange={(e) => setRange((s) => ({ ...s, end: e.target.value }))}
//             />
//           </Form.Group>
//         </Col>
//         <Col md={3}>
//           <Form.Group>
//             <Form.Label className="small fw-semibold">Channel</Form.Label>
//             <Form.Select value={channel} onChange={(e) => setChan(e.target.value)}>
//               {channels.map((c) => (
//                 <option key={c}>{c}</option>
//               ))}
//             </Form.Select>
//           </Form.Group>
//         </Col>
//         <Col className="text-md-end">
//           {lastUpdated && (
//             <small className="text-muted me-2">Updated {lastUpdated}</small>
//           )}
//           <Button
//             size="sm"
//             variant="outline-secondary"
//             onClick={refreshData}
//           >
//             ⟳ Refresh
//           </Button>
//         </Col>
//       </Row>

//       {/* ============ KPI CARDS ============ */}
//       <Row className="g-3 mb-4">
//         {[
//           { label: "Spend",       key: "spend",       val: kpis.spend,       icon: "💸" },
//           { label: "Impressions", key: "impressions", val: kpis.impressions, icon: "👁️" },
//           { label: "Leads",       key: "leads",       val: kpis.leads,       icon: "🧲" },
//           { label: "Revenue",     key: "revenue",     val: kpis.revenue,     icon: "💰" },
//         ].map(({ label, val, icon }) => (
//           <Col md={3} key={label}>
//             <Card className="p-3 position-relative h-100">
//               <InfoPopover
//                 title={`${label} – AI Insight`}
//                 description={`AI insight about ${label.toLowerCase()} performance.`}
//               />
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <small className="text-muted">{label}</small>
//                   <h4 className="fw-bold mb-0">{n0(val)}</h4>
//                 </div>
//                 <span style={{ fontSize: 28 }}>{icon}</span>
//               </div>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* ============ FUNNEL & TREND ============ */}
//       <Row className="g-4 mb-4">
//         {/* Funnel */}
//         <Col xl={5}>
//           <Card className="p-3 position-relative h-100">
//             <InfoPopover
//               title="Funnel – AI Insight"
//               description="Optimize Click → Lead conversion step."
//             />
//             <h6 className="text-muted mb-3">Marketing Funnel</h6>
//             <Chart
//               type="bar"
//               height={340}
//               series={[
//                 { name: "Value", data: funnel.steps.map((s) => s.value) },
//               ]}
//               options={{
//                 chart: { toolbar: { show: false } },
//                 colors: [palette[0]],
//                 plotOptions: {
//                   bar: {
//                     horizontal: false,
//                     columnWidth: "45%",
//                     distributed: true,
//                     borderRadius: 6,
//                   },
//                 },
//                 xaxis: { categories: funnel.steps.map((s) => s.label) },
//                 yaxis: { labels: { formatter: fmtCompact } },
//                 dataLabels: { enabled: true, formatter: n0 },
//               }}
//             />
//           </Card>
//         </Col>

//         {/* Trend */}
//         <Col xl={7}>
//           <Card className="p-3 position-relative h-100">
//             <InfoPopover
//               title="Trend – AI Insight"
//               description="Spend spike detected on mid-month."
//             />
//             <div className="d-flex justify-content-between align-items-center mb-2">
//               <h6 className="text-muted mb-0">30-day Trend</h6>
//               <Dropdown onSelect={setMetric}>
//                 <Dropdown.Toggle size="sm" variant="outline-secondary">
//                   {metric.charAt(0).toUpperCase() + metric.slice(1)}
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu>
//                   {["spend", "impressions", "clicks", "leads", "revenue"].map(
//                     (m) => (
//                       <Dropdown.Item eventKey={m} key={m}>
//                         {m.charAt(0).toUpperCase() + m.slice(1)}
//                       </Dropdown.Item>
//                     )
//                   )}
//                 </Dropdown.Menu>
//               </Dropdown>
//             </div>
//             <Chart
//               type="line"
//               height={340}
//               series={[{ name: metric, data: trend.values }]}
//               options={{
//                 chart: { toolbar: { show: false } },
//                 colors: [palette[3]],
//                 stroke: { width: 3 },
//                 xaxis: {
//                   categories: trend.dates.map(fmtDate),
//                   labels: { rotate: -45 },
//                 },
//                 yaxis: { labels: { formatter: fmtCompact } },
//               }}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* ============ HORIZONTAL BARS ============ */}
//       <Row className="g-4 mb-4">
//         {[
//           { label: "Device Sessions", data: devices },
//           { label: "Clicks by Channel", data: chanBar },
//           { label: "Revenue per Channel", data: revByCh },
//         ].map(({ label, data }, idx) => (
//           <Col md={4} key={label}>
//             <Card className="p-3 position-relative h-100">
//               <InfoPopover
//                 title={`${label} – AI Insight`}
//                 description={`AI commentary about ${label.toLowerCase()}.`}
//               />
//               <h6 className="text-muted mb-3">{label}</h6>
//               <Chart
//                 type="bar"
//                 height={340}
//                 series={[{ data: data.series }]}
//                 options={{
//                   chart: { toolbar: { show: false } },
//                   plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
//                   colors: palette.slice(idx * 3),
//                   yaxis: { categories: data.labels },
//                   xaxis: { labels: { formatter: fmtCompact } },
//                 }}
//               />
//             </Card>
//           </Col>
//         ))}
//       </Row>

//       {/* ============ AD TABLE ============ */}
//       <Row className="g-4">
//         <Col>
//           <Card className="p-3 position-relative">
//             <InfoPopover
//               title="Ad Performance – AI Insight"
//               description="Top ads relative to their objectives."
//             />
//             <h6 className="text-muted mb-3">Best-Performing Ads</h6>
//             <div style={{ overflowX: "auto" }}>
//               <Table size="sm" hover responsive>
//                 <thead>
//                   <tr>
//                     <th>#</th>
//                     <th>Ad</th>
//                     <th>Platform</th>
//                     <th>Objective</th>
//                     <th className="text-end">Clicks</th>
//                     <th className="text-end">Impr.</th>
//                     <th className="text-end">Leads</th>
//                     <th className="text-end">Revenue</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {adsTable.map((ad, i) => (
//                     <tr key={`${ad.ad}-${i}`}>
//                       <td>{i + 1}</td>
//                       <td>{ad.ad}</td>
//                       <td>{ad.platform}</td>
//                       <td>{ad.objective}</td>
//                       <td className="text-end">{n0(ad.clicks)}</td>
//                       <td className="text-end">{n0(ad.impressions)}</td>
//                       <td className="text-end">{n0(ad.leads)}</td>
//                       <td className="text-end">{n2(ad.revenue)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           </Card>
//         </Col>
//       </Row>

//       {/* ============ CHAT BUTTON ============ */}
//       <Button
//         variant="primary"
//         className="rounded-circle"
//         style={{
//           position: "fixed",
//           bottom: "1.5rem",
//           right: "1.5rem",
//           width: 56,
//           height: 56,
//           zIndex: 999,
//         }}
//         onClick={() => alert("Chat-with-data coming soon!")}
//         title="Chat with your data"
//       >
//         💬
//       </Button>
//     </div>
//   );
// }
