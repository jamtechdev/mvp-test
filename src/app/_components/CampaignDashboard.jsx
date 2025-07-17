"use client";
import { useMemo, useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import { getData } from "@/_utils/campaignUtils";
import CampaignFunnel from "@/_components/common/FunnelChart";
import KpiTrendCard from "@/_components/common/KPIChart";
import CampaignAnalytics from "@/_components/common/CampaignAnalytics";
import CampaignFilterBar from "@/_components/common/CampaignFilterBar";
import KPIStatCards from "@/_components/common/KPIStatCards";
import ChannelMetricCards from "@/_components/common/ChannelMetricCards";
import ChatBotWidget from "@/_components/common/ChatBotWidget";
import { ChatBotProvider, useChatBot } from "@/_context/ChatBotContext";

export default function CampaignDashboard({ channel1 = "all" }) {
  const canonical = channel1.toLowerCase();
  const [range, setRange] = useState({
    start: new Date(Date.now() - 7 * 864e5),
    end: new Date(),
  });
  const [selectedChannel, setSelectedChannel] = useState("All");

  const [lastUpdated, setLastUpdated] = useState("");
  useEffect(() => setLastUpdated(new Date().toLocaleTimeString()), []);

  const refreshData = () => {
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const rows = useMemo(() => getData(canonical), [canonical]);

  const campaignOptions = useMemo(() => {
    const names = Array.from(
      new Set(rows.map((r) => r.campaign_name?.trim()).filter(Boolean))
    );
    return ["All", ...names];
  }, [rows]);

  const [selectedCampaign, setSelectedCampaign] = useState("All");

  return (
    <ChatBotProvider>
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
        <KPIStatCards />

        <Row className="g-4 mb-4">
          <Col xl={8} md={12} className="d-flex">
            {/*----------------------- FUNNEL ------------------------*/}
            <CampaignFunnel />
          </Col>
          <Col xl={4} md={12} className="d-flex">
            {/*-------------- KPI TREND DROPDOWN ------------------------*/}
            <KpiTrendCard />
          </Col>
        </Row>
        {/*-------------------------- DONUT CHARTS--------------------------- */}
        <ChannelMetricCards />
        {/* -----------------TABLES---------------------------------- */}
        <CampaignAnalytics />
      </div>

      {/* ✅ Render global chatbot widget ONCE only here */}
      <GlobalChatBot />
    </ChatBotProvider>
  );
}

// ✅ Global bot renderer
function GlobalChatBot() {
  const { open, setOpen, sessionId, aiInput, contextTitle } = useChatBot();

  return (
    <ChatBotWidget
      key={sessionId}
      open={open}
      setOpen={setOpen}
      aiInput={aiInput}
      contextTitle={contextTitle}
      sessionId={sessionId}
    />
  );
}

