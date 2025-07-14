import { Card, Table } from "react-bootstrap";
import InfoPopover from "./InsightModel";

function getKPI(ad) {
  switch (ad.objective.toLowerCase()) {
    case "traffic":
      return "CPC";
    case "leads":
      return "CPL";
    case "conversions":
      return "CPA";
    case "engagement":
      return "CPE";
    default:
      return "-";
  }
}

function getKPIValue(ad) {
  const { objective, spend, clicks, leads, conversions, engagements } = ad;
  if (!spend || spend <= 0) return "-";

  switch (objective.toLowerCase()) {
    case "traffic":
      return clicks ? (spend / clicks).toFixed(2) : "-";
    case "leads":
      return leads ? (spend / leads).toFixed(2) : "-";
    case "conversions":
      return conversions ? (spend / conversions).toFixed(2) : "-";
    case "engagement":
      return engagements ? (spend / engagements).toFixed(2) : "-";
    default:
      return "-";
  }
}

export default function AdPerformanceTable({ ads = [] }) {
  return (
    <Card className="p-3 h-100 campign-card">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-semibold mb-0">Top Ads Per Objectives</h6>
        <InfoPopover
          title="Top Ads – AI Insight"
          payload={{ ads }}
          placement="left"
          description="Surface your best ad on each platform and objective."
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
            <th className="text-end">Cost / KPI ($)</th>
            <th className="text-end">Impr.</th>
            <th className="text-end">Clicks</th>
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
                <td className="text-end">${getKPIValue(ad)}</td>
                <td className="text-end">{ad.impressions.toLocaleString()}</td>
                <td className="text-end">{ad.clicks.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-muted">
                No ad-level data
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Card>
  );
}
