"use client";
import { useMemo } from "react";
import { Row, Col, Card } from "react-bootstrap";
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

const campaigns = [
  { campaign_name: "Campaign A", clicks: 8276, media_cost: 2345.12 },
  { campaign_name: "Campaign B", clicks: 5120, media_cost: 1880.5 },
  { campaign_name: "Campaign C", clicks: 3901, media_cost: 1220.99 },
];

const ads = [
  {
    ad_id: "fb‑001",
    ad_name: "Summer Flash Sale",
    platform: "facebook",
    objective: "Traffic",
    impressions: 82_450,
    clicks: 3_214,
    thumbnail_url: "https://via.placeholder.com/120x120.png?text=Summer+Sale",
    preview_url: "https://facebook.com/ads/fb-001",
  },
  {
    ad_id: "gg‑002",
    ad_name: "Free Trial – Search",
    platform: "google",
    objective: "Leads",
    impressions: 91_320,
    clicks: 5_876,
    thumbnail_url: "https://via.placeholder.com/120x120.png?text=Free+Trial",
    preview_url: "https://ads.google.com/gg-002",
  },
  {
    ad_id: "li‑003",
    ad_name: "Whitepaper Download",
    platform: "linkedin",
    objective: "Conversions",
    impressions: 25_900,
    clicks: 1_120,
    thumbnail_url: "https://via.placeholder.com/120x120.png?text=Whitepaper",
    preview_url: "https://linkedin.com/ads/li-003",
  },
  {
    ad_id: "tt‑004",
    ad_name: "Back‑to‑School Promo",
    platform: "tiktok",
    objective: "Engagement",
    impressions: 45_000,
    clicks: 3_500,
    thumbnail_url: "https://via.placeholder.com/120x120.png?text=Back+2+School",
    preview_url: "https://tiktok.com/ads/tt-004",
  },
  {
    ad_id: "tw‑005",
    ad_name: "Webinar Registration",
    platform: "twitter",
    objective: "Leads",
    impressions: 38_400,
    clicks: 2_450,
    thumbnail_url: "https://via.placeholder.com/120x120.png?text=Webinar",
    preview_url: "https://twitter.com/ads/tw-005",
  },
];

// const topAd = ads.reduce((best, ad) => (ad.clicks > best.clicks ? ad : best));
const topAd = ads;

function Stat({ icon, label, value }) {
  return (
    <Card className="shadow-sm border-0 p-3 h-100">
      <div className="d-flex align-items-center gap-3">
        <span className="fs-3 text-primary">{icon}</span>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="fw-bold fs-5">{value}</div>
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
              height={120}
              series={clickSeries}
              options={{
                chart: { toolbar: { show: false } },
                colors: ["#3C50E0"],
                xaxis: { show: false, type: "datetime" },
                yaxis: { show: false },
                stroke: { width: 2, curve: "smooth" },
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

            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              <table className="table table-sm table-hover">
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
              </table>
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
