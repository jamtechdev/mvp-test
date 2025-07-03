"use client";
import { useMemo } from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { FiBarChart2 } from "react-icons/fi";
import dynamic from "next/dynamic";
import InfoPopover from "./InsightModel";
import TopAdCreative from "./TopAdCreative";
import AdPerformanceTable from "./AdPerformanceTable";

const today = new Date();
today.setHours(0, 0, 0, 0);

const clickTrend = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  return { x: d, y: 3000 + Math.round(300 * Math.sin(i / 3)) };
});

const kpi = { clicks: clickTrend.reduce((t, p) => t + p.y, 0) };
const minY = Math.min(...clickTrend.map(p => p.y));
const maxY = Math.max(...clickTrend.map(p => p.y));
export const campaigns = [
  { campaign_name: "Campaign P", clicks: 9_642, media_cost: 4_112.68 },
  { campaign_name: "Campaign G", clicks: 9_015, media_cost: 3_210.44 },
  { campaign_name: "Campaign F", clicks: 8_767, media_cost: 1_520.78 },
  { campaign_name: "Campaign A", clicks: 8_276, media_cost: 2_345.12 },
  { campaign_name: "Campaign N", clicks: 8_103, media_cost: 3_480.91 },
  { campaign_name: "Campaign I", clicks: 7_498, media_cost: 2_978.35 },
  { campaign_name: "Campaign D", clicks: 6_567, media_cost: 2_541.87 },
  { campaign_name: "Campaign K", clicks: 6_121, media_cost: 2_640.27 },
  { campaign_name: "Campaign E", clicks: 5_688, media_cost: 7_847.6 },
  { campaign_name: "Campaign O", clicks: 5_437, media_cost: 2_233.07 },
  { campaign_name: "Campaign B", clicks: 5_120, media_cost: 1_880.5 },
  { campaign_name: "Campaign M", clicks: 4_955, media_cost: 1_925.49 },
  { campaign_name: "Campaign H", clicks: 4_332, media_cost: 1_145.2 },
  { campaign_name: "Campaign C", clicks: 3_901, media_cost: 1_220.99 },
  { campaign_name: "Campaign L", clicks: 3_582, media_cost: 1_399.13 },
  { campaign_name: "Campaign Q", clicks: 2_998, media_cost: 1_087.54 },
  { campaign_name: "Campaign J", clicks: 2_764, media_cost: 1_012.0 },
];

const ads = [
  {
    ad_id: "fb‑001",
    ad_name: "Summer Flash Sale",
    platform: "facebook",
    objective: "Traffic",
    impressions: 82450,
    clicks: 3214,
    spend: 1500,
    thumbnail_url: "/images/advertisement-1.jpg", // replace with actual image path
  },
  {
    ad_id: "gg‑002",
    ad_name: "Free Trial – Search",
    platform: "google",
    objective: "Leads",
    impressions: 91320,
    clicks: 5876,
    spend: 3200,
    leads: 250,
    video_url: "advertisement-vdo-2.mp4", // sample video URL
    thumbnail_url: "/images/advertisement-2.jpg", // replace with actual image path
  },
  {
    ad_id: "li‑003",
    ad_name: "Whitepaper Download",
    platform: "linkedin",
    objective: "Conversions",
    impressions: 25900,
    clicks: 1120,
    spend: 2400,
    conversions: 70,
    thumbnail_url: "/images/advertisement-3.webp",
  },
  {
    ad_id: "tt‑004",
    ad_name: "Back‑to‑School Promo",
    platform: "tiktok",
    objective: "Engagement",
    impressions: 45000,
    clicks: 3500,
    spend: 800,
    engagements: 2800,
    thumbnail_url: "/images/advertisement-4.webp",
    video_url: "advertisement-vdo.mp4", // sample video URL // sample video URL
  },
  {
    ad_id: "tw‑005",
    ad_name: "Webinar Registration",
    platform: "twitter",
    objective: "Leads",
    impressions: 38400,
    clicks: 2450,
    spend: 1600,
    leads: 120,

    thumbnail_url: "/images/advertisement-5.jpg",
  },
];

const topAd = ads;

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

const ApexLine = dynamic(() => import("react-apexcharts"), { ssr: false });

const n0 = (n) => n.toLocaleString("en-US");
const n2 = (n) => n.toLocaleString("en-US", { minimumFractionDigits: 2 });

export default function CampaignAnalytics() {
  const clickSeries = useMemo(() => [{ name: "Clicks", data: clickTrend }], []);

  return (
    <div className="container-fluid py-4">
      {/* ============= 30‑day Trend & Ad Table ============= */}
      <Row className="g-4 mb-4">
        {/* Click trend spark‑line */}
        <Col xl={4} md={12}>
          <Card className="p-3 campign-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold text-muted mb-0">Clicks – 30 days</h6>

              <InfoPopover
                title="Clicks Trend – AI Insight"
                description="Clicks stable with slight uptick – refresh creatives."
                placement="bottom"
              />
            </div>

            <Stat
              icon={<FiBarChart2 />}
              label="Clicks"
              value={n0(kpi.clicks)}
            />

            <ApexLine
              type="line"
              className="custome-width"
              height={250}
              series={clickSeries}
              options={{
                chart: { toolbar: { show: false } },
                colors: ["#3C50E0"],
                xaxis: { show: false, type: "datetime" },
                yaxis: { show: false },
                stroke: { width: 2, curve: "smooth" },
                // stroke: { width: 4, curve: "smooth" },

                grid: { show: false },
                tooltip: { enabled: false },
              }}
            />
          </Card>
        </Col>

        {/* Ad‑level table */}
        <Col xl={8} md={12}>
          <AdPerformanceTable ads={ads} />
        </Col>
      </Row>

      {/* ============= Top Campaigns & Top Ad ============= */}
      <Row className="g-4">
        <Col xl={6} md={12}>
          <Card className="p-3 campign-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-semibold mb-0">Top Campaigns (Clicks)</h6>

              <InfoPopover
                title="Top Campaigns – AI Insight"
                description="Replicate Campaign A's targeting in weaker campaigns."
                placement="bottom"
              />
            </div>

            <div
            // style={{ maxHeight: 400, overflowY: "auto" }}
            >
              <Table className="table table-sm table-hover">
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
                      <tr key={c.campaign_name + i}>
                        <td>{i + 1}</td>
                        <td>{c.campaign_name}</td>
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

        <Col xl={6} md={12}>
          <TopAdCreative ad={topAd} />
        </Col>
      </Row>
    </div>
  );
}
