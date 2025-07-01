import { Row, Col, ProgressBar } from "react-bootstrap";
import InfoPopover from "./InsightModel";

export default function KPIStatCards({
  kpi = {},
  targets = {},
  meta = DEFAULT_META,
}) {
  return (
    <Row className="g-3 mb-0">
      {meta.map(({ label, key, icon }) => {
        const value = kpi[key] ?? 0;
        const target = targets[key] ?? 1;
        const pct = (value / target) * 100;

        const variant =
          pct >= 100 ? "success" : pct >= 75 ? "warning" : "danger";

        return (
          <Col xl={3} md={6} key={key}>
            <div className="card bg-white click-card border-1 rounded-3 mb-4 stats-box position-relative">
              {/* popover */}
              <InfoPopover
                title={`${label} – Target ${n0(target)}`}
                description="Progress toward target"
                placement="bottom"
              />

              {/* body */}
              <div className="card-body p-4">
                {/* header row */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <small className="text-muted fw-semibold">{label}</small>
                    <h3 className="fs-20 mb-0">
                      {n0(value)}
                      <span
                        className={`badge text-bg-${variant} ms-2`}
                        style={{ fontSize: 13 }}
                      >
                        {pct.toFixed(0)}%
                      </span>
                    </h3>
                  </div>
                  <div style={{ fontSize: 28 }}>{icon}</div>
                </div>

                {/* progress bar */}
                <ProgressBar
                  now={Math.min(pct, 100)}
                  variant={variant}
                  style={{ height: 6 }}
                />

                <div className="fs-12 mt-1">Target {n0(target)}</div>
              </div>
            </div>
          </Col>
        );
      })}
    </Row>
  );
}

/* ---------- default meta (customise if needed) ---------- */
import {
  FiSend,
  FiMousePointer,
  FiShoppingCart,
  FiTrendingUp,
} from "react-icons/fi";
import { n0 } from "@/_utils/formatNumber";

const DEFAULT_META = [
  { key: "spend", label: "Spend", icon: <FiSend /> },
  { key: "impressions", label: "Impressions", icon: <FiMousePointer /> },
  { key: "leads", label: "Leads", icon: <FiShoppingCart /> },
  { key: "revenue", label: "Revenue", icon: <FiTrendingUp /> },
];
