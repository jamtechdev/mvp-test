"use client";
import { useMemo } from "react";

import {
  Row,
  Col,
  Card,
  Table,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import dynamic from "next/dynamic";

import InfoPopover from "./InsightModel";
import TopAdCreative from "./TopAdCreative";
import AdPerformanceTable from "./AdPerformanceTable";
import ClicksGauge from "./ClicksGauge";
const n0 = (n) => n.toLocaleString("en-US");

const n2 = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const bar = (value, max, variant) => (
  <ProgressBar
    now={Math.round((value / max) * 100)}
    variant={variant}
    className="rounded-pill"
    striped
    animated
    style={{ width: 100, height: 8 }}
  />
);

const medal = (idx) => ["🥇", "🥈", "🥉"][idx] ?? idx + 1;

const today = new Date();
today.setHours(0, 0, 0, 0);

const clickTrend = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(d.getDate() - (29 - i));
  return { x: d, y: 3000 + Math.round(300 * Math.sin(i / 3)) };
});

const kpi = {
  clicks: clickTrend.reduce((t, p) => t + p.y, 0),
};

const campaigns = [
  {
    campaign_name: "Campaign P",
    clicks: 9642,
    media_cost: 4112.68,
    revenue: 8520,
  },
  {
    campaign_name: "Campaign G",
    clicks: 9015,
    media_cost: 3210.44,
    revenue: 7900,
  },
  {
    campaign_name: "Campaign F",
    clicks: 8767,
    media_cost: 1520.78,
    revenue: 6250,
  },
  {
    campaign_name: "Campaign A",
    clicks: 8276,
    media_cost: 2345.12,
    revenue: 7050,
  },
  {
    campaign_name: "Campaign N",
    clicks: 8103,
    media_cost: 3480.91,
    revenue: 6980,
  },
  {
    campaign_name: "Campaign I",
    clicks: 7498,
    media_cost: 2978.35,
    revenue: 6020,
  },
  {
    campaign_name: "Campaign D",
    clicks: 6567,
    media_cost: 2541.87,
    revenue: 5430,
  },
  {
    campaign_name: "Campaign K",
    clicks: 6121,
    media_cost: 2640.27,
    revenue: 5110,
  },
  {
    campaign_name: "Campaign E",
    clicks: 5688,
    media_cost: 7847.6,
    revenue: 4000,
  },
  {
    campaign_name: "Campaign O",
    clicks: 5437,
    media_cost: 2233.07,
    revenue: 4880,
  },
  {
    campaign_name: "Campaign B",
    clicks: 5120,
    media_cost: 1880.5,
    revenue: 4600,
  },
  {
    campaign_name: "Campaign M",
    clicks: 4955,
    media_cost: 1925.49,
    revenue: 4520,
  },
  {
    campaign_name: "Campaign H",
    clicks: 4332,
    media_cost: 1145.2,
    revenue: 3920,
  },
  {
    campaign_name: "Campaign C",
    clicks: 3901,
    media_cost: 1220.99,
    revenue: 3700,
  },
];
const maxRevenue = Math.max(...campaigns.map((c) => c.revenue));

const ads = [
  {
    ad_id: "fb‑001",
    ad_name: "Summer Flash Sale",
    platform: "facebook",
    objective: "Traffic",
    impressions: 82450,
    clicks: 3214,
    spend: 1500,
    thumbnail_url: "/images/advertisement-1.jpg",
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
    video_url: "advertisement-vdo-2.mp4",
    thumbnail_url: "/images/advertisement-2.jpg",
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
    video_url: "advertisement-vdo.mp4",
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
const totalConversions = ads.reduce(
  (sum, ad) => sum + (ad.conversions || 0),
  0
);
const totalSpend = ads.reduce((sum, ad) => sum + ad.spend, 0);
const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;

export default function CampaignAnalytics() {
  const clickSeries = useMemo(() => [{ name: "Clicks", data: clickTrend }], []);

  const maxClicks = Math.max(...campaigns.map((c) => c.clicks));
  const maxSpend = Math.max(...campaigns.map((c) => c.media_cost));

  return (
    <div className="container-fluid py-4">
      {/* Click Trend + Ads Table */}
      <Row className="g-4 mb-4">
        <Col xl={4} md={12}>
          <ClicksGauge kpi={kpi} cpa={cpa} />
        </Col>
        <Col xl={8} md={12}>
          <AdPerformanceTable ads={ads} />
        </Col>
      </Row>

      {/* Campaign Table + Top Ads */}
      <Row className="g-4">
        <Col xl={12}>
          <Card className="p-3 campign-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold mb-0">Top Campaigns (Clicks)</h6>
              <InfoPopover
                title="Top Campaigns – AI Insight"
                description="Replicate Campaign A's targeting in weaker campaigns."
                placement="bottom"
              />
            </div>

            <div
            // style={{ maxHeight: 560, overflowY: "auto" }}
            >
              <Table
                hover
                responsive
                className="align-middle mb-0 small table-borderless"
              >
                <thead className="text-uppercase bg-light sticky-top">
                  <tr>
                    <th
                      className="ps-3"
                      //  style={{ width: 60 }}
                    >
                      Rank
                    </th>
                    <th>Campaign</th>
                    <th className="text-center">Clicks</th>
                    <th className="text-center">Spend</th>
                    <th className="text-center">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => (
                    <tr key={c.campaign_name}>
                      <td className="ps-3 fw-semibold">{medal(i)}</td>
                      <td className="fw-semibold">{c.campaign_name}</td>

                      <td className="text-end">
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <span className="fw-semibold">{n0(c.clicks)}</span>
                          <OverlayTrigger
                            overlay={<Tooltip>{n0(c.clicks)} clicks</Tooltip>}
                          >
                            {bar(c.clicks, maxClicks, "warning")}
                          </OverlayTrigger>
                        </div>
                      </td>

                      <td className="text-end">
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <span className="fw-semibold">
                            ${n2(c.media_cost)}
                          </span>
                          <OverlayTrigger
                            overlay={
                              <Tooltip>${n2(c.media_cost)} spent</Tooltip>
                            }
                          >
                            {bar(c.media_cost, maxSpend, "info")}
                          </OverlayTrigger>
                        </div>
                      </td>
                      <td className="text-end">
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          <span className="fw-semibold">${n2(c.revenue)}</span>
                          <OverlayTrigger
                            overlay={
                              <Tooltip>${n2(c.revenue)} revenue</Tooltip>
                            }
                          >
                            {bar(c.revenue, maxRevenue, "success")}
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>

        <Col xl={12}>
          <TopAdCreative ad={topAd} />
        </Col>
      </Row>
    </div>
  );
}
