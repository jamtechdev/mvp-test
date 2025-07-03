import { useState, useMemo } from "react";
import { Card } from "react-bootstrap";
import InfoPopover from "./InsightModel";
import Image from "next/image";
import ImagePopup from "./ImagePopup";
import VideoPopup from "./VideoModal";

const PLACEHOLDER = "/images/img-placeholder.jpg";
const ACCENT = "#A4E5DF";
const ACCENT_DARK = "#04524A";
const CHIP_SIZE = 28; // easy to tweak once

export default function TopAdCreative({ ad = [] }) {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  /* early‑exit card */
  if (!ad.length) {
    return (
      <Card className="p-3 h-100 campign-card d-flex justify-content-center">
        <div className="text-center text-muted">No ad creative data</div>
      </Card>
    );
  }

  /* clicks → CTR sort */
  const sortedAds = useMemo(() => {
    return [...ad].sort((a, b) => {
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      const ctrA = a.impressions ? a.clicks / a.impressions : 0;
      const ctrB = b.impressions ? b.clicks / b.impressions : 0;
      return ctrB - ctrA;
    });
  }, [ad]);

  /* helpers */
  const openVideo = (url) => {
    setVideoUrl(url);
    setShowVideoModal(true);
  };
  const openImage = (src, alt) => {
    setImageSrc(src);
    setImageAlt(alt);
    setShowImageModal(true);
  };

  return (
    <>
      <Card className="p-3 h-100 campign-card d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">Top‑Performing Ad</h6>
          <InfoPopover
            title="Top Ad – AI Insight"
            description="This ad drives the most clicks vs its objective."
            placement="bottom"
          />
        </div>

        {sortedAds.map((creative, idx) => {
          const isVideo = !!creative.video_url;
          const thumbnail = creative.thumbnail_url || PLACEHOLDER;
          const ctr = creative.impressions
            ? ((creative.clicks / creative.impressions) * 100).toFixed(2)
            : "—";
          const cpl =
            creative.leads && creative.leads > 0
              ? (creative.spend / creative.leads).toFixed(2)
              : creative.conversions && creative.conversions > 0
              ? (creative.spend / creative.conversions).toFixed(2)
              : null;

          const open = () =>
            isVideo
              ? openVideo(creative.video_url)
              : openImage(thumbnail, creative.ad_name);

          return (
            <div
              key={`${creative.ad_name}-${idx}`}
              className="d-flex gap-3 align-items-start performing-card"
              style={{ position: "relative", cursor: "pointer" }}
              onClick={open}
            >
              {/* permanent mint chip */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: CHIP_SIZE,
                  height: CHIP_SIZE,
                  borderRadius: CHIP_SIZE,
                  border: `2px solid ${ACCENT}`,
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
                aria-label={isVideo ? "Play video" : "View image"}
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
              >
                <i
                  className={isVideo ? "ri-play-fill" : "ri-image-line"}
                  style={{ color: ACCENT_DARK, fontSize: 16 }}
                />
              </div>

              {/* thumbnail */}
              <div
                style={{
                  width: 120,
                  height: 120,
                  flexShrink: 0,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <Image
                  src={thumbnail}
                  alt={creative.ad_name}
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                  blurDataURL={PLACEHOLDER}
                />
              </div>

              {/* metrics/info */}
              <div className="flex-grow-1">
                <h6 className="fw-semibold mb-1">{creative.ad_name}</h6>

                <div className="small text-muted mb-2">
                  {creative.platform} • {creative.objective}
                </div>

                <div className="d-flex flex-wrap gap-4 small value-text">
                  <span>
                    <strong>{creative.clicks.toLocaleString()}</strong> clicks
                  </span>
                  <span>
                    <strong>{creative.impressions.toLocaleString()}</strong>{" "}
                    impr.
                  </span>
                  <span>
                    CTR <strong>{ctr}%</strong>
                  </span>
                  {cpl && (
                    <span>
                      CPL <strong>${cpl}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Card>

      {/* video modal */}
      <VideoPopup
        show={showVideoModal}
        file={videoUrl}
        onClose={() => {
          setShowVideoModal(false);
          setVideoUrl("");
        }}
      />

      {/* image modal */}
      <ImagePopup
        show={showImageModal}
        src={imageSrc}
        alt={imageAlt}
        onClose={() => {
          setShowImageModal(false);
          setImageSrc("");
          setImageAlt("");
        }}
      />
    </>
  );
}
