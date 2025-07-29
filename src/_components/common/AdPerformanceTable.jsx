import { Card, Table } from "react-bootstrap";
import InfoPopover from "./InsightModel";

function getKPI(ad) {
  const obj = ad?.objective?.toLowerCase?.();
  switch (obj) {
    case "traffic":
      return "CPC";
    case "leads":
      return "CPL";
    case "sales":
      return "CPA";
    default:
      return "KPI";
  }
}

const getKPIValue = (ad) => {
  switch (ad.objective.toLowerCase()) {
    case "traffic":
      return ad.clicks;
    case "leads":
      return ad.leads;
    case "conversions":
      return ad.conversions;
    case "engagement":
      return ad.engagements;
    case "revenue":
      return ad.revenue;
    default:
      return null;
  }
};

export default function AdPerformanceTable({ ads = [] }) {
  return (
    <Card className="p-3 h-100 campign-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold mb-0">Top Ads Per Objectives</h6>
        <InfoPopover
          title="Top Ads – AI Insight"
          payload={{ ads }}
          placement="bottom"
          description="Surface your best ad on each platform and objective."
          caseId="topAdsByObjective"
        />
      </div>

      <Table size="sm" hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Ad Name</th>
            <th>Platform</th>
            <th>Objective</th>
            <th>KPI</th>
            <th className="text-start">Cost / KPI ($)</th>
            <th className="text-start">Impr.</th>
            <th className="text-start">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {ads.length ? (
            ads.map((ad, i) => (
              <tr key={ad.ad_id || i}>
                <td>{i + 1}</td>
                <td>{ad.ad_name || "Untitled"}</td>

                <td>
                  {ad.platform === "facebook" && (
                    <i className="bi bi-facebook text-primary me-1" />
                  )}
                  {ad.platform === "google" && (
                    <i className="bi bi-google text-danger me-1" />
                  )}
                  {ad.platform === "linkedin" && (
                    <i className="bi bi-linkedin text-primary me-1" />
                  )}
                  {ad.platform?.charAt(0).toUpperCase() + ad.platform?.slice(1)}
                </td>

                <td>{ad.objective}</td>
                <td>{getKPI(ad)}</td>
                <td>
                  {getKPIValue(ad) && ad.spend
                    ? `$${(ad.spend / getKPIValue(ad)).toFixed(2)}`
                    : "—"}
                </td>

                <td className="text-start">
                  {ad.impressions != null
                    ? ad.impressions.toLocaleString()
                    : "-"}
                </td>

                <td className="text-start">{ad.clicks.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center ">
                No ad-level data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}
