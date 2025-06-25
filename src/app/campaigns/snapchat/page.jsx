"use client";
import LayoutManager from "@/_components/common/LayoutManager";
import CampaignDashboard from "../../_components/CampaignDashboard";

export default function SnapChatPage() {
  return (
    <LayoutManager includeAuthLayout={true}>
      <CampaignDashboard channel="snapchat"  />
    </LayoutManager>
  );
}
