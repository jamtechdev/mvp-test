import { useState } from "react";
import { Card } from "react-bootstrap";
import InfoPopover from "./InsightModel";
import Image from "next/image";

const PLACEHOLDER = "/images/img-placeholder.jpg";

export default function TopAdCreative({ ad }) {
  if (!ad) {
    return (
      <Card className="p-3 h-100 campign-card d-flex justify-content-center">
        <div className="text-center text-muted">No ad creative data</div>
      </Card>
    );
  }

  const [src, setSrc] = useState(ad.thumbnail_url || PLACEHOLDER);
  const ctr = ad.impressions
    ? ((ad.clicks / ad.impressions) * 100).toFixed(2)
    : "—";

  return (
    <Card className="p-3 h-100 campign-card d-flex flex-column">
      {/* header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-semibold mb-0">Top‑Performing Ad</h6>
        <InfoPopover
          title="Top Ad – AI Insight"
          description="This ad drives the most clicks vs its objective."
          placement="bottom"
        />
      </div>

      {/* content */}
      <div className="d-flex gap-3 align-items-start">
        {/* thumbnail (120 × 120) */}
        <Image
          src={src}
          alt={ad.ad_name}
          width={120}
          height={120}
          className="rounded"
          style={{ objectFit: "cover" }}
          placeholder="blur"
          blurDataURL={PLACEHOLDER}
          onError={() => setSrc(PLACEHOLDER)}
        />

        <div className="flex-grow-1">
          <h6 className="fw-semibold mb-1">{ad.ad_name}</h6>
          <div className="small text-muted mb-2">
            {ad.platform} • {ad.objective}
          </div>

          <div className="d-flex flex-wrap gap-4 small">
            <span>
              <strong>{ad.clicks.toLocaleString()}</strong> clicks
            </span>
            <span>
              <strong>{ad.impressions.toLocaleString()}</strong> impr.
            </span>
            <span>
              CTR&nbsp;
              <strong>{ctr}%</strong>
            </span>
          </div>
        </div>

        {ad.preview_url && (
          <a
            href={ad.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline-primary d-flex align-items-center"
          >
            <i className="bi bi-box-arrow-up-right me-1" /> View
          </a>
        )}
      </div>
    </Card>
  );
}
