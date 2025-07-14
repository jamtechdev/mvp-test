"use client";

import {
  Row,
  Col,
  Card,
  Table,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import unifiedPayload from "/src/_data/unifiedPayload.json";
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

export default function CampaignAnalytics() {
  const campaigns = unifiedPayload?.campaign_analytics?.campaigns || [];
  const ads = unifiedPayload?.campaign_analytics?.ads || [];

  const maxClicks = Math.max(...campaigns.map((c) => c.clicks));
  const maxSpend = Math.max(...campaigns.map((c) => c.media_cost));
  const maxRevenue = Math.max(...campaigns.map((c) => c.revenue));

  const totalConversions = ads.reduce(
    (sum, ad) => sum + (ad.conversions || 0),
    0
  );
  const totalSpend = ads.reduce((sum, ad) => sum + ad.spend, 0);
  const cpa = totalConversions > 0 ? totalSpend / totalConversions : 0;
  const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || 0), 0);

  return (
    <div className="container-fluid py-4">
      {/* Clicks Gauge + Ads Table */}
      <Row className="g-4 mb-4">
        <Col xl={4} md={12}>
          <ClicksGauge kpi={{ clicks: totalClicks }} cpa={cpa} />
        </Col>
        <Col xl={8} md={12}>
          <AdPerformanceTable ads={ads} />
        </Col>
      </Row>

      {/* Campaign Leaderboard + Top Ads */}
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
              {/* <InfoPopover
                title="Top Campaigns – AI Insight"
                payload={{ campaigns }}
                placement="bottom"
              /> */}
            </div>

            <Table
              hover
              responsive
              className="align-middle mb-0 small table-borderless"
            >
              <thead className="text-uppercase bg-light sticky-top">
                <tr>
                  <th className="ps-3">Rank</th>
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
                        <span className="fw-semibold">${n2(c.media_cost)}</span>
                        <OverlayTrigger
                          overlay={<Tooltip>${n2(c.media_cost)} spent</Tooltip>}
                        >
                          {bar(c.media_cost, maxSpend, "info")}
                        </OverlayTrigger>
                      </div>
                    </td>

                    <td className="text-end">
                      <div className="d-flex align-items-center gap-2 justify-content-end">
                        <span className="fw-semibold">${n2(c.revenue)}</span>
                        <OverlayTrigger
                          overlay={<Tooltip>${n2(c.revenue)} revenue</Tooltip>}
                        >
                          {bar(c.revenue, maxRevenue, "success")}
                        </OverlayTrigger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col xl={12}>
          <TopAdCreative ad={ads} />
        </Col>
      </Row>
    </div>
  );
}
