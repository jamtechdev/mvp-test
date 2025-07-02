"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Card, Row, Col } from "react-bootstrap";

import {
  getData,
  deviceBreakdown,
  sessionChannelBreakdown,
  revenueByChannel,
} from "@/_utils/campaignUtils";
import InfoPopover from "@/_components/common/InsightModel";
import CampaignFunnel from "@/_components/common/FunnelChart";
import KpiTrendCard from "@/_components/common/KPIChart";
import CampaignAnalytics from "@/_components/common/CampaignAnalytics";
import CampaignFilterBar from "@/_components/common/CampaignFilterBar";
import KPIStatCards from "@/_components/common/KPIStatCards";
import ChannelMetricCards from "@/_components/common/ChannelMetricCards";
export default function CampaignDashboard({ channel1 = "all" }) {
  const canonical = channel1.toLowerCase();
  const [range, setRange] = useState({
    start: new Date(Date.now() - 7 * 864e5),
    end: new Date(),
  });
  const [metric, setMetric] = useState("spend");
  const [selectedChannel, setSelectedChannel] = useState("All");

  const [lastUpdated, setLastUpdated] = useState("");
  useEffect(() => setLastUpdated(new Date().toLocaleTimeString()), []);

  const refreshData = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const rows = useMemo(() => getData(canonical), [canonical]);
  const devicePie = useMemo(() => deviceBreakdown(), []);
  const sessions = useMemo(() => sessionChannelBreakdown(rows), [rows]);
  const revenue = useMemo(() => revenueByChannel(), []);
  const campaignOptions = useMemo(() => {
    const names = Array.from(
      new Set(rows.map((r) => r.campaign_name?.trim()).filter(Boolean))
    );
    return ["All", ...names];
  }, [rows]);
  const [selectedCampaign, setSelectedCampaign] = useState("All");

  const trendSeries = useMemo(() => {
    const byDate = {};
    rows.forEach((r) => {
      const raw = r.date;
      const dt = new Date(raw);
      if (!isNaN(dt)) {
        const key = dt.toISOString().slice(0, 10);
        byDate[key] = (byDate[key] || 0) + Number(r[metric] || 0);
      }
    });

    return [
      {
        name: metric,
        data: Object.entries(byDate)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([d, v]) => ({ x: new Date(d), y: v })),
      },
    ];
  }, [rows, metric]);

  const kpi = { spend: 3450, impressions: 88000, leads: 560, revenue: 2400 };
  const goals = { spend: 4000, impressions: 100000, leads: 800, revenue: 3000 };
  return (
    <div className="container-fluid py-4">
      {/*--------------- TOP FILTER BAR----------------------- */}
      <CampaignFilterBar
        range={range}
        onRangeChange={setRange}
        campaignOptions={campaignOptions}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        channels={["All", "Facebook", "Google", "LinkedIn"]}
        selectedChannel={selectedChannel}
        onChannelChange={setSelectedChannel}
        lastUpdated="3 min ago"
        onRefresh={refreshData}
      />
      {/* -------------------------KPI CARDS------------------------ */}
      <KPIStatCards kpi={kpi} targets={goals} />

      <Row className="g-4 mb-4">
        {/*----------------------- FUNNEL ------------------------*/}
        <Col xl={8} md={12} className="d-flex">
          <Card className="p-3 campign-card h-100 flex-fill">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-semibold text-muted mb-0">Campaign Funnel</h6>
              <InfoPopover
                title="Campaign Funnel – AI Insight"
                description="Identify the biggest drop‑offs and optimise."
                placement="bottom"
              />
            </div>
            {<CampaignFunnel />}
          </Card>
        </Col>

        {/*-------------- KPI TREND DROPDOWN ------------------------*/}
        <KpiTrendCard trendSeries={trendSeries} />
      </Row>
      {/*-------------------------- DONUT CHARTS--------------------------- */}
      <ChannelMetricCards
        devicePie={devicePie}
        sessions={sessions}
        revenue={revenue}
      />
      {/* -----------------TABLES---------------------------------- */}
      <CampaignAnalytics />
    </div>
  );
}
