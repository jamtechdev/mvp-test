"use client";
import LayoutManager from "@/_components/common/LayoutManager";
import CampaignDashboard from "../../_components/CampaignDashboard";

export default function AnalyticsPage() {
  return (
    <LayoutManager includeAuthLayout={true}>
      <CampaignDashboard channel="all" />
    </LayoutManager>
  );
}
