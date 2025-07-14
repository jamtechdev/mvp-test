"use client";

import { Row, Col, ProgressBar } from "react-bootstrap";
import InfoPopover from "./InsightModel";
import {
  RiBankCardFill,
  RiGroupLine,
  RiFilterLine,
  RiWallet3Line,
} from "react-icons/ri";
import { n0 } from "@/_utils/formatNumber";
import unified from "../../_data/unifiedPayload.json";

const DEFAULT_META = [
  { key: "spend", label: "Spend", icon: <RiBankCardFill size={26} /> },
  { key: "impressions", label: "Impressions", icon: <RiGroupLine size={26} /> },
  { key: "leads", label: "Leads", icon: <RiFilterLine size={26} /> },
  { key: "revenue", label: "Revenue", icon: <RiWallet3Line size={26} /> },
];

export default function KPIStatCards() {
  const kpiData = unified.kpi_cards?.metrics || [];

  return (
    <Row className="g-3 mb-0">
      {DEFAULT_META.map(({ key, label, icon }) => {
        const metric = kpiData.find((m) => m.key === key);
        if (!metric) return null;

        const { value, target = 1, percentage = 0 } = metric;
        const variant =
          percentage >= 100
            ? "success"
            : percentage >= 75
            ? "warning"
            : "danger";

        return (
          <Col xl={3} md={6} key={key}>
            <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
              <InfoPopover
                title={`${label} – Target ${n0(target)}`}
                placement="bottom"
                kpi={{ [key]: value }}
                targets={{ [key]: target }}
                description="Progress toward target"
              />

              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <small className="text-muted fw-semibold">{label}</small>
                    <h3 className="fs-20 mb-0">
                      {n0(value)}
                      <span
                        className={`badge text-bg-${variant} ms-2`}
                        style={{ fontSize: 13 }}
                      >
                        {percentage.toFixed(0)}%
                      </span>
                    </h3>
                  </div>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                </div>

                <ProgressBar
                  now={Math.min(percentage, 100)}
                  variant={variant}
                  style={{ height: 6 }}
                />

                <div className="fs-12 mt-1 text-muted fw-semibold">
                  Target {n0(target)}
                </div>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
